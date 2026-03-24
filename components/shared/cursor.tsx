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

  // ── Sync state safely
  useEffect(() => {
    prevStateRef.current = stateRef.current
    stateRef.current = state
  }, [state])

  // ── Theme detection
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"))

    check()

    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true })

    return () => obs.disconnect()
  }, [])

  // ── Input detection
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

  // ── Cursor engine
  useEffect(() => {
    if (isTouching) return

    const cursor = cursorRef.current
    if (!cursor) return

    cursor.style.contain = "layout style size"

    let mouse = { x: 0, y: 0 }
    let pos = { x: 0, y: 0 }
    let rafId: number

    gsap.set(cursor, { x: -200, y: -200, opacity: 1 })

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

      gsap.set(cursor, { opacity: 1 })
    }

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      clearIntent()

      const card = t.closest("[data-cursor-card]") as HTMLElement | null

      // ── Intent detection
      if (card) {
        const raw = card.getAttribute("data-cursor-label") || "Explore"

        hoverTimeoutRef.current = window.setTimeout(() => {
          if (stateRef.current !== "card") {
            setLabel(raw)
            setState("card")
          }
        }, 120)

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
      clearIntent()
      gsap.to(cursor, { opacity: 0, duration: 0.2 })
    }

    const render = () => {
      pos.x += (mouse.x - pos.x) * 0.18
      pos.y += (mouse.y - pos.y) * 0.18

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

  // ── Morph system (with bias + reverse collapse)
  useEffect(() => {
    const cursor = cursorRef.current
    const textEl = textRef.current
    if (!cursor) return

    gsap.killTweensOf(cursor)
    if (textEl) gsap.killTweensOf(textEl)

    const prev = prevStateRef.current

    // ── ENTER CARD
    if (state === "card") {
      requestAnimationFrame(() => {
        const textWidth = textEl?.offsetWidth || 40
        const targetWidth = Math.max(textWidth + 28, 64)

        const dir = directionRef.current
        const bias = Math.max(-1, Math.min(1, dir / 40))

        gsap.set(cursor, {
          width: 10,
          height: 10,
          borderRadius: 999,
          xPercent: bias * 20,
        })

        gsap.to(cursor, {
          width: targetWidth,
          height: 34,
          duration: 0.32,
          ease: "power3.out",
        })

        if (textEl) {
          gsap.fromTo(
            textEl,
            { opacity: 0, y: 4 },
            {
              opacity: 1,
              y: 0,
              delay: 0.08,
              duration: 0.2,
              ease: "power2.out",
            }
          )
        }
      })

      return
    }

    // ── EXIT CARD (reverse collapse)
    if (prev === "card" && stateRef.current !== "card") {
      if (textEl) {
        gsap.to(textEl, {
          opacity: 0,
          y: 4,
          duration: 0.15,
        })
      }

      gsap.to(cursor, {
        width: 10,
        height: 10,
        borderRadius: 999,
        xPercent: 0,
        duration: 0.28,
        ease: "power3.inOut",
      })

      return
    }

    // ── OTHER STATES
    const variants = {
      default: { width: 10, height: 10, borderRadius: 999 },
      hover: {
        width: 24,
        height: 24,
        borderRadius: 999,
        background: "transparent",
        border: "1px solid currentColor",
      },
      text: {
        width: 2,
        height: 22,
        borderRadius: 2,
      },
    }

    gsap.to(cursor, {
      ...variants[state],
      duration: 0.22,
      ease: "power3.out",
    })
  }, [state, label])

  if (isTouching) return null

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
        willChange: "transform, width, height",

        background:
          state === "card"
            ? isDark
              ? "rgba(0,0,0,0.75)"
              : "rgba(255,255,255,0.92)"
            : isDark
            ? "rgba(255,255,255,0.95)"
            : "rgba(0,0,0,0.9)",

        backdropFilter: state === "card" ? "blur(10px)" : "none",

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