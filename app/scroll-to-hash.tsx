"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { scrollToSection } from "@/lib/scroll"
import { restoreScroll } from "@/lib/scroll-manager"

const HOME_SECTION_IDS = new Set(["hero", "work", "approach", "exploration", "impact", "about"])

export function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    const hash = window.location.hash

    let attempts = 0
    const maxAttempts = 12
    let cleanHashTimer: ReturnType<typeof setTimeout> | undefined

    // ── Zone detection (based on viewport)
    const updateCursorZone = () => {
      const sections = document.querySelectorAll<HTMLElement>(
        "[data-cursor-zone]"
      )

      let activeZone: string | null = null

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()

        // section is considered active if near center of viewport
        const inView =
          rect.top < window.innerHeight * 0.4 &&
          rect.bottom > window.innerHeight * 0.4

        if (inView) {
          activeZone = section.getAttribute("data-cursor-zone")
        }
      })

      if (activeZone) {
        window.dispatchEvent(
          new CustomEvent("cursor:zone", { detail: activeZone })
        )
      }
    }

    // ── Try scroll logic
    const tryScroll = () => {
      // 1. HASH priority
      if (hash) {
        const id = hash.replace("#", "")
        const el = document.getElementById(id)

        if (el) {
          scrollToSection(id)

          // sync zone after scroll settles
          setTimeout(updateCursorZone, 120)
          if (pathname === "/" && HOME_SECTION_IDS.has(id)) {
            cleanHashTimer = setTimeout(() => {
              window.history.replaceState(window.history.state, "", "/")
            }, 180)
          }
          return
        }
      }

      // 2. restore fallback
      if (!hash) {
        const restored = restoreScroll(pathname)
        if (restored) {
          setTimeout(updateCursorZone, 120)
          return
        }
      }

      // 3. retry until DOM ready
      if (attempts < maxAttempts) {
        attempts++
        requestAnimationFrame(tryScroll)
      }
    }

    // ── Initial delay (handles hydration + motion)
    const t = setTimeout(tryScroll, 80)

    // ── Keep syncing on scroll — throttled with rAF so getBoundingClientRect
    //    only runs once per frame instead of on every scroll microtask.
    let rafPending = false
    const onScroll = () => {
      if (rafPending) return
      rafPending = true
      requestAnimationFrame(() => { updateCursorZone(); rafPending = false })
    }

    window.addEventListener("scroll", onScroll, { passive: true })

    // initial sync
    setTimeout(updateCursorZone, 120)

    return () => {
      clearTimeout(t)
      if (cleanHashTimer) clearTimeout(cleanHashTimer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [pathname])

  return null
}
