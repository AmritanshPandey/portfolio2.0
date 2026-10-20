"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// The hero sheet's dot pitch (PITCH in hero-field.tsx). The portrait's dots
// sit on the same lattice as the sheet around it.
const PITCH = 8
// Where the portrait is drawn as dots: desktop pointers with motion, like the
// live sheet. Phones, touch and reduced motion keep the plain photo.
const LIVE_QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

// Halftone: a dot's radius and ink grow with how dark the photo is there (how
// bright, on the night sheet). At the light end it is the sheet's own faint
// dot, so the portrait's edge meets the sheet seamlessly.
const MIN_R = 0.85
const MAX_R = 4.3
const MIN_INK = 0.16
const MAX_INK = 0.92
const LEVELS = 10
const GAMMA = 1.35
// A lit cell is a square pixel of the photo's own colour, with the wake's
// 1px gap.
const PIXEL = 7
// The cursor's wake: radius (px) and the seconds it takes to fall to ~37%.
const STROKE = 18
const WAKE_FADE = 0.5
// Resting the cursor on the portrait develops it: cells flip to colour in a
// ragged order over DEVELOP_MS, then the photo itself fades in.
const DWELL_MS = 300
const DEVELOP_MS = 600
// On load the photo dissolves into the screen once the hero has landed.
const INTRO_DELAY_MS = 900

type Cell = { x: number; y: number; lum: number; rgb: string; t: number }

const isDark = () => document.documentElement.classList.contains("dark")

/** Distance from (px, py) to the segment a→b. */
function toSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax
  const dy = by - ay
  const len = dx * dx + dy * dy
  const t = len ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len)) : 0
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

/**
 * The hero portrait, drawn as the hero's own dot screen: a halftone of the
 * photo on the sheet's 8px lattice. The cursor's wake turns the cells it
 * passes into square pixels of the photo's colour, and resting on it develops
 * the photo itself. The real <img> stays in the page (and is what phones,
 * touch and reduced motion see); the canvas is decoration.
 */
