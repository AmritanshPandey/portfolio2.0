"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import type { WakeColors } from "./wake-field"
import { type Battery, getBattery, markSlow, onLowBattery, staysStill } from "@/lib/motion-budget"

// Loaded only once the page is idle on a desktop pointer. Phones, touch and
// reduced motion never download it and keep the static CSS dots instead.
const WakeField = dynamic(() => import("./wake-field").then((m) => m.WakeField), { ssr: false })

// The complement of the media query that shows `.hero-dots` in globals.css.
const LIVE_QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

// The dot pitch, in CSS px. It matches .hero-dots' background-size, so the
// static grid and the live sheet line up exactly.
const PITCH = 8

// A fine, faint screen of ink dots at rest; the wake's pixels print in ink,
// and only the click ring uses ultramarine.
const LIGHT: WakeColors = {
  dot: [0.067, 0.067, 0.067, 0.16],
  wake: [0.067, 0.067, 0.067, 0.45],
  ring: [0.169, 0.208, 0.91, 0.5],
}
const DARK: WakeColors = {
  dot: [0.925, 0.918, 0.894, 0.18],
  wake: [0.925, 0.918, 0.894, 0.5],
  // Lavender on near-black needs more strength to read as clearly.
  ring: [0.549, 0.576, 1, 0.7],
}

/**
 * The hero's dot field: a sheet of dots under the hero rule, bled out to the
 * viewport edges. On a desktop pointer it becomes the pixel wake (see
 * WakeField); everywhere else it stays a static dot grid.
 */
export function HeroField() {
  const [live, setLive] = useState(false)
  const [painted, setPainted] = useState(false)
  // True when this device should keep the static dots even though it passes
  // the media query (see staysStill, and WakeField's frame-rate check).
  const [still, setStill] = useState(false)

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
    let cancelled = false
    const decide = async () => {
      cancel()
      const stay = await staysStill()
      if (cancelled || !query.matches) return
      setStill(stay)
      if (!stay) schedule()
    }
    const onChange = () => {
      if (query.matches) return void decide()
      cancel()
      setLive(false)
      setPainted(false)
      setStill(false)
    }

    // Unplugging, or the battery running low, while the page is open.
    let battery: Battery | undefined
    const onBattery = () => {
      if (!battery || !onLowBattery(battery)) return
      cancel()
      setStill(true)
      setLive(false)
      setPainted(false)
    }
    void getBattery()?.then((b) => {
      if (cancelled || !b) return
      battery = b
      b.addEventListener?.("chargingchange", onBattery)
      b.addEventListener?.("levelchange", onBattery)
    })

    if (query.matches) void decide()
    query.addEventListener("change", onChange)
    return () => {
      cancelled = true
      cancel()
      query.removeEventListener("change", onChange)
      battery?.removeEventListener?.("chargingchange", onBattery)
      battery?.removeEventListener?.("levelchange", onBattery)
    }
  }, [])

  // WakeField found the frame rate too low: static dots for the rest of the
  // session, so it isn't retried on every page.
  const onSlow = () => {
    markSlow()
    setStill(true)
    setLive(false)
    setPainted(false)
  }

  return (
    <div
      aria-hidden
      data-hero-field
      data-live={painted || undefined}
      data-static={still || undefined}
      className="pointer-events-none absolute inset-y-0 left-[calc(50%-50vw)] right-[calc(50%-50vw)] -z-10"
    >
      <div data-hero-dots className="hero-dots absolute inset-0" />
      {live && (
        <WakeField spacing={PITCH} light={LIGHT} dark={DARK} onPaint={() => setPainted(true)} onSlow={onSlow} />
      )}
    </div>
  )
}
