"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface MagneticLineFieldProps {
  className?: string
  /** Overall opacity of the field (0–1). */
  opacity?: number
  /** Spacing between segment centres, in px. */
  gap?: number
  /** Base segment length, in px. */
  length?: number
  /** Cursor influence radius, in px. */
  influenceRadius?: number
  /** Resting angle (radians) the segments relax to away from the cursor. */
  restAngle?: number
  colorLightVar?: string
  colorDarkVar?: string
  glowColorLightVar?: string
  glowColorDarkVar?: string
}

type Seg = { cx: number; cy: number; angle: number }

/**
 * A grid of short segments that orient toward the cursor like iron filings in a
 * magnetic field — strongest nearby, relaxing to a rest angle further out, with
 * a viscous ease so they swing rather than snap. Canvas, theme-aware, static
 * under prefers-reduced-motion.
 */
export function MagneticLineField({
  className,
  opacity = 1,
  gap = 26,
  length = 10,
  influenceRadius = 170,
  restAngle = 0,
  colorLightVar,
  colorDarkVar,
  glowColorLightVar,
  glowColorDarkVar,
}: MagneticLineFieldProps) {
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
    const toRGB = (value: string, fallback: string) => {
      if (!pctx) return [115, 115, 115] as const
      pctx.clearRect(0, 0, 1, 1)
      pctx.fillStyle = fallback
      pctx.fillStyle = value
      pctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = pctx.getImageData(0, 0, 1, 1).data
      return [r, g, b] as const
    }
    const resolveVar = (name: string | undefined, fallback: string) => {
      const raw = name
        ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        : ""
      return toRGB(raw || fallback, fallback)
    }

    let base: readonly [number, number, number] = [115, 115, 115]
    let glow: readonly [number, number, number] = [16, 185, 129]
    const refreshColors = () => {
      const dark = document.documentElement.classList.contains("dark")
      base = resolveVar(dark ? colorDarkVar : colorLightVar, "#737373")
      glow = resolveVar(dark ? glowColorDarkVar : glowColorLightVar, "#10b981")
    }

    let segs: Seg[] = []
    let width = 0
    let height = 0
    let mx = -9999
    let my = -9999
    let visible = true
    let raf = 0
    let lastT = 0

    const approach = (cur: number, target: number, rate: number, dt: number) =>
      cur + (target - cur) * (1 - Math.exp(-rate * dt))

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      segs = []
      for (let y = gap / 2; y < height; y += gap) {
        for (let x = gap / 2; x < width; x += gap) {
          segs.push({ cx: x, cy: y, angle: restAngle })
        }
      }
    }

    const r2 = influenceRadius * influenceRadius

    const draw = (t = 0) => {
      const dt = lastT ? Math.min(Math.max((t - lastT) / 1000, 1 / 240), 1 / 30) : 1 / 60
      lastT = t

      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = "round"
      const [br, bg, bb] = base
      const [gr, gg, gbb] = glow
      const active = mx > -9000

      for (const s of segs) {
        let weight = 0
        let target = restAngle
        if (active) {
          const dx = mx - s.cx
          const dy = my - s.cy
          const d2 = dx * dx + dy * dy
          if (d2 < r2) {
            weight = 1 - d2 / r2
            target = Math.atan2(dy, dx)
          }
        }

        // ease toward target along the shortest angular delta (no spin)
        if (reduced) {
          s.angle = target
        } else {
          let delta = target - s.angle
          delta = Math.atan2(Math.sin(delta), Math.cos(delta))
          s.angle = approach(s.angle, s.angle + delta, 9, dt)
        }

        const len = length * (1 + weight * 0.9)
        const hx = Math.cos(s.angle) * len * 0.5
        const hy = Math.sin(s.angle) * len * 0.5

        ctx.globalAlpha = opacity * (0.18 + weight * 0.6)
        ctx.strokeStyle =
          weight > 0.05 ? `rgb(${gr}, ${gg}, ${gbb})` : `rgb(${br}, ${bg}, ${bb})`
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(s.cx - hx, s.cy - hy)
        ctx.lineTo(s.cx + hx, s.cy + hy)
        ctx.stroke()
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
    gap,
    length,
    influenceRadius,
    restAngle,
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
