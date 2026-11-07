"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Drives the Ledger "settle": elements marked `data-settle` land as they
 * scroll into view (rules draw, content rises a few pixels). Anything already
 * on screen when the page mounts is marked settled immediately, so first paint
 * never flickers; nothing is hidden at all until this has run, so no-JS and
 * reduced-motion visitors always see the content. Styling lives in globals.css.
 */
export function SettleObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      root.classList.remove("settle-ready")
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-settled", "")
          io.unobserve(entry.target)
        }
      },
      // Lands as soon as a block's top edge enters the screen, so it is
      // already settling while it comes into view.
      { rootMargin: "0px", threshold: 0 }
    )

    // Measure every block first, then mark them: marking between measurements
    // would make each next measurement recalculate the page's styles.
    const track = (scope: ParentNode) => {
      const vh = window.innerHeight
      const blocks = Array.from(scope.querySelectorAll<HTMLElement>("[data-settle]:not([data-settled])"))
      const onScreen = blocks.map((el) => {
        const box = el.getBoundingClientRect()
        return box.top < vh && box.bottom > 0
      })
      blocks.forEach((el, i) => {
        if (onScreen[i]) el.setAttribute("data-settled", "")
        else io.observe(el)
      })
    }

    track(document)
    root.classList.add("settle-ready")

    // Trees that mount later (client navigation, lazy sections) join in.
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) track(node.parentNode ?? node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
