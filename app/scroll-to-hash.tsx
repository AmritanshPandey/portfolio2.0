"use client"

import { useEffect, useLayoutEffect } from "react"
import { usePathname } from "next/navigation"
import { scrollToSection } from "@/lib/scroll"

const HOME_SECTION_IDS = new Set([
  "hero",
  "work",
  "explorations",
  "approach",
  "insights",
  "leadership",
  "advisory",
  "about",
])

const PENDING_HOME_SECTION_KEY = "portfolio:pending-home-section"

function getPendingHomeSection() {
  const id = window.sessionStorage.getItem(PENDING_HOME_SECTION_KEY)
  return id && HOME_SECTION_IDS.has(id) ? id : null
}

// A fresh visit (not a reload or back/forward) already opens at the top, so
// there is nothing to reset, and resetting anyway would cancel a visitor who
// started scrolling while the page loaded (Safari applies a wheel scroll a
// moment late, so it can't be detected in time). Reloads, back/forward and
// client-side page changes still start at the top.
let firstLoad = true
function isFreshVisit() {
  if (!firstLoad) return false
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
  return nav?.type === "navigate"
}

function resetPageScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return

    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"

    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useLayoutEffect(() => {
    if (window.location.hash) return
    if (pathname === "/" && getPendingHomeSection()) return
    if (!isFreshVisit()) resetPageScroll()
  }, [pathname])

  useEffect(() => {
    const hash = window.location.hash
    const pendingHomeSection = pathname === "/" ? getPendingHomeSection() : null

    let attempts = 0
    const maxAttempts = 12
    let cleanHashTimer: ReturnType<typeof setTimeout> | undefined

    // Someone who has already started scrolling is never sent back to the top
    // by the deferred reset below.
    let userScrolled = false
    const onScrollIntent = () => {
      userScrolled = true
    }
    const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "])
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) userScrolled = true
    }
    window.addEventListener("wheel", onScrollIntent, { passive: true })
    window.addEventListener("touchmove", onScrollIntent, { passive: true })
    window.addEventListener("keydown", onKey)

    // Scroll to a section, then re-settle. When arriving from another route the
    // home page is still growing (images loading) so a single scroll can clamp
    // short of far sections. We scroll immediately for instant motion, watch the
    // target's absolute offset until layout stops shifting, then issue one final
    // corrective scroll so far sections always land.
    let settleRaf = 0
    const settleToSection = (id: string) => {
      scrollToSection(id)
      let lastTop: number | null = null
      let stable = 0
      let frames = 0
      const tick = () => {
        const el = document.getElementById(id)
        if (!el) return
        const absTop = Math.round(el.getBoundingClientRect().top + window.scrollY)
        if (absTop === lastTop) stable++
        else {
          stable = 0
          lastTop = absTop
        }
        frames++
        // Layout has held for a few frames (or we've waited ~1.2s) → final scroll.
        if (stable >= 3 || frames > 72) {
          scrollToSection(id)
          return
        }
        settleRaf = requestAnimationFrame(tick)
      }
      settleRaf = requestAnimationFrame(tick)
    }

    // ── Try scroll logic
    const tryScroll = () => {
      // 1. HASH priority
      if (hash) {
        const id = hash.replace("#", "")
        const el = document.getElementById(id)

        if (el) {
          settleToSection(id)
          if (pathname === "/" && HOME_SECTION_IDS.has(id)) {
            cleanHashTimer = setTimeout(() => {
              window.history.replaceState(window.history.state, "", "/")
            }, 180)
          }
          return
        }
      }

      // 2. Internal-page navbar handoff to a home section. This avoids Next
      // hash navigation and performs a single controlled scroll.
      if (pendingHomeSection) {
        const el = document.getElementById(pendingHomeSection)

        if (el) {
          window.sessionStorage.removeItem(PENDING_HOME_SECTION_KEY)
          settleToSection(pendingHomeSection)
          return
        }
      }

      // 3. Default page navigation should always start from the top, unless
      // the visitor is already scrolling.
      if (!hash && !pendingHomeSection) {
        if (!userScrolled && !isFreshVisit()) resetPageScroll()
        firstLoad = false
        return
      }

      // 4. retry until DOM ready
      if (attempts < maxAttempts) {
        attempts++
        requestAnimationFrame(tryScroll)
      }
    }

    // ── Initial delay (handles hydration + motion)
    const t = setTimeout(tryScroll, 80)

    return () => {
      clearTimeout(t)
      if (cleanHashTimer) clearTimeout(cleanHashTimer)
      if (settleRaf) cancelAnimationFrame(settleRaf)
      window.removeEventListener("wheel", onScrollIntent)
      window.removeEventListener("touchmove", onScrollIntent)
      window.removeEventListener("keydown", onKey)
    }
  }, [pathname])

  return null
}
