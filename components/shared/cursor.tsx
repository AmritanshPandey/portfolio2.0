"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

type CursorState = "default" | "hover" | "card" | "text"

export function FancyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const stateRef = useRef<CursorState>("default")
  const prevStateRef = useRef<CursorState>("default")
  const hoverTimeoutRef = useRef<number | null>(null)
  const directionRef = useRef(0)

  const [state, setState] = useState<CursorState>("default")
  const [label, setLabel] = useState("Explore")
  const [isDark, setIsDark] = useState(false)
  const [isTouching, setIsTouching] = useState(false)

  // ─────────────────────────────────────────────
  // Theme detection
  // ─────────────────────────────────────────────
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"))

    check()

    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true })

    return () => obs.disconnect()
  }, [])

  // ─────────────────────────────────────────────
  // Input detection
  // ─────────────────────────────────────────────
  useEffect(() => {
    const onTouch = () => setIsTouching(true)
    const onMouse = () => setIsTouching(false)

    window.addEventListener("touchstart", onTouch, { passive: true })
    window.addEventListener("mousemove", onMouse, { passive: true })

    return () => {
      window.removeEventListener("touchstart", onTouch)
      window.removeEventListener("mousemove", onMouse)
    }
  }, [])

  // ─────────────────────────────────────────────
  // Cursor engine (movement + intent)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (isTouching) return

    const cursor = cursorRef.current
    if (!cursor) return

    let mouse = { x: 0, y: 0 }
    let pos = { x: 0, y: 0 }
    let rafId: number

    gsap.set(cursor, { x: -200, y: -200, opacity: 0 })

    const clearIntent = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - mouse.x
      directionRef.current = dx

      mouse.x = e.clientX
      mouse.y = e.clientY

      gsap.to(cursor, { opacity: 1, duration: 0.2 })
    }

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      clearIntent()

      const card = t.closest("[data-cursor-card]") as HTMLElement | null

      // ── CARD INTENT
      if (card) {
        const raw = card.getAttribute("data-cursor-label") || "Explore"

        hoverTimeoutRef.current = window.setTimeout(() => {
          if (stateRef.current !== "card") {
            setLabel(raw)
            setState("card")
          }
        }, 100)

        return
      }

      // ── LINK / BUTTON
      if (t.closest("a, button")) {
        if (stateRef.current !== "hover") setState("hover")
        return
      }

      // ── TEXT
      if (t.closest("p, h1, h2, h3, span")) {
        if (stateRef.current !== "text") setState("text")
        return
      }

      setState("default")
    }

    const onLeave = () => {
      clearIntent()
      setState("default")
      gsap.to(cursor, { opacity: 0, duration: 0.2 })
    }

    const render = () => {
      // smoother, more premium motion
      pos.x += (mouse.x - pos.x) * 0.16
      pos.y += (mouse.y - pos.y) * 0.16

      gsap.set(cursor, {
        x: pos.x,
        y: pos.y,
      })

      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    document.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("pointerover", onOver, { passive: true })
    document.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      clearIntent()
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [isTouching])

  // ─────────────────────────────────────────────
  // State sync
  // ─────────────────────────────────────────────
  useEffect(() => {
    prevStateRef.current = stateRef.current
    stateRef.current = state
  }, [state])

  // ─────────────────────────────────────────────
  // Morph system (clean + reset-safe)
  // ─────────────────────────────────────────────
  useEffect(() => {
    const cursor = cursorRef.current
    const textEl = textRef.current
    if (!cursor) return

    gsap.killTweensOf(cursor)
    if (textEl) gsap.killTweensOf(textEl)

    const prev = prevStateRef.current

    // ── CARD MODE
    if (state === "card") {
      requestAnimationFrame(() => {
        const textWidth = textEl?.offsetWidth || 40
        const targetWidth = Math.max(textWidth + 28, 64)

        const dir = directionRef.current
        const bias = Math.max(-1, Math.min(1, dir / 40))

        gsap.set(cursor, {
          width: 12,
          height: 12,
          borderRadius: 999,
          border: "none",
          xPercent: bias * 20,
        })

        gsap.to(cursor, {
          width: targetWidth,
          height: 34,
          duration: 0.28,
          ease: "power3.out",
        })

        if (textEl) {
          gsap.fromTo(
            textEl,
            { opacity: 0, y: 4 },
            {
              opacity: 1,
              y: 0,
              duration: 0.2,
              delay: 0.08,
            }
          )
        }
      })

      return
    }

    // ── EXIT CARD
    if (prev === "card" && state !== "card") {
      if (textEl) {
        gsap.to(textEl, { opacity: 0, y: 4, duration: 0.15 })
      }

      gsap.to(cursor, {
        width: 10,
        height: 10,
        borderRadius: 999,
        xPercent: 0,
        duration: 0.25,
        ease: "power3.inOut",
      })

      return
    }

    // ── ALL STATES FULLY DEFINED (IMPORTANT FIX)
    const variants = {
      default: {
        width: 10,
        height: 10,
        borderRadius: 999,
        background: isDark
          ? "rgba(255,255,255,0.9)"
          : "rgba(0,0,0,0.9)",
        border: "none",
      },

      hover: {
        width: 22,
        height: 22,
        borderRadius: 999,
        background: "transparent",
        border: isDark
          ? "1px solid rgba(255,255,255,0.9)"
          : "1px solid rgba(0,0,0,0.9)",
      },

      text: {
        width: 2,
        height: 20,
        borderRadius: 2,
        background: isDark
          ? "rgba(255,255,255,0.9)"
          : "rgba(0,0,0,0.9)",
        border: "none",
      },
    }

    gsap.to(cursor, {
      ...variants[state],
      duration: 0.22,
      ease: "power3.out",
    })
  }, [state, label, isDark])

  if (isTouching) return null

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        willChange: "transform, width, height",

        backdropFilter: state === "card" ? "blur(14px)" : "none",

        background:
          state === "card"
            ? isDark
              ? "rgba(20,20,20,0.75)"
              : "rgba(255,255,255,0.75)"
            : isDark
              ? "rgba(255,255,255,0.9)"
              : "rgba(0,0,0,0.9)",

        color: isDark ? "white" : "black",

        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",
      }}
    >
      {state === "card" && (
        <span
          ref={textRef}
          style={{
            whiteSpace: "nowrap",
            opacity: 0,
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}