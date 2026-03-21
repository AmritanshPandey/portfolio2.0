"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

type CursorState = "default" | "hover" | "card" | "text"

export function FancyCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const lastEl = useRef<HTMLElement | null>(null)

  const [state, setState] = useState<CursorState>("default")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const xTo = gsap.quickTo(dot, "x", { duration: 0.28, ease: "power2.out" })
    const yTo = gsap.quickTo(dot, "y", { duration: 0.28, ease: "power2.out" })

    gsap.set(dot, { x: -200, y: -200 })

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      setVisible(true)

      const el = e.target as HTMLElement

      if (el !== lastEl.current) {
        if (lastEl.current) lastEl.current.style.removeProperty("cursor")
        el.style.setProperty("cursor", "none", "important")
        lastEl.current = el
      }
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement

      if (t.closest("[data-cursor-card]")) {
        setState("card")
        return
      }

      if (t.closest("a, button")) {
        setState("hover")
        return
      }

      if (t.closest("p, h1, h2, h3")) {
        setState("text")
        return
      }

      setState("default")
    }

    const onLeave = () => {
      setVisible(false)
      if (lastEl.current) {
        lastEl.current.style.removeProperty("cursor")
        lastEl.current = null
      }
    }

    document.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseover", onOver, { passive: true })
    document.addEventListener("mouseleave", onLeave)

    return () => {
      gsap.killTweensOf(dot)
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  // 🎯 State animation
  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const variants = {
      default: { scale: 1, opacity: 1 },
      hover:   { scale: 1.8, opacity: 1 },
      card:    { scale: 3.2, opacity: 0.95 },
      text:    { scaleX: 0.2, scaleY: 2.2, opacity: 0.9 },
    }

    gsap.to(dot, {
      ...variants[state],
      duration: 0.22,
      ease: "power3.out",
    })
  }, [state])

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 10,
        height: 10,
        borderRadius: "9999px",
        background: "white",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        willChange: "transform, opacity",
      }}
    >
      {/* subtle card label */}
      {state === "card" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: "white",
              opacity: 0.7,
              mixBlendMode: "difference",
            }}
          >
            View
          </span>
        </div>
      )}
    </div>
  )
}