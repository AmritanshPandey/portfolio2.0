"use client"

import { useEffect, useRef, useCallback } from "react"

export function FancyCursor() {
  const ringRef  = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const rafRef   = useRef<number>(0)

  const tx = useRef(-200)
  const ty = useRef(-200)
  const cx = useRef(-200)
  const cy = useRef(-200)

  const targetScale  = useRef(1)
  const currentScale = useRef(1)

  const tick = useCallback(() => {
    cx.current += (tx.current - cx.current) * 0.13
    cy.current += (ty.current - cy.current) * 0.13
    currentScale.current += (targetScale.current - currentScale.current) * 0.1

    const ring = ringRef.current
    if (ring) {
      ring.style.transform = `translate3d(${cx.current - 8}px, ${cy.current - 8}px, 0) scale(${currentScale.current})`
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return

    const ring  = ringRef.current
    const label = labelRef.current
    if (!ring || !label) return

    ring.style.opacity = "0"
    let shown = false

    const onMove = (e: MouseEvent) => {
      tx.current = e.clientX
      ty.current = e.clientY
      label.style.transform = `translate3d(${e.clientX + 14}px, ${e.clientY + 14}px, 0)`

      if (!shown) {
        ring.style.opacity = "1"
        shown = true
      }
    }

    const onOver = (e: PointerEvent) => {
      const el   = e.target as HTMLElement
      const card = el.closest("[data-cursor-card]")
      const link = el.closest("a, button, [role='button']")

      if (card) {
        label.textContent = card.getAttribute("data-cursor-label") || "View"
        label.style.opacity = "1"
        targetScale.current = 2.2
        ring.style.borderColor = "rgba(234,88,12,0.65)"
        ring.style.background  = "rgba(234,88,12,0.06)"
      } else if (link) {
        label.style.opacity = "0"
        targetScale.current = 1.5
        ring.style.borderColor = "rgba(120,120,120,0.45)"
        ring.style.background  = "transparent"
      } else {
        label.style.opacity = "0"
        targetScale.current = 1
        ring.style.borderColor = "rgba(120,120,120,0.45)"
        ring.style.background  = "transparent"
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("pointerover", onOver)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("pointerover", onOver)
    }
  }, [tick])

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[998]"
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1.5px solid rgba(120,120,120,0.45)",
          willChange: "transform",
          transform: "translate3d(-200px, -200px, 0)",
          transition: "border-color 0.25s ease, background 0.25s ease, opacity 0.3s ease",
        }}
      />

      {/* Label — uses cursor-label-ui class from globals.css for dark mode */}
      <div
        ref={labelRef}
        className="cursor-label-ui"
        style={{
          willChange: "transform",
          transform: "translate3d(-200px, -200px, 0)",
          transition: "opacity 0.15s ease",
          // reset position so translate3d is the only positioner
          top: 0,
          left: 0,
        }}
      />
    </>
  )
}
