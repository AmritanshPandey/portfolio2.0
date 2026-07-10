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

type RenderNode = Node & {
  sx: number
  sy: number
  near: number
  pulse: number
}

type Ripple = {
  x: number
  y: number
  start: number
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
  density = 1.35,
  linkDistance = 145,
  maxLinksPerNode = 4,
  speed = 12,
  cursorRadius = 190,
  parallax = 0.68,
  twinkle = 0.52,
  glow = 0.3,
  accentStrength = 0.86,
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
    let cx = -9999
    let cy = -9999
    let prevCx = -9999
    let prevCy = -9999
    let inside = false
    let cursorEase = 0
    let cursorSpeed = 0
    let ripples: Ripple[] = []
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
      if (target > 0 && cx < -9000) {
        cx = mx
        cy = my
        prevCx = mx
        prevCy = my
      }
      if (cx > -9000) {
        cx += (mx - cx) * (1 - Math.exp(-10 * dt))
        cy += (my - cy) * (1 - Math.exp(-10 * dt))
        const instantSpeed =
          prevCx > -9000 ? Math.hypot(cx - prevCx, cy - prevCy) / Math.max(dt, 1 / 240) : 0
        cursorSpeed += (instantSpeed - cursorSpeed) * (1 - Math.exp(-7 * dt))
        prevCx = cx
        prevCy = cy
      }

      ctx.clearRect(0, 0, width, height)

      // integrate (wrap-around — with edge fade the wrap is invisible)
      if (!reduced) {
        for (const p of nodes) {
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

      // Drop finished ripples and build temporary display positions. The node
      // simulation remains calm; cursor/ripple motion is a bounded lens only.
      ripples = ripples.filter((r) => (t - r.start) / 1000 < 1.25)
      const renderNodes: RenderNode[] = nodes.map((p) => {
        let sx = p.x
        let sy = p.y
        let near = 0
        let pulse = 0

        if (cursorEase > 0.01 && cx > -9000) {
          const dx = p.x - cx
          const dy = p.y - cy
          const d2 = dx * dx + dy * dy
          if (d2 < cursor2 && d2 > 0.001) {
            const d = Math.sqrt(d2)
            const inv = 1 / d
            const nx = dx * inv
            const ny = dy * inv
            near = Math.max(0, 1 - d / cursorRadius) * cursorEase
            const lens = near * near
            const motion = Math.min(1, cursorSpeed / 900)
            const pull = lens * mix(10, 26, p.z)
            const orbit = lens * motion * mix(8, 24, p.z)
            sx -= nx * pull
            sy -= ny * pull
            sx += -ny * orbit
            sy += nx * orbit
          }
        }

        for (const ripple of ripples) {
          const age = (t - ripple.start) / 1000
          const life = Math.max(0, 1 - age / 1.25)
          const dx = p.x - ripple.x
          const dy = p.y - ripple.y
          const d = Math.max(0.001, Math.hypot(dx, dy))
          const ring = age * 320
          const band = Math.exp(-((d - ring) * (d - ring)) / (2 * 42 * 42)) * life
          pulse = Math.max(pulse, band)
          sx += (dx / d) * band * mix(10, 22, p.z)
          sy += (dy / d) * band * mix(10, 22, p.z)
        }

        return { ...p, sx, sy, near, pulse }
      })

      // ── Links via spatial grid, capped per node for a clean mesh ──────────
      // Eligibility + fade use the RENDER-space distance (the displaced sx/sy
      // the line is actually drawn between), so cursor/ripple lensing can't
      // leave visually distant links bright or draw them past linkDistance.
      const linkCount = new Int16Array(nodes.length)
      linkNeighbors((i, j) => {
        const a = renderNodes[i]
        const b = renderNodes[j]
        const dx = a.sx - b.sx
        const dy = a.sy - b.sy
        const d2 = dx * dx + dy * dy
        if (d2 > link2) return
        if (linkCount[i] >= maxLinksPerNode || linkCount[j] >= maxLinksPerNode) return
        linkCount[i]++
        linkCount[j]++
        const fade = 1 - d2 / link2
        const f2 = fade * fade // faster far-fade = cleaner
        const depth = (a.z + b.z) * 0.5

        // Tint links toward the accent near the cursor.
        const tint = Math.min(1, Math.max(a.near, b.near, a.pulse, b.pulse) * accentStrength)
        const r = Math.round(mix(br, gr, tint))
        const g = Math.round(mix(bg, gg, tint))
        const bl = Math.round(mix(bb, gb, tint))

        ctx.globalAlpha = opacity * f2 * mix(0.2, 0.52, depth) * (1 + glow * 1.8 * tint)
        ctx.strokeStyle = `rgb(${r}, ${g}, ${bl})`
        ctx.lineWidth = mix(0.45, 1.15, f2) + tint * 0.5
        ctx.beginPath()
        ctx.moveTo(a.sx, a.sy)
        ctx.lineTo(b.sx, b.sy)
        ctx.stroke()
      })

      // ── Cursor halo — the one warm, pooled moment ─────────────────────────
      if (cursorEase > 0.01 && glow > 0 && cx > -9000) {
        const rad = cursorRadius * (0.86 + Math.min(0.18, cursorSpeed / 5000))
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        halo.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${0.28 * glow * cursorEase})`)
        halo.addColorStop(0.42, `rgba(${gr}, ${gg}, ${gb}, ${0.1 * glow * cursorEase})`)
        halo.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`)
        ctx.globalAlpha = 1
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── Click ripples — expanding accent rings through the graph ──────────
      for (const ripple of ripples) {
        const age = (t - ripple.start) / 1000
        const life = Math.max(0, 1 - age / 1.25)
        const ring = age * 320
        ctx.globalAlpha = opacity * glow * 0.75 * life
        ctx.strokeStyle = `rgb(${gr}, ${gg}, ${gb})`
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.arc(ripple.x, ripple.y, ring, 0, Math.PI * 2)
        ctx.stroke()
      }

      // ── Cursor links (tinted toward the accent) ───────────────────────────
      if (cursorEase > 0.01 && cx > -9000) {
        const linked = renderNodes
          .map((p) => {
            const dx = p.sx - cx
            const dy = p.sy - cy
            return { p, d2: dx * dx + dy * dy }
          })
          .filter(({ d2 }) => d2 <= cursor2)
          .sort((a, b) => a.d2 - b.d2)
          .slice(0, 18)

        for (const { p, d2 } of linked) {
          const fade = 1 - d2 / cursor2
          ctx.globalAlpha = opacity * fade * 0.65 * cursorEase
          ctx.strokeStyle = `rgb(${gr}, ${gg}, ${gb})`
          ctx.lineWidth = mix(0.45, 1.25, fade)
          ctx.beginPath()
          ctx.moveTo(p.sx, p.sy)
          ctx.lineTo(cx, cy)
          ctx.stroke()
        }

        ctx.globalAlpha = opacity * cursorEase
        ctx.strokeStyle = `rgba(${gr}, ${gg}, ${gb}, ${0.32 + glow * 0.22})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(cx, cy, 18 + Math.min(10, cursorSpeed / 80), 0, Math.PI * 2)
        ctx.stroke()
      }

      // ── Dots — depth-sized, gently twinkling, accent-lifted near cursor ──
      for (const p of renderNodes) {
        const near = Math.max(p.near, p.pulse * 0.8)
        const sizeZ = mix(1.4, mix(1.4, 2.6, p.z), parallax)
        const r = sizeZ + near * 1.65
        const baseA = mix(0.42, mix(0.36, 0.92, p.z), parallax)
        const tw = reduced ? 1 : 1 + twinkle * 0.5 * Math.sin(tsec * 1.6 + p.ph)
        const tint = near * accentStrength
        ctx.globalAlpha = Math.min(1, opacity * baseA * tw * (0.74 + near * 0.8))
        ctx.fillStyle =
          tint > 0.04
            ? `rgb(${Math.round(mix(br, gr, tint))}, ${Math.round(mix(bg, gg, tint))}, ${Math.round(mix(bb, gb, tint))})`
            : `rgb(${br}, ${bg}, ${bb})`
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
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
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return
      inside = true
      mx = x
      my = y
      ripples = [...ripples.slice(-2), { x, y, start: performance.now() }]
      kick()
    }
    const onLeave = () => {
      inside = false
      kick()
    }

    refreshColors()
    build()
    draw(0)
    if (!reduced) kick()

    const ro = new ResizeObserver(() => {
      build()
      draw(lastT || performance.now())
      kick()
    })
    ro.observe(canvas)
    const mo = new MutationObserver(() => {
      refreshColors()
      draw(lastT || performance.now())
      kick()
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
    window.addEventListener("pointerdown", onDown, { passive: true })
    window.addEventListener("blur", onLeave)
    document.addEventListener("pointerleave", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
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
