"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// The engraving's line pitch: half the hero sheet's 8px dot pitch (PITCH in
// hero-field.tsx), so every other line runs through a row of the sheet's dots.
const SHEET_PITCH = 8
const LINE_PITCH = 4
// Where the portrait is engraved: desktop pointers with motion, like the live
// sheet. Phones, touch and reduced motion keep the plain photo.
const LIVE_QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

// A line's weight grows with how dark the photo is there (how bright, on the
// night sheet): a hairline in the highlights, nearly closing up in the shadows.
const MIN_W = 0.35
const MAX_W = 3.5
const GAMMA = 1.6
// Lines bow with the tone, like an engraver's burin following the form.
const BOW = 1.1
// The cursor's wake develops the photo in a soft brush: radius (px) and how
// long a stroke lingers (ms).
const BRUSH = 30
const WAKE_MS = 900
// Resting the cursor on the portrait develops the whole photo.
const DWELL_MS = 300
// On load the photo dissolves into the engraving once the hero has landed.
const INTRO_DELAY_MS = 900

type Mark = { x: number; y: number; t: number }

const isDark = () => document.documentElement.classList.contains("dark")

/**
 * The hero portrait, engraved: the photo redrawn as fine horizontal rules
 * whose weight follows its tone, like the portrait on a banknote. The
 * cursor's wake develops the photo in a soft brush, and resting on it
 * develops the whole photo. The real <img> stays in the page (and is what
 * phones, touch and reduced motion see); the canvas is decoration.
 */
