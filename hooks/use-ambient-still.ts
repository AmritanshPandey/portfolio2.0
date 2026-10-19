"use client"

import { useEffect, useState } from "react"
import { staysStill } from "@/lib/motion-budget"

// Animated only where it will be smooth; the hero's dot field uses the same rule.
const LIVE_QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

/**
 * Whether an ambient canvas layer (the gallery's ASCII field, the footer's
 * sea) should hold one still frame: true until this device is known to
 * animate it smoothly, and again whenever the media query stops matching.
 * Phones, iPads, low battery and reduced motion stay still.
 */
export function useAmbientStill() {
  const [still, setStill] = useState(true)

  useEffect(() => {
    const query = window.matchMedia(LIVE_QUERY)
    let cancelled = false
    const decide = async () => {
      const stay = await staysStill()
      if (!cancelled) setStill(stay || !query.matches)
    }
    const onChange = () => {
      if (query.matches) void decide()
      else setStill(true)
    }
    if (query.matches) void decide()
    query.addEventListener("change", onChange)
    return () => {
      cancelled = true
      query.removeEventListener("change", onChange)
    }
  }, [])

  return still
}
