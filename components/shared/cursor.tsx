"use client"

import { useEffect, useRef, useCallback } from "react"

// ─── types ───────────────────────────────────────────────────
type State = "default" | "link" | "card"

// ─── ring config per state ───────────────────────────────────
const RING = {
  default: { scale: 1,    border: "rgba(150,150,150,0.30)", bg: "transparent" },
  link:    { scale: 1.38, border: "rgba(150,150,150,0.55)", bg: "transparent" },
  card:    { scale: 2.6,  border: "rgba(234,88,12,0.55)",   bg: "rgba(234,88,12,0.05)" },
}

const RING_SIZE   = 38   // px — base diameter
const DOT_SIZE    = 5    // px
const LERP        = 0.10 // ring lag factor
const SCALE_LERP  = 0.09 // scale smoothing

export function FancyCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const rafRef   = useRef<number>(0)

  // Live cursor position (updated every mousemove, no lag)
  const mx = useRef(-400)
  const my = useRef(-400)

  // Lerped ring position
  const rx = useRef(-400)
  const ry = useRef(-400)

  // Scale animation
  const targetScale  = useRef(1)
  const currentScale = useRef(1)

  // Track whether we're mid-click (so mouseup can restore)
  const clickBase = useRef(1)
  const isDown    = useRef(false)

  // ── RAF loop ─────────────────────────────────────────────
  const tick = useCallback(() => {
    rx.current += (mx.current - rx.current) * LERP
    ry.current += (my.current - ry.current) * LERP
    currentScale.current += (targetScale.current - currentScale.current) * SCALE_LERP

    const ring = ringRef.current
    if (ring) {
      ring.style.transform =
        `translate3d(${rx.current - RING_SIZE / 2}px, ${ry.current - RING_SIZE / 2}px, 0)` +
        ` scale(${currentScale.current})`
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  // ── helpers ───────────────────────────────────────────────
  const setState = useCallback((state: State) => {
    const ring  = ringRef.current
    const dot   = dotRef.current
    const label = labelRef.current
    if (!ring || !dot || !label) return

    const cfg = RING[state]
    clickBase.current  = cfg.scale
    targetScale.current = isDown.current ? cfg.scale * 0.78 : cfg.scale

    ring.style.borderColor = cfg.border
    ring.style.background  = cfg.bg

    // Dot: hide during card hover (ring is big enough to take over)
    dot.style.opacity  = state === "card" ? "0" : "1"
    label.style.opacity = state === "card" ? "1" : "0"
  }, [])

  // ── effects ───────────────────────────────────────────────
  useEffect(() => {
    // No custom cursor on touch / coarse-pointer devices
    if (!window.matchMedia("(pointer: fine)").matches) return

    const dot   = dotRef.current
    const ring  = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    // Start hidden; reveal on first move
    let visible = false
    dot.style.opacity  = "0"
    ring.style.opacity = "0"

    // ── mousemove ──────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX
      my.current = e.clientY

      // Dot is instant — no lag
      dot.style.transform =
        `translate3d(${e.clientX - DOT_SIZE / 2}px, ${e.clientY - DOT_SIZE / 2}px, 0)`

      // Label floats just below-right of hot-spot
      label.style.transform =
        `translate3d(${e.clientX + 14}px, ${e.clientY + 14}px, 0)`

      if (!visible) {
        dot.style.opacity  = "1"
        ring.style.opacity = "1"
        visible = true
      }
    }

    // ── pointerover — state machine ────────────────────────
    const onOver = (e: PointerEvent) => {
      const el   = e.target as HTMLElement
      const card = el.closest("[data-cursor-card]")
      const link = el.closest("a, button, [role='button'], input, textarea, select, label")

      if (card) {
        label.textContent = card.getAttribute("data-cursor-label") || "View"
        setState("card")
      } else if (link) {
        setState("link")
      } else {
        setState("default")
      }
    }

    // ── click feedback ─────────────────────────────────────
    const onDown = () => {
      isDown.current = true
      targetScale.current = clickBase.current * 0.78
    }

    const onUp = () => {
      isDown.current = false
      targetScale.current = clickBase.current
    }

    // ── hide when cursor leaves window ─────────────────────
    const onLeave = () => {
      dot.style.opacity  = "0"
      ring.style.opacity = "0"
      visible = false
    }
    const onEnter = () => {
      if (!visible) {
        dot.style.opacity  = "1"
        ring.style.opacity = "1"
        visible = true
      }
    }

    // Start the rAF loop
    rafRef.current = requestAnimationFrame(tick)

    window.addEventListener("mousemove",  onMove,  { passive: true })
    document.addEventListener("pointerover", onOver)
    document.addEventListener("mousedown",   onDown)
    document.addEventListener("mouseup",     onUp)
    document.addEventListener("mouseleave",  onLeave)
    document.addEventListener("mouseenter",  onEnter)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove",    onMove)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("mousedown",   onDown)
      document.removeEventListener("mouseup",     onUp)
      document.removeEventListener("mouseleave",  onLeave)
      document.removeEventListener("mouseenter",  onEnter)
    }
  }, [tick, setState])

  return (
    <>
      {/*
        DOT — 5 px, white, mix-blend-difference
        Always renders as the visual inverse of the background, so it's
        visible everywhere: white on dark, black on light, teal on orange.
        Follows cursor with ZERO lag.
      */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[1001]"
        style={{
          width:         DOT_SIZE,
          height:        DOT_SIZE,
          borderRadius:  "50%",
          background:    "white",
          mixBlendMode:  "difference",
          willChange:    "transform",
          transform:     "translate3d(-400px, -400px, 0)",
          transition:    "opacity 0.25s ease",
        }}
      />

      {/*
        RING — 38 px base, springs toward cursor with lerp.
        Scale, border-color, and fill transition smoothly between states.
      */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[1000]"
        style={{
          width:         RING_SIZE,
          height:        RING_SIZE,
          borderRadius:  "50%",
          border:        `1.5px solid ${RING.default.border}`,
          willChange:    "transform",
          transform:     "translate3d(-400px, -400px, 0)",
          transition:    "border-color 0.25s ease, background 0.25s ease, opacity 0.3s ease",
        }}
      />

      {/*
        LABEL — floats near cursor during card hover.
        Uses cursor-label-ui class for dark/light colour switching.
      */}
      <div
        ref={labelRef}
        className="cursor-label-ui"
        style={{
          top:        0,
          left:       0,
          willChange: "transform",
          transform:  "translate3d(-400px, -400px, 0)",
          transition: "opacity 0.15s ease",
        }}
      />
    </>
  )
}
