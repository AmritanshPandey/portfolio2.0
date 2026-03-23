"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

type CursorState = "default" | "hover" | "card" | "text"

export function FancyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<CursorState>("default")

  const [state, setState] = useState<CursorState>("default")
  const [visible, setVisible] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [label, setLabel] = useState("Explore")

  // ── Sync state to ref (fix jitter) ─────────────────
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // ── Theme detection ─────────────────
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  // ── Movement (GSAP + stable offset) ─────────────────
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const xTo = gsap.quickTo(cursor, "x", {
      duration: 0.22,
      ease: "power3.out",
    })

    const yTo = gsap.quickTo(cursor, "y", {
      duration: 0.28, // slightly heavier feel
      ease: "power3.out",
    })

    gsap.set(cursor, { x: -200, y: -200 })

    const onMove = (e: MouseEvent) => {
      const currentState = stateRef.current

      const offsetY = currentState === "card" ? 30 : 16
      const offsetX = currentState === "card" ? 6 : 0

      xTo(e.clientX + offsetX)
      yTo(e.clientY - offsetY)

      setVisible(true)
    }

    const onOver = (e: PointerEvent) => {
      let el = e.target as HTMLElement | null

      // 🔍 walk up DOM for cursor card
      while (el && el !== document.body) {
        if (el.hasAttribute("data-cursor-card")) {
          const raw = el.getAttribute("data-cursor-label") || "Explore"

          const normalized =
            raw.toLowerCase().includes("read")
              ? "Read"
              : raw.toLowerCase().includes("open")
              ? "Open"
              : "Explore"

          if (stateRef.current !== "card") {
            setLabel(normalized)
            setState("card")
          }

          return
        }
        el = el.parentElement
      }

      const t = e.target as HTMLElement

      if (t.closest("a, button")) {
        if (stateRef.current !== "hover") setState("hover")
        return
      }

      if (t.closest("p, h1, h2, h3")) {
        if (stateRef.current !== "text") setState("text")
        return
      }

      if (stateRef.current !== "default") setState("default")
    }

    const onLeave = () => setVisible(false)

    document.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("pointerover", onOver, { passive: true })
    document.addEventListener("mouseleave", onLeave)

    return () => {
      gsap.killTweensOf(cursor)
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  // ── Morph (shape transitions) ─────────────────
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const variants = {
      default: {
        width: 10,
        height: 10,
        borderRadius: 999,
        padding: 0,
      },
      hover: {
        width: 16,
        height: 16,
        borderRadius: 999,
        padding: 0,
      },
      card: {
        width: "auto",
        height: 30,
        borderRadius: 999,
        paddingLeft: 12,
        paddingRight: 12,
      },
      text: {
        width: 2,
        height: 20,
        borderRadius: 2,
        padding: 0,
      },
    }

    gsap.to(cursor, {
      ...variants[state],
      duration: 0.25,
      ease: "power3.out",
    })
  }, [state])

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: "translate(-50%, -50%)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        pointerEvents: "none",
        zIndex: 99999,
        opacity: visible ? 1 : 0,

        // ✨ Contrast system (fixed visibility)
        background:
          state === "card"
            ? isDark
              ? "rgba(0,0,0,0.75)"
              : "rgba(255,255,255,0.92)"
            : isDark
            ? "rgba(255,255,255,0.95)"
            : "rgba(0,0,0,0.9)",

        backdropFilter: state === "card" ? "blur(10px)" : "none",

        border:
          state === "card"
            ? isDark
              ? "1px solid rgba(255,255,255,0.12)"
              : "1px solid rgba(0,0,0,0.08)"
            : "none",

        color: isDark ? "white" : "black",

        boxShadow:
          state === "card"
            ? isDark
              ? "0 8px 24px rgba(0,0,0,0.6)"
              : "0 6px 16px rgba(0,0,0,0.12)"
            : "none",

        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",

        maxWidth: 90,
        paddingInline: state === "card" ? 10 : 0,

        transition:
          "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {state === "card" && (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}