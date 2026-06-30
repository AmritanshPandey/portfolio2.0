"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface ConstellationNetworkProps {
  className?: string
  /** Overall opacity of the field (0–1). */
  opacity?: number
  /** Explicit particle count; otherwise derived from the band area × density. */
  count?: number
  /** Multiplier on the derived particle count (1 = default). */
  density?: number
  /** Max distance (px) at which two particles are linked. */
  linkDistance?: number
  /** Cap on links drawn per particle — keeps the mesh clean rather than busy. */
  maxLinksPerNode?: number
  /** Drift speed in px/sec. */
  speed?: number
  /** Cursor influence radius (px) — links + gentle attraction + accent halo. */
  cursorRadius?: number
  /** Depth spread: dot size / brightness / drift variation (0 = flat, 1 = full). */
  parallax?: number
  /** Per-particle opacity breathing amount (0 = off). */
  twinkle?: number
  /** Additive glow + cursor halo intensity (0 = none). */
  glow?: number
  /** How strongly the cursor region tints toward the accent colour (0–1). */
  accentStrength?: number
  /** Soft edge dissolve as a fraction of the band (0 = hard edges). */
  edgeFade?: number
  colorLightVar?: string
  colorDarkVar?: string
  glowColorLightVar?: string
  glowColorDarkVar?: string
}

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  /** depth 0 (far) → 1 (near) */
  z: number
  /** twinkle phase offset */
  ph: number
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * A drifting particle network. Nearby particles link with thin lines whose
 * opacity falls off with distance; particles vary in depth (size, brightness,
 * drift speed) for dimensionality; the field dissolves softly at its edges. The
 * cursor is the one warm moment — a soft accent halo eases in around it, tinting
 * and lifting the particles it passes. Canvas, theme-aware, static under
 * prefers-reduced-motion.
 *
 * Refined by default; pass higher `glow` / `density` / `accentStrength` /
 * `parallax` to dial it up toward a richer, atmospheric look.
 */