export function HalftonePortrait({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)
  // Whether the photo itself is showing (true until the screen has taken over).
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

    let cells: Cell[] = []
    let energy = new Float32Array(0)
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let last = 0
    // Develop progress, and where it is heading.
    let p = 1
    let target = 1
    let shown = true
    let dwell = 0
    let intro = 0
    let prev: { x: number; y: number } | null = null
    let cancelled = false

    const photo = new window.Image()
    photo.decoding = "async"
    photo.src = src

    const show = (on: boolean) => {
      if (shown === on) return
      shown = on
      setDeveloped(on)
    }

    // Lay the lattice over the frame, aligned with the sheet's, and sample
    // the photo (object-fit: cover) at each cell's centre.
    const layout = () => {
      const rect = frame.getBoundingClientRect()
      w = rect.width
      h = rect.height
      if (!w || !h || !photo.naturalWidth) return false
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      const field = document.querySelector("#hero [data-hero-field]")?.getBoundingClientRect()
      const mod = (n: number) => ((n % PITCH) + PITCH) % PITCH
      const ox = mod((field?.left ?? rect.left) + PITCH / 2 - rect.left)
      const oy = mod((field?.top ?? rect.top) + PITCH / 2 - rect.top)

      const sample = document.createElement("canvas")
      sample.width = Math.ceil(w)
      sample.height = Math.ceil(h)
      const sctx = sample.getContext("2d", { willReadFrequently: true })
      if (!sctx) return false
      const scale = Math.max(w / photo.naturalWidth, h / photo.naturalHeight)
      const dw = photo.naturalWidth * scale
      const dh = photo.naturalHeight * scale
      sctx.drawImage(photo, (w - dw) / 2, (h - dh) / 2, dw, dh)
      const data = sctx.getImageData(0, 0, sample.width, sample.height).data

      cells = []
      for (let y = oy; y < h; y += PITCH) {
        for (let x = ox; x < w; x += PITCH) {
          // Average a small patch around the centre, so a dot stands for its cell.
          let r = 0
          let g = 0
          let b = 0
          let n = 0
          for (let sy = -2; sy <= 2; sy += 2) {
            for (let sx = -2; sx <= 2; sx += 2) {
              const px = Math.min(sample.width - 1, Math.max(0, Math.round(x + sx)))
              const py = Math.min(sample.height - 1, Math.max(0, Math.round(y + sy)))
              const i = (py * sample.width + px) * 4
              r += data[i]
              g += data[i + 1]
              b += data[i + 2]
              n++
            }
          }
          r /= n
          g /= n
          b /= n
          // Luma, with a little contrast so the halftone reads.
          const lum = Math.min(1, Math.max(0, ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 - 0.06) / 0.86))
          cells.push({ x, y, lum, rgb: `rgb(${r | 0} ${g | 0} ${b | 0})`, t: Math.random() })
        }
      }
      energy = new Float32Array(cells.length)
      return true
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const dark = isDark()
      const ink = getComputedStyle(frame).color
      const lit = (i: number) => energy[i] > 0.12 + cells[i].t * 0.7 || p > cells[i].t

      // Dots, batched by level: one path and one fill per level.
      const paths = Array.from({ length: LEVELS }, () => new Path2D())
      for (let i = 0; i < cells.length; i++) {
        if (lit(i)) continue
        const c = cells[i]
        // A gamma on the tone keeps the mid-tones airy, so the face reads.
        const tone = Math.pow(dark ? c.lum : 1 - c.lum, GAMMA)
        const level = Math.min(LEVELS - 1, Math.floor(tone * LEVELS))
        const r = MIN_R + (MAX_R - MIN_R) * Math.sqrt((level + 0.5) / LEVELS)
        paths[level].moveTo(c.x + r, c.y)
        paths[level].arc(c.x, c.y, r, 0, Math.PI * 2)
      }
      ctx.fillStyle = ink
      for (let l = 0; l < LEVELS; l++) {
        ctx.globalAlpha = MIN_INK + (MAX_INK - MIN_INK) * Math.sqrt((l + 0.5) / LEVELS)
        ctx.fill(paths[l])
      }
      ctx.globalAlpha = 1

      // Lit cells: square pixels in the photo's colour.
      for (let i = 0; i < cells.length; i++) {
        if (!lit(i)) continue
        const c = cells[i]
        ctx.fillStyle = c.rgb
        ctx.fillRect(c.x - PIXEL / 2, c.y - PIXEL / 2, PIXEL, PIXEL)
      }
    }

    // Draws only while something changes: a fading wake or a develop under way.
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      let active = false
      const keep = Math.exp(-dt / WAKE_FADE)
      for (let i = 0; i < energy.length; i++) {
        if (energy[i] > 0.01) {
          energy[i] *= keep
          active = true
        } else energy[i] = 0
      }
      if (p !== target) {
        const step = (dt * 1000) / DEVELOP_MS
        p = target > p ? Math.min(target, p + step) : Math.max(target, p - step)
        active = true
      }
      // Fully developed: hand over to the photo itself.
      show(p >= 1 && target === 1)
      draw()
      raf = active ? requestAnimationFrame(tick) : 0
    }
    const run = () => {
      if (raf || !cells.length) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const rect = frame.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const from = prev ?? { x, y }
      prev = { x, y }
      for (let i = 0; i < cells.length; i++) {
        const d = toSegment(cells[i].x, cells[i].y, from.x, from.y, x, y)
        if (d < STROKE) energy[i] = Math.max(energy[i], 1 - d / STROKE)
      }
      run()
    }
    const onEnter = () => {
      clearTimeout(dwell)
      dwell = window.setTimeout(() => {
        target = 1
        run()
      }, DWELL_MS)
    }
    const onLeave = () => {
      clearTimeout(dwell)
      prev = null
      target = 0
      show(false)
      run()
    }
    const onTheme = () => {
      if (!raf) draw()
    }

    const start = () => {
      if (cancelled || !layout()) return
      draw()
      // Dissolve the photo into the screen once the hero has landed.
      intro = window.setTimeout(() => {
        target = 0
        show(false)
        run()
      }, INTRO_DELAY_MS)
    }
    if (photo.complete && photo.naturalWidth) start()
    else photo.addEventListener("load", start, { once: true })

    const resize = new ResizeObserver(() => {
      if (layout()) draw()
    })
    resize.observe(frame)
    const theme = new MutationObserver(onTheme)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    frame.addEventListener("pointermove", onMove)
    frame.addEventListener("pointerenter", onEnter)
    frame.addEventListener("pointerleave", onLeave)

    return () => {
      cancelled = true
      // Back to the plain photo, should the screen be switched off.
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
      data-halftone={live ? (developed ? "developed" : "screen") : undefined}
      className={cn(
        "relative aspect-[4/5] w-full max-w-[320px] overflow-hidden text-foreground",
        // On the screen the frame is the sheet's own paper; the photo's grey
        // plate is only for the plain photo.
        live ? "bg-background" : "bg-surface-2",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes={sizes}
        className={cn("object-cover transition-opacity duration-300", live && !developed && "opacity-0")}
      />
      {live && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300",
            developed && "opacity-0",
          )}
        />
      )}
    </div>
  )
}
