"use client"

/**
 * Central GSAP setup — register plugins once, share one import path.
 * Everything motion-related imports gsap from here so plugin registration
 * and global defaults stay in a single place.
 */
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText)

  // One confident curve for the whole site — matches the existing
  // cubic-bezier(0.22,1,0.36,1) voice used by the navbar and cards.
  gsap.defaults({ ease: "power3.out", duration: 0.8 })
}

export { gsap, ScrollTrigger, SplitText }

/** True when the OS asks for reduced motion — every GSAP entrance checks this. */
export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}
