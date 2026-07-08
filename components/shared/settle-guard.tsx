"use client"

import { useEffect } from "react"

/**
 * Failsafe for entrance reveals: if an element inside <main> is sitting in the
 * viewport with an inline `opacity: 0` (a Framer Motion initial state whose
 * animation never fired — stalled rAF after a background-tab load, a throttled
 * webview, an extension fault), force it visible rather than leaving a reader
 * staring at blank sections.
 *
 * Deliberately conservative: only touches elements whose *inline* style hides
 * them (the reveal pattern), only when they intersect the viewport, and only
 * after they have stayed hidden across two consecutive checks — so normal
 * below-the-fold reveals (opacity 0 until scrolled to) are never affected.
 * Complements the `html:not(.js)` no-JS net in globals.css, which covers the
 * scriptless case; this covers the hydrated-but-stalled case.
 */
export function SettleGuard() {
  useEffect(() => {
    const pending = new WeakSet<HTMLElement>()

    const sweep = () => {
      const vh = window.innerHeight
      document
        .querySelectorAll<HTMLElement>("main [style*='opacity']")
        .forEach((el) => {
          const inlineOpacity = parseFloat(el.style.opacity)
          if (!(inlineOpacity >= 0) || inlineOpacity > 0.05) return
          const r = el.getBoundingClientRect()
          const inView = r.bottom > 0 && r.top < vh && r.width > 0
          if (!inView) return
          if (pending.has(el)) {
            // Hidden, in view, across two checks — the reveal is not coming.
            el.style.opacity = "1"
            el.style.transform = "none"
            el.style.visibility = "visible"
          } else {
            pending.add(el)
          }
        })
    }

    // Two sweeps a beat apart catch the steady-state stall without racing
    // legitimate entrances; visibility-restore covers background-tab loads.
    const t1 = window.setTimeout(sweep, 3500)
    const t2 = window.setTimeout(sweep, 6000)
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        window.setTimeout(sweep, 1200)
        window.setTimeout(sweep, 3000)
      }
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return null
}
