"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "@studio-freight/lenis"
import { gsap, ScrollTrigger } from "@/lib/gsap"

declare global {
  interface Window {
    /** Live Lenis instance — lib/scroll.ts routes programmatic scrolls through it. */
    __lenis?: Lenis | null
  }
}

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Respect the OS reduced-motion preference — skip JS smooth scroll entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Coarse-pointer devices keep native momentum scrolling (Lenis stays off
    // for touch by default; this also sidesteps iOS Safari rubber-banding).
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    window.__lenis = lenis

    // Keep ScrollTrigger in lockstep with the virtual scroll position and
    // drive Lenis from GSAP's ticker so there's exactly one rAF loop.
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
      window.__lenis = null
    }
  }, [])

  // Reset to the top on route change. Lenis keeps its own virtual scroll target,
  // so Next's native scroll reset gets snapped back unless we tell Lenis directly.
  // Skip when deep-linking to an in-page anchor (#section) so the hash still wins.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) return

    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }

    // New page, new layout — measured trigger positions are stale.
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  return null
}
