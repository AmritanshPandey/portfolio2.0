"use client"

import { useEffect, useRef } from "react"

/**
 * Thin ember bar at the very top of long-read pages (articles, case
 * studies, explorations). Driven by direct transform writes inside one
 * rAF-throttled scroll listener — no React re-renders, no layout reads
 * beyond two cached document metrics.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = ref.current
    if (!bar) return

    let pending = false
    const update = () => {
      pending = false
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      bar.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (pending) return
      pending = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return <div ref={ref} className="reading-progress" aria-hidden />
}
