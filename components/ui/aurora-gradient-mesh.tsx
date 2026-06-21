"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface AuroraGradientMeshProps {
  className?: string
  /** Master alpha of the aurora (0–1). */
  alpha?: number
  /** Number of drifting light blobs. */
  blobCount?: number
  /** Drift speed multiplier. */
  speed?: number
  /** Primary + secondary hue CSS vars. */
  colorVar?: string
  secondaryColorVar?: string
}

type Blob = {
  ax: number; ay: number // amplitude (fraction of size)
  fx: number; fy: number // frequency
  px: number; py: number // phase
  r: number               // radius (fraction of min dimension)
  c: 0 | 1                // colour index
}

/**
 * Ambient aurora — a few large, soft light blobs drift on slow Lissajous paths
 * and blend additively for a calm, colourful wash. No cursor interaction.
 * Canvas, theme-aware, static under prefers-reduced-motion.
 */
export function AuroraGradientMesh({
  className,
  alpha = 0.55,
  blobCount = 4,
  speed = 1,
  colorVar = "--accent",
  secondaryColorVar = "--color-teal-500",
}: AuroraGradientMeshProps) {
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
      if (!pctx) return [16, 185, 129] as const
      pctx.clearRect(0, 0, 1, 1)
      pctx.fillStyle = fallback
      pctx.fillStyle = value
      pctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = pctx.getImageData(0, 0, 1, 1).data
      return [r, g, b] as const
    }
    const resolveVar = (name: string, fallback: string) => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      return toRGB(raw || fallback, fallback)
    }

    let hues: (readonly [number, number, number])[] = [[16, 185, 129], [20, 184, 166]]
    const refreshColors = () => {
      hues = [resolveVar(colorVar, "#10b981"), resolveVar(secondaryColorVar, "#14b8a6")]
    }

    let blobs: Blob[] = []
    let width = 0
    let height = 0
    let visible = true
    let raf = 0

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      // Soft blobs read fine at low resolution and it's far cheaper.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      blobs = []
      for (let i = 0; i < blobCount; i++) {
        blobs.push({
          ax: 0.18 + Math.random() * 0.22,
          ay: 0.16 + Math.random() * 0.2,
          fx: 0.05 + Math.random() * 0.08,
          fy: 0.05 + Math.random() * 0.08,
          px: Math.random() * Math.PI * 2,
          py: Math.random() * Math.PI * 2,
          r: 0.4 + Math.random() * 0.35,
          c: (i % 2) as 0 | 1,
        })
      }
    }

    const draw = (t = 0) => {
      const time = (t / 1000) * speed
      const minDim = Math.min(width, height)
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = "lighter"

      for (const b of blobs) {
        const cx = width * (0.5 + b.ax * Math.sin(time * b.fx + b.px))
        const cy = height * (0.5 + b.ay * Math.sin(time * b.fy + b.py))
        const radius = minDim * b.r
        const [r, g, bl] = hues[b.c]
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        grad.addColorStop(0, `rgba(${r}, ${g}, ${bl}, ${alpha})`)
        grad.addColorStop(0.55, `rgba(${r}, ${g}, ${bl}, ${alpha * 0.35})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${bl}, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)
      }

      ctx.globalCompositeOperation = "source-over"
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
    draw(0)
    if (!reduced) kick()

    const ro = new ResizeObserver(() => {
      build()
      if (reduced) draw(0)
    })
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

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
    }
  }, [alpha, blobCount, speed, colorVar, secondaryColorVar])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  )
}
