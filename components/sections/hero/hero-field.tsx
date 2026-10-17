"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import type { WakeColors } from "./wake-field"

// Loaded only once the page is idle on a desktop pointer. Phones, touch and
// reduced motion never download it and keep the static CSS dots instead.
const WakeField = dynamic(() => import("./wake-field").then((m) => m.WakeField), { ssr: false })

// The complement of the media query that shows `.hero-dots` in globals.css.
const LIVE_QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

// Faint ink dots at rest; the wake prints in ink at about half strength, like
// pencil on paper, and only the click ring uses ultramarine.
const LIGHT: WakeColors = {
  dot: [0.067, 0.067, 0.067, 0.34],
  wake: [0.067, 0.067, 0.067, 0.52],
  ring: [0.169, 0.208, 0.91, 0.68],
}
const DARK: WakeColors = {
  dot: [0.925, 0.918, 0.894, 0.4],
  wake: [0.925, 0.918, 0.894, 0.6],
  // Lavender on near-black needs more strength to read as clearly.
  ring: [0.549, 0.576, 1, 0.9],
}

// The sheet hangs from the hero rule: a short fade so no dot is cut in half
// against the rule, full strength behind the statement, gone before the fold.
const POOL = "linear-gradient(to bottom, transparent 0, #000 14px, #000 42%, transparent 82%)"

/**
 * The hero's dot field: a sheet of dots under the hero rule, bled out to the
 * viewport edges. On a desktop pointer it becomes the pixel wake (see
 * WakeField); everywhere else it stays a static dot grid.
 */
export function HeroField() {
  const [live, setLive] = useState(false)
  const [painted, setPainted] = useState(false)

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
      else {
        setLive(false)
        setPainted(false)
      }
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
      data-live={painted || undefined}
      className="pointer-events-none absolute inset-y-0 left-[calc(50%-50vw)] right-[calc(50%-50vw)] -z-10"
      style={{ maskImage: POOL, WebkitMaskImage: POOL }}
    >
      <div data-hero-dots className="hero-dots absolute inset-0" />
      {live && <WakeField spacing={18} light={LIGHT} dark={DARK} onPaint={() => setPainted(true)} />}
    </div>
  )
}
