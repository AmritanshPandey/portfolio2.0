"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { scrollToSection } from "@/lib/scroll"
import { restoreScroll } from "@/lib/scroll-manager"

export function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    // 1. try restoring previous scroll
    const restored = restoreScroll(pathname)
    if (restored) return

    // 2. fallback to hash scroll
    const hash = window.location.hash
    if (!hash) return

    const id = hash.replace("#", "")

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSection(id)
      })
    })
  }, [pathname])

  return null
}