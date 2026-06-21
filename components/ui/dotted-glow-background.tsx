"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface DottedGlowBackgroundProps {
  className?: string
  /** Overall opacity of the dot field (0–1). */
  opacity?: number
  /** Spacing between dot centres, in px. */
  gap?: number
  /** Dot radius, in px. */
  radius?: number
  /** CSS variable names for the base dot colour. */
  colorLightVar?: string
  colorDarkVar?: string
  /** CSS variable names for the glow colour the dots twinkle towards. */
  glowColorLightVar?: string
  glowColorDarkVar?: string
  /** Opacity of a solid background fill drawn behind the dots (0–1). */
  backgroundOpacity?: number
  /** Per-dot twinkle speed range and a global multiplier. */
  speedMin?: number
  speedMax?: number
  speedScale?: number
}

type Dot = { x: number; y: number; phase: number; speed: number; bright: number }

/**
 * An animated grid of dots that twinkle between a base colour and a glow
 * colour. Canvas-based, theme-aware (re-reads CSS variables when the `.dark`
 * class toggles), and static under prefers-reduced-motion. Position it as an
 * absolute layer behind content; mask it with Tailwind `mask-*` utilities via
 * `className` for a radial falloff.
 */
export function DottedGlowBackground({
  className,
  opacity = 1,
  gap = 10,
  radius = 1.6,
  colorLightVar,
  colorDarkVar,
  glowColorLightVar,
  glowColorDarkVar,
  backgroundOpacity = 0,
  speedMin = 0.3,
  speedMax = 1.6,
  speedScale = 1,
}: DottedGlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let dots: Dot[] = []
    let width = 0
    let height = 0
    let dpr = 1

    // Normalise any CSS colour (incl. oklch theme vars) to an rgba() string so
    // canvas fillStyle renders it reliably across browsers.
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
    const resolve = (name: string | undefined, fallback: string) => {
      const raw = name
        ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
        : ""
      return toRGBA(raw || fallback)
    }

    const colors = { base: "#737373", glow: "#737373", bg: "#737373" }
    const refreshColors = () => {
      const dark = document.documentElement.classList.contains("dark")
      colors.base = resolve(dark ? colorDarkVar : colorLightVar, "#737373")
      colors.glow = resolve(dark ? glowColorDarkVar : glowColorLightVar, colors.base)
      colors.bg = colors.base
    }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const span = Math.max(speedMax - speedMin, 0)
      dots = []
      for (let y = gap / 2; y < height; y += gap) {
        for (let x = gap / 2; x < width; x += gap) {
          dots.push({
            x,
            y,
            phase: Math.random() * Math.PI * 2,
            speed: speedMin + Math.random() * span,
            bright: 0.6 + Math.random() * 0.4,
          })
        }
      }
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)

      if (backgroundOpacity > 0) {
        ctx.globalAlpha = backgroundOpacity
        ctx.fillStyle = colors.bg
        ctx.fillRect(0, 0, width, height)
      }

      const time = reduced ? 0 : (t / 1000) * speedScale
      const TAU = Math.PI * 2

      for (const d of dots) {
        // dim base dot — the resting field
        ctx.globalAlpha = opacity * 0.14
        ctx.fillStyle = colors.base
        ctx.beginPath()
        ctx.arc(d.x, d.y, radius, 0, TAU)
        ctx.fill()

        // flowing glow field — overlapping low-frequency waves drift soft
        // clusters of brightness across the grid (rather than uniform twinkle)
        const wave =
          (Math.sin(d.x * 0.018 + time * 0.7) +
            Math.sin(d.y * 0.022 - time * 0.5) +
            Math.sin((d.x + d.y) * 0.013 + d.phase + time * 0.6 * d.speed)) /
          3 // −1..1
        let glow = wave * 0.5 + 0.5 // 0..1
        glow = glow * glow * glow * d.bright // gamma → sparse, punchy clusters

        if (glow > 0.015) {
          ctx.globalAlpha = opacity * glow
          ctx.fillStyle = colors.glow
          ctx.beginPath()
          ctx.arc(d.x, d.y, radius * (1 + glow * 0.9), 0, TAU)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    let raf = 0
    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    refreshColors()
    build()

    if (reduced) {
      draw(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => build())
    ro.observe(canvas)

    const mo = new MutationObserver(() => {
      refreshColors()
      if (reduced) draw(0)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
    }
  }, [
    opacity,
    gap,
    radius,
    colorLightVar,
    colorDarkVar,
    glowColorLightVar,
    glowColorDarkVar,
    backgroundOpacity,
    speedMin,
    speedMax,
    speedScale,
  ])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  )
}
