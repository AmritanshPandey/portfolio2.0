"use client"

import { useEffect, useRef, type RefObject } from "react"

/**
 * Magnetic pull: element drifts toward cursor when within `threshold` px,
 * springs back smoothly on exit.  Pure transform — no filter, no layout shift.
 * Safari-safe: translate3d is GPU-composited everywhere.
 */
export function useMagnetic<T extends HTMLElement>(
  strength  = 0.38,
  threshold = 90
): RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const SPRING = "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)"
    const FOLLOW = "transform 0.12s ease"

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx   = rect.left + rect.width  / 2
      const cy   = rect.top  + rect.height / 2
      const dx   = e.clientX - cx
      const dy   = e.clientY - cy
      const dist = Math.hypot(dx, dy)

      if (dist < threshold) {
        el.style.transition = FOLLOW
        el.style.transform  = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`
      } else {
        el.style.transition = SPRING
        el.style.transform  = "translate3d(0,0,0)"
      }
    }

    const onLeave = () => {
      el.style.transition = SPRING
      el.style.transform  = "translate3d(0,0,0)"
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    el.addEventListener("mouseleave", onLeave)

    return () => {
      window.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
      el.style.transform  = ""
      el.style.transition = ""
    }
  }, [strength, threshold])

  return ref as RefObject<T>
}
