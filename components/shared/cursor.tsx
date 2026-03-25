"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

type CursorState = "default" | "hover" | "card" | "text"

export function FancyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<CursorState>("default")
  const [label, setLabel] = useState("Explore")

  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const direction = useRef(0)
  const raf = useRef<number | null>(null)

  // ─────────────────────────
  // ENABLE ONLY ON CHROME
  // ─────────────────────────
useEffect(() => {
  const ua = navigator.userAgent

  const isChrome =
    ua.includes("Chrome") &&
    !ua.includes("Edg") &&
    !ua.includes("OPR") &&
    !ua.includes("Samsung")

  setEnabled(isChrome)

  if (isChrome) {
    document.documentElement.classList.add("custom-cursor")
  } else {
    document.documentElement.classList.remove("custom-cursor")
  }
}, [])

  // ─────────────────────────
  // MOVEMENT ENGINE
  // ─────────────────────────
  useEffect(() => {
    if (!enabled) return

    const cursor = cursorRef.current
    if (!cursor) return

    gsap.set(cursor, { x: -200, y: -200, opacity: 0 })

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - mouse.current.x
      direction.current = dx

      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      gsap.to(cursor, { opacity: 1, duration: 0.2 })
    }

    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18

      gsap.set(cursor, {
        x: pos.current.x,
        y: pos.current.y,
      })

      raf.current = requestAnimationFrame(loop)
    }

    loop()

    document.addEventListener("mousemove", onMove)

    return () => {
      document.removeEventListener("mousemove", onMove)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [enabled])

  // ─────────────────────────
  // INTERACTIONS
  // ─────────────────────────
  useEffect(() => {
    if (!enabled) return

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement

      const card = t.closest("[data-cursor-card]")

      if (card) {
        setLabel(card.getAttribute("data-cursor-label") || "Explore")
        setState("card")
        return
      }

      if (t.closest("a, button")) {
        setState("hover")
        return
      }

      if (t.closest("p, h1, h2, h3, span")) {
        setState("text")
        return
      }

      setState("default")
    }

    const onLeave = () => {
      setState("default")
    }

    document.addEventListener("pointerover", onOver)
    document.addEventListener("mouseleave", onLeave)

    return () => {
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [enabled])

  // ─────────────────────────
  // MORPH SYSTEM
  // ─────────────────────────
  useEffect(() => {
    if (!enabled) return

    const cursor = cursorRef.current
    const textEl = textRef.current
    if (!cursor) return

    gsap.killTweensOf(cursor)

    if (state === "card") {
      const textWidth = textEl?.offsetWidth || 40
      const width = Math.max(textWidth + 28, 64)

      gsap.set(cursor, {
        width: 12,
        height: 12,
        borderRadius: 999,
      })

      gsap.to(cursor, {
        width,
        height: 34,
        duration: 0.28,
        ease: "power3.out",
      })

      if (textEl) {
        gsap.fromTo(
          textEl,
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.2 }
        )
      }

      return
    }

    const variants = {
      default: {
        width: 10,
        height: 10,
        borderRadius: 999,
      },
      hover: {
        width: 22,
        height: 22,
        borderRadius: 999,
        background: "transparent",
        border: "1px solid currentColor",
      },
      text: {
        width: 2,
        height: 20,
        borderRadius: 2,
      },
    }

    gsap.to(cursor, {
      ...variants[state],
      duration: 0.22,
      ease: "power3.out",
    })
  }, [state, enabled])

  if (!enabled) return null

  return (
    <div ref={cursorRef} className={`cursor cursor-${state}`}>
      <div className="cursor-core" />

      {state === "card" && (
        <span ref={textRef} className="cursor-label">
          {label}
        </span>
      )}
    </div>
  )
}