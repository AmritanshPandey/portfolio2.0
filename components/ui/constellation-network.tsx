"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface ConstellationNetworkProps {
  className?: string
  /** Overall opacity of the field (0–1). */
  opacity?: number
  /** Explicit particle count; otherwise derived from the band area. */
  count?: number
  /** Max distance (px) at which two particles are linked. */
  linkDistance?: number
  /** Drift speed in px/sec. */
  speed?: number
  /** Cursor influence radius (px) — links + gentle attraction. */
  cursorRadius?: number
  colorLightVar?: string
  colorDarkVar?: string
  glowColorLightVar?: string
  glowColorDarkVar?: string
}

type Node = { x: number; y: number; vx: number; vy: number }

/**
 * A drifting particle network: nearby particles link with thin lines whose
 * opacity falls off with distance, and the cursor acts as an extra node that
 * links to and gently attracts particles around it. Canvas, theme-aware,
 * static under prefers-reduced-motion.
 */
export function ConstellationNetwork({
  className,
  opacity = 1,
  count,
  linkDistance = 120,
  speed = 14,
  cursorRadius = 160,
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
    let glow: readonly [number, number, number] = [115, 115, 115]
    const refreshColors = () => {
      const dark = document.documentElement.classList.contains("dark")
      base = resolveVar(dark ? colorDarkVar : colorLightVar, "#737373")
      glow = resolveVar(dark ? glowColorDarkVar : glowColorLightVar, dark ? "#ffffff" : "#000000")
    }

    let nodes: Node[] = []
    let width = 0
    let height = 0
    let mx = -9999
    let my = -9999
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

      const n = count ?? Math.min(110, Math.max(28, Math.round((width * height) / 12000)))
      nodes = []
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
        })
      }
    }

    const link2 = linkDistance * linkDistance
    const cursor2 = cursorRadius * cursorRadius

    const draw = (t = 0) => {
      const dt = lastT ? Math.min(Math.max((t - lastT) / 1000, 1 / 240), 1 / 30) : 1 / 60
      lastT = t

      ctx.clearRect(0, 0, width, height)

      // integrate
      if (!reduced) {
        for (const p of nodes) {
          // gentle cursor attraction
          if (mx > -9000) {
            const dx = mx - p.x
            const dy = my - p.y
            const d2 = dx * dx + dy * dy
            if (d2 < cursor2 && d2 > 1) {
              const f = (1 - d2 / cursor2) * 40
              const inv = 1 / Math.sqrt(d2)
              p.vx += dx * inv * f * dt
              p.vy += dy * inv * f * dt
            }
          }
          // damping keeps speed near the baseline
          p.vx *= 0.99
          p.vy *= 0.99
          p.x += p.vx * dt
          p.y += p.vy * dt
          if (p.x < 0) { p.x = 0; p.vx *= -1 } else if (p.x > width) { p.x = width; p.vx *= -1 }
          if (p.y < 0) { p.y = 0; p.vy *= -1 } else if (p.y > height) { p.y = height; p.vy *= -1 }
        }
      }

      // links
      const [br, bg, bb] = base
      const [gr, gg, gb] = glow
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > link2) continue
          const fade = 1 - d2 / link2
          ctx.globalAlpha = opacity * fade * 0.5
          ctx.strokeStyle = `rgb(${br}, ${bg}, ${bb})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      // cursor links (tinted toward glow)
      if (mx > -9000) {
        for (const p of nodes) {
          const dx = p.x - mx
          const dy = p.y - my
          const d2 = dx * dx + dy * dy
          if (d2 > cursor2) continue
          const fade = 1 - d2 / cursor2
          ctx.globalAlpha = opacity * fade * 0.8
          ctx.strokeStyle = `rgb(${gr}, ${gg}, ${gb})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mx, my)
          ctx.stroke()
        }
      }

      // dots
      for (const p of nodes) {
        let near = 0
        if (mx > -9000) {
          const dx = p.x - mx
          const dy = p.y - my
          near = Math.max(0, 1 - (dx * dx + dy * dy) / cursor2)
        }
        const r = 1.4 + near * 1.6
        ctx.globalAlpha = opacity * (0.5 + near * 0.5)
        ctx.fillStyle = near > 0.05
          ? `rgb(${gr}, ${gg}, ${gb})`
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
      mx = e.clientX - rect.left
      my = e.clientY - rect.top
      kick()
    }
    const onLeave = () => {
      mx = -9999
      my = -9999
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
    linkDistance,
    speed,
    cursorRadius,
    colorLightVar,
    colorDarkVar,
    glowColorLightVar,
    glowColorDarkVar,
  ])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  )
}