export function ConstellationNetwork({
  className,
  opacity = 1,
  count,
  density = 1,
  linkDistance = 120,
  maxLinksPerNode = 5,
  speed = 14,
  cursorRadius = 160,
  parallax = 0.5,
  twinkle = 0.4,
  glow = 0.15,
  accentStrength = 0.7,
  edgeFade = 0.12,
  colorLightVar,
  colorDarkVar,
  glowColorLightVar,
  glowColorDarkVar,
}: ConstellationNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const probe = document.createElement("canvas")
    probe.width = probe.height = 1
    const pctx = probe.getContext("2d")
    const toRGB = (value: string) => {
      if (!pctx) return [115, 115, 115] as const
      pctx.clearRect(0, 0, 1, 1)
      pctx.fillStyle = "#737373"
      pctx.fillStyle = value
      pctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = pctx.getImageData(0, 0, 1, 1).data
      return [r, g, b] as const
    }
    const resolveVar = (name: string | undefined, fallback: string) => {
      const raw = name
        ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        : ""
      return toRGB(raw || fallback)
    }

    let base: readonly [number, number, number] = [115, 115, 115]
    let glowC: readonly [number, number, number] = [115, 115, 115]
    const refreshColors = () => {
      const dark = document.documentElement.classList.contains("dark")
      base = resolveVar(dark ? colorDarkVar : colorLightVar, "#737373")
      glowC = resolveVar(dark ? glowColorDarkVar : glowColorLightVar, dark ? "#ffffff" : "#000000")
    }

    let nodes: Node[] = []
    let width = 0
    let height = 0
    let mx = -9999
    let my = -9999
    let inside = false
    let cursorEase = 0
    let visible = true
    let raf = 0
    let lastT = 0

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const derived = Math.min(110, Math.max(28, Math.round((width * height) / 12000)))
      const n = Math.round((count ?? derived) * density)
      nodes = []
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const z = Math.random()
        // Nearer particles drift a touch faster — subtle parallax.
        const sp = speed * mix(1, mix(0.55, 1.35, z), parallax)
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          z,
          ph: Math.random() * Math.PI * 2,
        })
      }
      // Draw far → near so nearer (bigger/brighter) dots sit on top.
      nodes.sort((p, q) => p.z - q.z)
    }

    const link2 = linkDistance * linkDistance
    const cursor2 = cursorRadius * cursorRadius

    // Uniform spatial grid for near-O(n) link lookups (cell = linkDistance).
    const linkNeighbors = (cb: (i: number, j: number, d2: number) => void) => {
      const cell = Math.max(1, linkDistance)
      const cols = Math.max(1, Math.ceil(width / cell))
      const rows = Math.max(1, Math.ceil(height / cell))
      const grid: number[][] = new Array(cols * rows)
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i]
        const cx = Math.min(cols - 1, Math.max(0, Math.floor(p.x / cell)))
        const cy = Math.min(rows - 1, Math.max(0, Math.floor(p.y / cell)))
        const key = cy * cols + cx
        ;(grid[key] || (grid[key] = [])).push(i)
      }
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          const cur = grid[cy * cols + cx]
          if (!cur) continue
          for (let oy = 0; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              if (oy === 0 && ox < 0) continue // visit each pair once
              const nx = cx + ox
              const ny = cy + oy
              if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
              const nb = grid[ny * cols + nx]
              if (!nb) continue
              const same = oy === 0 && ox === 0
              for (let a = 0; a < cur.length; a++) {
                const i = cur[a]
                for (let b = same ? a + 1 : 0; b < nb.length; b++) {
                  const j = nb[b]
                  const dx = nodes[i].x - nodes[j].x
                  const dy = nodes[i].y - nodes[j].y
                  const d2 = dx * dx + dy * dy
                  if (d2 <= link2) cb(i, j, d2)
                }
              }
            }
          }
        }
      }
    }

    const draw = (t = 0) => {
      const dt = lastT ? Math.min(Math.max((t - lastT) / 1000, 1 / 240), 1 / 30) : 1 / 60
      lastT = t
      const tsec = t / 1000

      // Ease the cursor influence in/out — no instant snap.
      const target = inside && mx > -9000 ? 1 : 0
      cursorEase += (target - cursorEase) * (1 - Math.exp(-6 * dt))
      if (cursorEase < 0.001) cursorEase = 0

      ctx.clearRect(0, 0, width, height)

      // integrate (wrap-around — with edge fade the wrap is invisible)
      if (!reduced) {
        for (const p of nodes) {
          if (cursorEase > 0.01 && mx > -9000) {
            const dx = mx - p.x
            const dy = my - p.y
            const d2 = dx * dx + dy * dy
            if (d2 < cursor2 && d2 > 1) {
              const f = (1 - d2 / cursor2) * 40 * cursorEase
              const inv = 1 / Math.sqrt(d2)
              p.vx += dx * inv * f * dt
              p.vy += dy * inv * f * dt
            }
          }
          p.vx *= 0.99
          p.vy *= 0.99
          p.x += p.vx * dt
          p.y += p.vy * dt
          if (p.x < 0) p.x += width
          else if (p.x > width) p.x -= width
          if (p.y < 0) p.y += height
          else if (p.y > height) p.y -= height
        }
      }

      const [br, bg, bb] = base
      const [gr, gg, gb] = glowC
      ctx.lineCap = "round"

      // ── Links via spatial grid, capped per node for a clean mesh ──────────
      const linkCount = new Int16Array(nodes.length)
      linkNeighbors((i, j, d2) => {
        if (linkCount[i] >= maxLinksPerNode || linkCount[j] >= maxLinksPerNode) return
        linkCount[i]++
        linkCount[j]++
        const a = nodes[i]
        const b = nodes[j]
        const fade = 1 - d2 / link2
        const f2 = fade * fade // faster far-fade = cleaner
        const depth = (a.z + b.z) * 0.5

        // Tint links toward the accent near the cursor.
        let tint = 0
        if (cursorEase > 0.01) {
          const mxd = (a.x + b.x) * 0.5 - mx
          const myd = (a.y + b.y) * 0.5 - my
          const near = Math.max(0, 1 - (mxd * mxd + myd * myd) / cursor2)
          tint = near * accentStrength * cursorEase
        }
        const r = Math.round(mix(br, gr, tint))
        const g = Math.round(mix(bg, gg, tint))
        const bl = Math.round(mix(bb, gb, tint))

        ctx.globalAlpha = opacity * f2 * mix(0.28, 0.5, depth) * (1 + glow * tint)
        ctx.strokeStyle = `rgb(${r}, ${g}, ${bl})`
        ctx.lineWidth = mix(0.6, 1.1, f2)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      })

      // ── Cursor halo — the one warm, pooled moment ─────────────────────────
      if (cursorEase > 0.01 && glow > 0) {
        const rad = cursorRadius * 0.9
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, rad)
        halo.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${0.22 * glow * cursorEase})`)
        halo.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`)
        ctx.globalAlpha = 1
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(mx, my, rad, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── Cursor links (tinted toward the accent) ───────────────────────────
      if (cursorEase > 0.01) {
        for (const p of nodes) {
          const dx = p.x - mx
          const dy = p.y - my
          const d2 = dx * dx + dy * dy
          if (d2 > cursor2) continue
          const fade = 1 - d2 / cursor2
          ctx.globalAlpha = opacity * fade * 0.8 * cursorEase
          ctx.strokeStyle = `rgb(${gr}, ${gg}, ${gb})`
          ctx.lineWidth = mix(0.6, 1.1, fade)
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mx, my)
          ctx.stroke()
        }
      }

      // ── Dots — depth-sized, gently twinkling, accent-lifted near cursor ──
      for (const p of nodes) {
        let near = 0
        if (cursorEase > 0.01) {
          const dx = p.x - mx
          const dy = p.y - my
          near = Math.max(0, 1 - (dx * dx + dy * dy) / cursor2) * cursorEase
        }
        const sizeZ = mix(1.4, mix(1.4, 2.6, p.z), parallax)
        const r = sizeZ + near * 1.4
        const baseA = mix(0.5, mix(0.42, 1, p.z), parallax)
        const tw = reduced ? 1 : 1 + twinkle * 0.5 * Math.sin(tsec * 1.6 + p.ph)
        const tint = near * accentStrength
        ctx.globalAlpha = Math.min(1, opacity * baseA * tw * (0.7 + near * 0.6))
        ctx.fillStyle =
          tint > 0.04
            ? `rgb(${Math.round(mix(br, gr, tint))}, ${Math.round(mix(bg, gg, tint))}, ${Math.round(mix(bb, gb, tint))})`
            : `rgb(${br}, ${bg}, ${bb})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    }

    const loop = (t: number) => {
      draw(t)
      raf = visible ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      if (!raf && visible && !reduced) raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
      mx = x
      my = y
      kick()
    }
    const onLeave = () => {
      inside = false
    }

    refreshColors()
    build()
    draw(0)
    if (!reduced) kick()

    const ro = new ResizeObserver(() => build())
    ro.observe(canvas)
    const mo = new MutationObserver(() => {
      refreshColors()
      if (reduced) draw(0)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) kick()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("blur", onLeave)
    document.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("blur", onLeave)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [
    opacity,
    count,
    density,
    linkDistance,
    maxLinksPerNode,
    speed,
    cursorRadius,
    parallax,
    twinkle,
    glow,
    accentStrength,
    colorLightVar,
    colorDarkVar,
    glowColorLightVar,
    glowColorDarkVar,
  ])

  // Soft edge dissolve — a CSS mask (GPU-cheap) so the field frames itself
  // instead of hard-cutting at the band edges.
  const mask =
    edgeFade > 0
      ? `radial-gradient(ellipse farthest-side at center, #000 ${Math.round(
          (1 - edgeFade) * 100
        )}%, transparent 100%)`
      : undefined

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    />
  )
}
