"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * Holds back a heavy island far down a page (a chart) until the browser is
 * idle after load, or the reader nears it, whichever comes first, so its
 * code stays off the page's first load. Until then it keeps the island's box
 * (pass the same size classes), so nothing moves when it arrives.
 */
export function WhenIdle({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const go = () => setReady(true)

    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && go(), { rootMargin: "800px 0px" })
    io.observe(el)

    // A beat after load, so it stays clear of the page settling in, then a
    // moment when the reader isn't scrolling, then the next idle moment.
    // Safari has no requestIdleCallback; the pause in scrolling stands in.
    const hasIdle = typeof window.requestIdleCallback === "function"
    let lastScroll = 0
    const onScroll = () => {
      lastScroll = performance.now()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    let beat = 0
    let idle = 0
    const whenQuiet = () => {
      const quiet = performance.now() - lastScroll
      if (quiet < 400) {
        beat = window.setTimeout(whenQuiet, 450 - quiet)
        return
      }
      if (hasIdle) idle = window.requestIdleCallback(go, { timeout: 1000 })
      else go()
    }
    const whenIdle = () => {
      beat = window.setTimeout(whenQuiet, 2500)
    }
    if (document.readyState === "complete") whenIdle()
    else window.addEventListener("load", whenIdle, { once: true })

    return () => {
      io.disconnect()
      window.removeEventListener("load", whenIdle)
      window.removeEventListener("scroll", onScroll)
      window.clearTimeout(beat)
      if (hasIdle) window.cancelIdleCallback(idle)
    }
  }, [])

  return ready ? children : <div ref={ref} className={className} />
}
