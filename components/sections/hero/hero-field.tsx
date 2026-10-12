"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// Loaded only once the page is idle on a desktop pointer. Phones, touch and
// reduced motion never download it and keep the static CSS dots instead.
const HeroShaderGrid = dynamic(
  () => import("@/components/shared/hero-shader-grid").then((m) => m.HeroShaderGrid),
  { ssr: false },
)

// The complement of the media query that shows `.hero-dots` in globals.css.
const LIVE_QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

// Ink dots on paper; the ring around the cursor and click ripples answer in
// ultramarine.
const INK = [0.067, 0.067, 0.067, 0.34] as const
const NIGHT_INK = [0.925, 0.918, 0.894, 0.4] as const
const ULTRAMARINE = [0.169, 0.208, 0.91] as const
const NIGHT_ULTRAMARINE = [0.549, 0.576, 1] as const

// Pool the dots behind the statement and dissolve them before the fold.
const POOL = "linear-gradient(to bottom, #000 0%, #000 42%, transparent 82%)"

/**
 * The hero's dot field: a sheet of dots behind the statement that the cursor
 * presses into, with a ripple on click. Decorative and pointer-events-none.
 */
export function HeroField() {
  const [live, setLive] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(LIVE_QUERY)
    // Safari has no requestIdleCallback; a short timeout stands in for it.
    const idle = typeof window.requestIdleCallback === "function"
    let handle: number | undefined

    const schedule = () => {
      handle = idle
        ? window.requestIdleCallback(() => setLive(true), { timeout: 1500 })
        : window.setTimeout(() => setLive(true), 600)
    }
    const cancel = () => {
      if (handle === undefined) return
      if (idle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      handle = undefined
    }
    const onChange = () => {
      cancel()
      if (query.matches) schedule()
      else setLive(false)
    }

    if (query.matches) schedule()
    query.addEventListener("change", onChange)
    return () => {
      cancel()
      query.removeEventListener("change", onChange)
    }
  }, [])

  return (
    <div
      aria-hidden
      data-hero-field
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ maskImage: POOL, WebkitMaskImage: POOL }}
    >
      <div data-hero-dots className="hero-dots absolute inset-0" />
      {live && (
        <HeroShaderGrid
          spacing={18}
          dotSize={0.07}
          radius={0.13}
          drag={1.35}
          maxDrag={0.01}
          lightColor={INK}
          darkColor={NIGHT_INK}
          tintColor={ULTRAMARINE}
          darkTintColor={NIGHT_ULTRAMARINE}
          fallbackOpacity={0.28}
        />
      )}
    </div>
  )
}
