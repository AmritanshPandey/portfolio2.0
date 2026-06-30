"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface AsciiFlowBackgroundProps {
  className?: string
  /** Overall opacity of the glyph field (0–1). */
  opacity?: number
  /** Width/height of one character cell, in px. Smaller = denser ASCII. */
  cellSize?: number
  /** Glyph font size in px. Defaults to ~cellSize for a tight grid. */
  fontSize?: number
  /** Brightness ramp, dark → light. The classic ASCII dither ramp. */
  chars?: string
  /** Base glyph colour (the resting field). CSS var name (--x) or colour value. */
  colorLightVar?: string
  colorDarkVar?: string
  /** Accent colour the brightest glyphs light up towards. */
  accentLightVar?: string
  accentDarkVar?: string
  /** Animation speed multiplier. */
  speed?: number
  /**
   * Optional image to dither in real time (true "dither media"). When set, the
   * field samples the image luminance instead of the procedural flow. Falls back
   * to the flow field while loading or on error.
   */
  src?: string
}

const DEFAULT_RAMP = " .:-=+*#%@"

/**
 * An animated ASCII / dither field rendered to canvas — the "dither media" look.
 * Each character cell reads a brightness signal and maps it onto an ASCII ramp;
 * bright cells light up towards the accent. By default the brightness is a
 * procedural flow field (a drifting domain-warped plasma) so it needs no source
 * media; pass `src` to dither an actual image instead.
 *
 * Theme-aware (re-reads CSS variables when `.dark` toggles), static under
 * prefers-reduced-motion, and self-pausing off-screen. Drop it into any
 * `position: relative` parent or use it as a `<BackgroundBand>` layer.
 */
