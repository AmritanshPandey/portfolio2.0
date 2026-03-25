"use client"

import { useEffect, useRef } from "react"

export function FancyCursor() {
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const label = labelRef.current
    if (!label) return

    const move = (e: MouseEvent) => {
      label.style.left = e.clientX + 12 + "px"
      label.style.top = e.clientY + 12 + "px"
    }

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement
      const card = el.closest("[data-cursor-card]")

      if (card) {
        label.textContent =
          card.getAttribute("data-cursor-label") || "View"
        label.style.opacity = "1"
      } else {
        label.style.opacity = "0"
      }
    }

    window.addEventListener("mousemove", move)
    document.addEventListener("pointerover", onOver)

    return () => {
      window.removeEventListener("mousemove", move)
      document.removeEventListener("pointerover", onOver)
    }
  }, [])

  return (
    <div
      ref={labelRef}
      className="
        pointer-events-none fixed z-[999]
        opacity-0

        px-3 py-1 rounded-full
        text-xs font-medium

        bg-black text-white
        dark:bg-white dark:text-black
      "
      style={{
        left: 0,
        top: 0,
      }}
    />
  )
}