export function EngravedPortrait({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)
  // Whether the photo itself is showing (true until the engraving has taken over).
  const [developed, setDeveloped] = useState(true)

  useEffect(() => {
    const query = window.matchMedia(LIVE_QUERY)
    const update = () => setLive(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!live) return
    const frame = frameRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!frame || !canvas || !ctx) return

    // Luma per CSS pixel, the photo drawn as it is on screen (object-fit: cover).
    let lum = new Float32Array(0)
    let w = 0
    let h = 0
    let dpr = 1
    let oy = 0
    let raf = 0
    let trail: Mark[] = []
    let prev: { x: number; y: number } | null = null
    let dwell = 0
    let intro = 0
    let cancelled = false
    // The photo at the canvas's resolution, and a scratch canvas for the wake.
    const plate = document.createElement("canvas")
    const brush = document.createElement("canvas")

    const photo = new window.Image()
    photo.decoding = "async"
    photo.src = src

    const layout = () => {
      const rect = frame.getBoundingClientRect()
      w = Math.round(rect.width)
      h = Math.round(rect.height)
      if (!w || !h || !photo.naturalWidth) return false
      dpr = Math.min(2, window.devicePixelRatio || 1)
      for (const c of [canvas, plate, brush]) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }

      // Lines on the sheet's rows: the field's dots sit half a pitch in.
      const field = document.querySelector("#hero [data-hero-field]")?.getBoundingClientRect()
      const mod = (n: number) => ((n % LINE_PITCH) + LINE_PITCH) % LINE_PITCH
      oy = mod((field?.top ?? rect.top) + SHEET_PITCH / 2 - rect.top)

      const pctx = plate.getContext("2d")
      if (!pctx) return false
      const scale = Math.max(w / photo.naturalWidth, h / photo.naturalHeight)
      const dw = photo.naturalWidth * scale
      const dh = photo.naturalHeight * scale
      pctx.drawImage(photo, ((w - dw) / 2) * dpr, ((h - dh) / 2) * dpr, dw * dpr, dh * dpr)

      const sample = document.createElement("canvas")
      sample.width = w
      sample.height = h
      const sctx = sample.getContext("2d", { willReadFrequently: true })
      if (!sctx) return false
      sctx.drawImage(photo, (w - dw) / 2, (h - dh) / 2, dw, dh)
      const data = sctx.getImageData(0, 0, w, h).data
      lum = new Float32Array(w * h)
      for (let i = 0; i < lum.length; i++) {
        lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
      }
      // Levels: stretch the photo's own range (2nd to 98th percentile) to the
      // full weight of the line, so a dim photo still engraves cleanly.
      const sorted = lum.slice().sort()
      const lo = sorted[Math.floor(sorted.length * 0.02)]
      const hi = sorted[Math.floor(sorted.length * 0.98)]
      const span = Math.max(0.05, hi - lo)
      for (let i = 0; i < lum.length; i++) lum[i] = Math.min(1, Math.max(0, (lum[i] - lo) / span))
      return true
    }

    // Tone along one line: the band of rows it stands for, softened along x
    // so its edge swells smoothly.
    const toneRow = (y: number, dark: boolean) => {
      const out = new Float32Array(w)
      const y0 = Math.max(0, Math.floor(y - LINE_PITCH / 2))
      const y1 = Math.min(h - 1, Math.ceil(y + LINE_PITCH / 2))
      for (let x = 0; x < w; x++) {
        let s = 0
        let n = 0
        for (let sy = y0; sy <= y1; sy++) {
          for (let sx = Math.max(0, x - 1); sx <= Math.min(w - 1, x + 1); sx++) {
            s += lum[sy * w + sx]
            n++
          }
        }
        const l = s / n
        out[x] = Math.pow(dark ? l : 1 - l, GAMMA)
      }
      return out
    }

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const dark = isDark()

      // Every line in one path: its top edge left to right, then its foot back.
      const lines = new Path2D()
      for (let y = oy; y < h; y += LINE_PITCH) {
        const tone = toneRow(y, dark)
        const mid = (x: number) => y + (tone[x] - 0.5) * BOW
        const half = (x: number) => (MIN_W + (MAX_W - MIN_W) * tone[x]) / 2
        lines.moveTo(0, mid(0) - half(0))
        for (let x = 1; x < w; x++) lines.lineTo(x, mid(x) - half(x))
        lines.lineTo(w, mid(w - 1) - half(w - 1))
        lines.lineTo(w, mid(w - 1) + half(w - 1))
        for (let x = w - 1; x >= 0; x--) lines.lineTo(x, mid(x) + half(x))
        lines.closePath()
      }
      ctx.fillStyle = getComputedStyle(frame).color
      ctx.fill(lines)

      // The wake: the photo through a soft brush along the cursor's path.
      trail = trail.filter((m) => now - m.t < WAKE_MS)
      if (!trail.length) return
      const bctx = brush.getContext("2d")
      if (!bctx) return
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.globalCompositeOperation = "source-over"
      bctx.clearRect(0, 0, w, h)
      for (const m of trail) {
        const a = 1 - (now - m.t) / WAKE_MS
        const g = bctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, BRUSH)
        g.addColorStop(0, `rgba(0,0,0,${0.35 * a})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        bctx.fillStyle = g
        bctx.fillRect(m.x - BRUSH, m.y - BRUSH, BRUSH * 2, BRUSH * 2)
      }
      bctx.globalCompositeOperation = "source-in"
      bctx.setTransform(1, 0, 0, 1, 0, 0)
      bctx.drawImage(plate, 0, 0)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(brush, 0, 0)
    }

    // Draws only while a wake is fading.
    const tick = (now: number) => {
      draw(now)
      raf = trail.length ? requestAnimationFrame(tick) : 0
    }
    const run = () => {
      if (!raf && lum.length) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const rect = frame.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const now = performance.now()
      // Fill in fast strokes so the brush reads as one line, not beads.
      const from = prev ?? { x, y }
      const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (BRUSH / 3)))
      for (let s = 1; s <= steps; s++) {
        trail.push({ x: from.x + ((x - from.x) * s) / steps, y: from.y + ((y - from.y) * s) / steps, t: now })
      }
      prev = { x, y }
      run()
    }
    const onEnter = () => {
      clearTimeout(dwell)
      dwell = window.setTimeout(() => setDeveloped(true), DWELL_MS)
    }
    const onLeave = () => {
      clearTimeout(dwell)
      prev = null
      setDeveloped(false)
    }
    const onTheme = () => {
      if (!raf) draw(performance.now())
    }

    const start = () => {
      if (cancelled || !layout()) return
      draw(performance.now())
      // Dissolve the photo into the engraving once the hero has landed.
      intro = window.setTimeout(() => setDeveloped(false), INTRO_DELAY_MS)
    }
    if (photo.complete && photo.naturalWidth) start()
    else photo.addEventListener("load", start, { once: true })

    const resize = new ResizeObserver(() => {
      if (layout()) draw(performance.now())
    })
    resize.observe(frame)
    const theme = new MutationObserver(onTheme)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    frame.addEventListener("pointermove", onMove)
    frame.addEventListener("pointerenter", onEnter)
    frame.addEventListener("pointerleave", onLeave)

    return () => {
      cancelled = true
      // Back to the plain photo, should the engraving be switched off.
      setDeveloped(true)
      cancelAnimationFrame(raf)
      clearTimeout(dwell)
      clearTimeout(intro)
      resize.disconnect()
      theme.disconnect()
      frame.removeEventListener("pointermove", onMove)
      frame.removeEventListener("pointerenter", onEnter)
      frame.removeEventListener("pointerleave", onLeave)
    }
  }, [live, src])

  return (
    <div
      ref={frameRef}
      data-engraving={live ? (developed ? "developed" : "engraved") : undefined}
      className={cn(
        "relative aspect-[4/5] w-full max-w-[320px] overflow-hidden text-foreground",
        // Engraved, the frame is the sheet's own paper; the photo's grey plate
        // is only for the plain photo.
        live ? "bg-background" : "bg-surface-2",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes={sizes}
        className={cn("object-cover transition-opacity duration-500", live && !developed && "opacity-0")}
      />
      {live && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500",
            developed && "opacity-0",
          )}
        />
      )}
    </div>
  )
}