export function AsciiFlowBackground({
  className,
  opacity = 1,
  cellSize = 12,
  fontSize,
  chars = DEFAULT_RAMP,
  colorLightVar,
  colorDarkVar,
  accentLightVar,
  accentDarkVar,
  speed = 1,
  src,
}: AsciiFlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ramp = chars.length > 0 ? chars : DEFAULT_RAMP
    const glyph = fontSize ?? cellSize

    let cols = 0
    let rows = 0
    let width = 0
    let height = 0
    let dpr = 1

    // Normalise any CSS colour (incl. oklch theme vars) to {r,g,b,a} so we can
    // interpolate base → accent per cell and render reliably across browsers.
    const probe = document.createElement("canvas")
    probe.width = probe.height = 1
    const pctx = probe.getContext("2d")
    type RGBA = { r: number; g: number; b: number; a: number }
    const toRGBA = (value: string): RGBA => {
      if (!pctx) return { r: 115, g: 115, b: 115, a: 1 }
      pctx.clearRect(0, 0, 1, 1)
      pctx.fillStyle = "#000"
      pctx.fillStyle = value
      pctx.fillRect(0, 0, 1, 1)
      const [r, g, b, a] = pctx.getImageData(0, 0, 1, 1).data
      return { r, g, b, a: a / 255 }
    }
    const resolve = (nameOrColor: string | undefined, fallback: string) => {
      const raw = nameOrColor?.startsWith("--")
        ? getComputedStyle(document.documentElement).getPropertyValue(nameOrColor).trim()
        : nameOrColor ?? ""
      return toRGBA(raw || fallback)
    }

    const colors = {
      base: { r: 115, g: 115, b: 115, a: 1 } as RGBA,
      accent: { r: 52, g: 211, b: 153, a: 1 } as RGBA,
    }
    const refreshColors = () => {
      const dark = document.documentElement.classList.contains("dark")
      colors.base = resolve(dark ? colorDarkVar : colorLightVar, "#737373")
      colors.accent = resolve(dark ? accentDarkVar : accentLightVar, dark ? "#34d399" : "#059669")
    }

    // Optional source image, sampled into a tiny offscreen buffer that matches
    // the cell grid so reads are O(1) per cell.
    let sample: { data: Uint8ClampedArray; w: number; h: number } | null = null
    let img: HTMLImageElement | null = null
    if (src) {
      img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => buildSample()
      img.src = src
    }
    const buildSample = () => {
      if (!img || !img.complete || img.naturalWidth === 0 || cols === 0 || rows === 0) return
      const off = document.createElement("canvas")
      off.width = cols
      off.height = rows
      const octx = off.getContext("2d")
      if (!octx) return
      // cover-fit the image into the grid
      const scale = Math.max(cols / img.naturalWidth, rows / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      octx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh)
      sample = { data: octx.getImageData(0, 0, cols, rows).data, w: cols, h: rows }
    }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.max(1, Math.round(width * dpr))
      canvas.height = Math.max(1, Math.round(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.max(1, Math.ceil(width / cellSize))
      rows = Math.max(1, Math.ceil(height / cellSize))
      buildSample()
    }

    // Brightness at grid cell (cx, cy) in 0..1.
    const brightness = (cx: number, cy: number, time: number) => {
      if (sample) {
        const i = (cy * sample.w + cx) * 4
        const lum = (sample.data[i] * 0.299 + sample.data[i + 1] * 0.587 + sample.data[i + 2] * 0.114) / 255
        // Gentle animated shimmer over the sampled image so it stays alive.
        return Math.min(1, lum * (0.85 + 0.15 * Math.sin(cx * 0.3 + cy * 0.25 + time)))
      }
      // Procedural flow: domain-warped plasma that drifts like dithered media.
      const x = cx * 0.12
      const y = cy * 0.16
      const warpX = Math.sin(y * 0.8 + time * 0.6) * 1.4
      const warpY = Math.cos(x * 0.7 - time * 0.5) * 1.4
      const wave =
        (Math.sin(x + warpX + time) +
          Math.sin(y + warpY - time * 0.8) +
          Math.sin((x + y) * 0.5 + time * 0.7) +
          Math.sin(Math.hypot(x - cols * 0.06, y - rows * 0.06) - time * 1.1)) /
        4 // -1..1
      return wave * 0.5 + 0.5
    }

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.font = `${glyph}px ui-monospace, SFMono-Regular, Menlo, monospace`
      const time = reduced ? 0 : (t / 1000) * speed
      const half = cellSize / 2

      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          let b = brightness(cx, cy, time)
          b = Math.max(0, Math.min(1, b))
          // Contrast curve → sparse dark areas, dense bright clusters.
          const shaped = b * b * (3 - 2 * b)
          const idx = Math.min(ramp.length - 1, Math.floor(shaped * ramp.length))
          const ch = ramp[idx]
          if (ch === " ") continue

          // Blend base → accent by brightness; alpha rises with brightness.
          const mix = shaped * shaped
          const r = Math.round(colors.base.r + (colors.accent.r - colors.base.r) * mix)
          const g = Math.round(colors.base.g + (colors.accent.g - colors.base.g) * mix)
          const bl = Math.round(colors.base.b + (colors.accent.b - colors.base.b) * mix)
          ctx.globalAlpha = opacity * (0.18 + shaped * 0.82)
          ctx.fillStyle = `rgb(${r}, ${g}, ${bl})`
          ctx.fillText(ch, cx * cellSize + half, cy * cellSize + half)
        }
      }
      ctx.globalAlpha = 1
    }

    let raf = 0
    let running = false
    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduced) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    refreshColors()
    build()

    if (reduced) {
      draw(0)
    } else {
      start()
    }

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

    // Self-pause when scrolled off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else stop()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    return () => {
      stop()
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      if (img) img.onload = null
    }
  }, [
    opacity,
    cellSize,
    fontSize,
    chars,
    colorLightVar,
    colorDarkVar,
    accentLightVar,
    accentDarkVar,
    speed,
    src,
  ])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  )
}
