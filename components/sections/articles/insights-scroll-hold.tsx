"use client"

import { useEffect } from "react"

/**
 * While the page scrolls under a resting pointer, some browsers (Chrome)
 * hover each row that passes beneath it, so Insights rows would open and
 * close one after another and push the page around mid-scroll. During a
 * scroll this marks the page, and globals.css keeps every row as it was: the
 * row under the pointer when the scroll began stays open, the others stay
 * shut. Hovering works as before the moment the scroll stops.
 */
export function InsightsScrollHold() {
  useEffect(() => {
    const root = document.documentElement
    let timer = 0
    let held: Element | null = null

    const settle = () => {
      timer = 0
      root.removeAttribute("data-scrolling")
      held?.removeAttribute("data-hover-held")
      held = null
    }
    const onScroll = () => {
      if (!timer) {
        held = document.querySelector(".work-row:hover")
        held?.setAttribute("data-hover-held", "")
        root.setAttribute("data-scrolling", "")
      }
      clearTimeout(timer)
      timer = window.setTimeout(settle, 150)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      clearTimeout(timer)
      settle()
    }
  }, [])

  return null
}
