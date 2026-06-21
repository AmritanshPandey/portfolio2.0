"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface FlowFieldParticlesProps {
  className?: string
  /** Overall opacity of the particles (0–1). */
  opacity?: number
  /** Explicit particle count; otherwise derived from the band area. */
  count?: number
  /** Drift speed in px/sec. */
  speed?: number
  /** Noise frequency — smaller = larger, smoother flow swirls. */
  scale?: number
  colorLightVar?: string
  colorDarkVar?: string
  /** CSS var for the trail-fade fill (usually the page background). */
  backgroundVar?: string
}

type Particle = { x: number; y: number; life: number }

/**
 * Particles that drift along a procedural flow field (dependency-free pseudo-
 * noise) leaving faint trails. The field slowly evolves, so the streams wander
 * and reorganise over time. Canvas, theme-aware, static under reduced motion.
 */
export function FlowFieldParticles({
  className,
  opacity = 1,
  count,
  speed = 26,
  scale = 0.0016,
  colorLightVar,
  colorDarkVar,
  backgroundVar = "--background",
}: FlowFieldParticlesProps) {
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
    const toRGBA = (value: string) => {
      if (!pctx) return value
      pctx.clearRect(0, 0, 1, 1)
      pctx.fillStyle = "#000"
      pctx.fillStyle = value
      pctx.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = pctx.getImageData(0, 0, 1, 1).data
      return `rgba(${r}, ${g}, ${b}, ${a / 255})`
    }
    const resolveVar = (name: string | undefined, fallback: string) => {
      const raw = name
        ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        : ""
      return toRGBA(raw || fallback)
    }

    const colors = { line: "#10b981", bg: "#0a0a0a" }
    const refreshColors = () => {
      const dark = document.documentElement.classList.contains("dark")
      colors.line = resolveVar(dark ? colorDarkVar : colorLightVar, "#10b981")
      colors.bg = resolveVar(backgroundVar, dark ? "#0a0a0a" : "#fafafa")
    }

    let ps: Particle[] = []
    let width = 0
    let height = 0
    let visible = true
    let raf = 0
    let lastT = 0

    // Procedural angle field — summed sines, no Perlin lib needed.
    const angleAt = (x: number, y: number, t: number) => {
      const v =
        Math.sin(x * scale + t * 0.25) +
        Math.sin(y * scale * 1.3 - t * 0.2) +
        Math.sin((x + y) * scale * 0.8 + t * 0.3)
      return (v / 3) * Math.PI * 2
    }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const n = count ?? Math.min(420, Math.max(120, Math.round((width * height) / 2600)))
      ps = []
      for (let i = 0; i < n; i++) {
        ps.push({ x: Math.random() * width, y: Math.random() * height, life: Math.random() * 200 })
      }
    }

    const reseed = (p: Particle) => {
      p.x = Math.random() * width
      p.y = Math.random() * height
      p.life = 0
    }

    const draw = (t = 0) => {
      const dt = lastT ? Math.min(Math.max((t - lastT) / 1000, 1 / 240), 1 / 30) : 1 / 60
      lastT = t
      const time = t / 1000

      // fade previous frame slightly to leave trails
      ctx.globalAlpha = 1
      ctx.fillStyle = colors.bg
      ctx.globalAlpha = 0.085
      ctx.fillRect(0, 0, width, height)

      ctx.globalAlpha = opacity * 0.5
      ctx.fillStyle = colors.line

      for (const p of ps) {
        const a = angleAt(p.x, p.y, time)
        p.x += Math.cos(a) * speed * dt
        p.y += Math.sin(a) * speed * dt
        p.life += dt * 60

        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.life > 240) {
          reseed(p)
          continue
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = opacity * 0.4
      ctx.fillStyle = colors.line
      for (const p of ps) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2)
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

    refreshColors()
    build()
    if (reduced) drawStatic()
    else kick()

    const ro = new ResizeObserver(() => {
      build()
      if (reduced) drawStatic()
    })
    ro.observe(canvas)
    const mo = new MutationObserver(() => {
      refreshColors()
      if (reduced) drawStatic()
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

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
    }
  }, [opacity, count, speed, scale, colorLightVar, colorDarkVar, backgroundVar])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  )
}
