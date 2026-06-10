"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Lenis from "@studio-freight/lenis"

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()
  const enabled = pathname === "/"

  useEffect(() => {
    if (!enabled) return

    // Respect the OS reduced-motion preference — skip JS smooth scroll entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled])

  // Reset to the top on route change. Lenis keeps its own virtual scroll target,
  // so Next's native scroll reset gets snapped back unless we tell Lenis directly.
  // Skip when deep-linking to an in-page anchor (#section) so the hash still wins.
  useEffect(() => {
    if (!enabled) return
    if (typeof window !== "undefined" && window.location.hash) return

    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [enabled, pathname])

  return null
}
