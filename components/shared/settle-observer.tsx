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
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    )

    const track = (scope: ParentNode) => {
      const vh = window.innerHeight
      scope.querySelectorAll<HTMLElement>("[data-settle]:not([data-settled])").forEach((el) => {
        const box = el.getBoundingClientRect()
        if (box.top < vh && box.bottom > 0) el.setAttribute("data-settled", "")
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
