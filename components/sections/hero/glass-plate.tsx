"use client"

import { type ReactNode, useEffect, useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// The rim the lens bends (CSS px), and how far it bends what is under it at
// the very edge (feDisplacementMap scale; the shift is half of it).
const RIM = 22
const BEND = 22
// The plate's centre stays frosted for the text; this soft a blur. The rim
// is only lightly softened: enough to smooth the bent dots into a band, not
// so much that the bend is lost.
const BLUR = 8
const RIM_SOFTEN = 2.2
// How near (px) the pointer has to come for the glass to catch its light.
const REACH = 360

/**
 * Chromium on a desktop pointer: the only browsers that draw an SVG filter
 * as a backdrop-filter, and the devices that can afford it. Everywhere else
 * the plate keeps the plain CSS glass (.glass-plate).
 */
function lensSupported() {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands
  return (
    Boolean(brands?.some((b) => b.brand === "Chromium")) &&
    matchMedia("(pointer: fine)").matches &&
    !matchMedia("(prefers-reduced-transparency: reduce)").matches &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/** 0 in the middle, rising to 1 at the edge, eased so the bend gathers at the rim. */
const toward = (d: number) => (d >= RIM ? 0 : (1 - d / RIM) ** 2)

/**
 * Two images the size of the plate. The displacement map shifts what is
 * under the rim inward (red for x, green for y, 128 for none), so the rim
 * reads as the thick edge of a pane; it only ever samples inside the plate,
 * so the edge never pulls in empty pixels. The mask is opaque across the
 * middle and clear at the rim: frosted centre, sharp bent rim.
 */
function lensImages(w: number, h: number) {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  const map = ctx.createImageData(w, h)
  const mask = ctx.createImageData(w, h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const dx = toward(x + 0.5) - toward(w - x - 0.5)
      const dy = toward(y + 0.5) - toward(h - y - 0.5)
      map.data[i] = 128 + Math.round(dx * 127)
      map.data[i + 1] = 128 + Math.round(dy * 127)
      map.data[i + 2] = 128
      map.data[i + 3] = 255
      const edge = Math.min(x, y, w - x, h - y)
      mask.data[i + 3] = Math.round(255 * Math.min(1, Math.max(0, (edge - RIM * 0.25) / (RIM * 0.75))))
    }
  }
  ctx.putImageData(map, 0, 0)
  const mapUrl = canvas.toDataURL()
  ctx.clearRect(0, 0, w, h)
  ctx.putImageData(mask, 0, 0)
  return { map: mapUrl, mask: canvas.toDataURL() }
}

type Lens = { w: number; h: number; map: string; mask: string }

/**
 * A pane of liquid glass behind a block of hero content. The plain plate is
 * CSS (.glass-plate); in Chromium it also bends the dots and wake pixels
 * passing under its rim, Apple style, while its middle stays calm for text.
 */
export function GlassPlate({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = `lens-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`
  const [lens, setLens] = useState<Lens | null>(null)

  // Living glass: the sheen and the rim light follow the pointer (through
  // --px, --py and --glass-hot in .glass-plate), brightest when it is on the
  // plate and fading out by REACH away. Desktop pointers with motion only.
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return
    let raf = 0
    let point: { x: number; y: number } | null = null
    const paint = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      if (!point) {
        el.style.setProperty("--glass-hot", "0")
        return
      }
      const dx = Math.max(rect.left - point.x, 0, point.x - rect.right)
      const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom)
      const hot = Math.max(0, 1 - Math.hypot(dx, dy) / REACH)
      el.style.setProperty("--px", `${(point.x - rect.left).toFixed(1)}px`)
      el.style.setProperty("--py", `${(point.y - rect.top).toFixed(1)}px`)
      el.style.setProperty("--glass-hot", hot.toFixed(3))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      point = { x: e.clientX, y: e.clientY }
      schedule()
    }
    const onLeave = () => {
      point = null
      schedule()
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", schedule, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", schedule)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || !lensSupported()) return
    let built = ""
    const build = () => {
      const w = Math.round(el.offsetWidth)
      const h = Math.round(el.offsetHeight)
      if (w < RIM * 3 || h < RIM * 3 || built === `${w}x${h}`) return
      built = `${w}x${h}`
      setLens({ w, h, ...lensImages(w, h) })
    }
    const observer = new ResizeObserver(build)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filter = lens ? `url(#${id})` : undefined

  return (
    <div
      ref={ref}
      data-lens={lens ? "" : undefined}
      className={cn("glass-plate", className)}
      style={lens ? { backdropFilter: filter, WebkitBackdropFilter: filter } : undefined}
    >
      {lens && (
        <svg aria-hidden width="0" height="0" className="pointer-events-none absolute">
          <filter
            id={id}
            x="0"
            y="0"
            width={lens.w}
            height={lens.h}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={lens.map} x="0" y="0" width={lens.w} height={lens.h} preserveAspectRatio="none" result="map" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={BEND} xChannelSelector="R" yChannelSelector="G" result="bent" />
            <feGaussianBlur in="bent" stdDeviation={BLUR} edgeMode="duplicate" result="frosted" />
            <feImage href={lens.mask} x="0" y="0" width={lens.w} height={lens.h} preserveAspectRatio="none" result="mask" />
            <feComposite in="frosted" in2="mask" operator="in" result="centre" />
            {/* The rim keeps its bend but loses the grain: bent dots read as streaks. */}
            <feGaussianBlur in="bent" stdDeviation={RIM_SOFTEN} result="rim" />
            <feComposite in="centre" in2="rim" operator="over" result="glass" />
            <feColorMatrix in="glass" type="saturate" values="1.6" />
          </filter>
        </svg>
      )}
      {children}
    </div>
  )
}
