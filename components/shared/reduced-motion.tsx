"use client"

import { useEffect } from "react"

/**
 * Honours prefers-reduced-motion for every Framer Motion animation on the site.
 * Framer is imported lazily and only when the preference is on, so pages that
 * don't otherwise animate with Framer (the home page) never download it.
 */
export function ReducedMotion() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    let loaded = false

    const apply = () => {
      if (!query.matches && !loaded) return
      import("framer-motion").then(({ MotionGlobalConfig }) => {
        loaded = true
        MotionGlobalConfig.skipAnimations = query.matches
      })
    }

    apply()
    query.addEventListener("change", apply)
    return () => query.removeEventListener("change", apply)
  }, [])

  return null
}
