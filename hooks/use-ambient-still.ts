"use client"

import { useEffect, useState } from "react"
import { type Battery, getBattery, onLowBattery, staysStill } from "@/lib/motion-budget"

/**
 * Where an ambient layer runs live.
 * - "desktop": a desktop pointer, the hero dot field's rule. Phones, iPads,
 *   slow Safari and low battery stay still (see staysStill).
 * - "anywhere": any screen, phones included, for layers light enough to run
 *   on one. Only reduced motion and a low battery stay still.
 */
export type AmbientReach = "desktop" | "anywhere"

const LIVE_QUERY: Record<AmbientReach, string> = {
  desktop: "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  anywhere: "(prefers-reduced-motion: no-preference)",
}

const lowBattery = async () => {
  const battery = await getBattery()
  return battery ? onLowBattery(battery) : false
}

/**
 * Whether an ambient canvas layer (the gallery's ASCII field, the footer's
 * sea) should hold one still frame: true until this device is known to
 * animate it at the given reach, and again whenever the media query stops
 * matching or the battery runs low. Plugging back in lets it move again.
 */
export function useAmbientStill(reach: AmbientReach = "desktop") {
  const [still, setStill] = useState(true)

  useEffect(() => {
    const query = window.matchMedia(LIVE_QUERY[reach])
    let cancelled = false
    const decide = async () => {
      if (!query.matches) return setStill(true)
      const stay = reach === "desktop" ? await staysStill() : await lowBattery()
      if (!cancelled) setStill(stay || !query.matches)
    }

    let battery: Battery | undefined
    void getBattery()?.then((b) => {
      if (cancelled || !b) return
      battery = b
      b.addEventListener?.("chargingchange", decide)
      b.addEventListener?.("levelchange", decide)
    })

    void decide()
    query.addEventListener("change", decide)
    return () => {
      cancelled = true
      query.removeEventListener("change", decide)
      battery?.removeEventListener?.("chargingchange", decide)
      battery?.removeEventListener?.("levelchange", decide)
    }
  }, [reach])

  return still
}
