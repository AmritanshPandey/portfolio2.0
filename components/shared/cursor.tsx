"use client"

import { useEffect, useRef, useCallback } from "react"

const RING_SIZE = 36
const DOT_SIZE  = 5

type CursorState = "default" | "link" | "card"

const RING_SCALE: Record<CursorState, number> = {
  default: 1,
  link:    1.5,
  card:    1,   // ring hidden in card state
}

const LERP     = 0.20
const SCALE_LR = 0.16

export function FancyCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  // Pill refs
  const pillRef      = useRef<HTMLDivElement>(null)  // position anchor
  const pillCardRef  = useRef<HTMLDivElement>(null)  // visible pill shell
  const labelSpanRef = useRef<HTMLSpanElement>(null) // text inside pill

  const rafRef = useRef(0)

  const mx = useRef(-400);  const my = useRef(-400)
  const rx = useRef(-400);  const ry = useRef(-400)
  const currentScale = useRef(RING_SCALE.default)
  const targetScale  = useRef(RING_SCALE.default)
  const activeState  = useRef<CursorState>("default")

  const tick = useCallback(() => {
    rx.current += (mx.current - rx.current) * LERP
    ry.current += (my.current - ry.current) * LERP

    currentScale.current += (targetScale.current - currentScale.current) * SCALE_LR

    const ring  = ringRef.current
    const dot   = dotRef.current
    const pill  = pillRef.current
    const half  = RING_SIZE / 2

    if (ring) {
      ring.style.transform = `translate3d(${rx.current - half}px,${ry.current - half}px,0) scale(${currentScale.current})`
    }
    if (dot) {
      dot.style.transform = `translate3d(${mx.current - DOT_SIZE / 2}px,${my.current - DOT_SIZE / 2}px,0)`
    }
    if (pill) {
      // Pill centered on lerped position
      pill.style.transform = `translate3d(${rx.current}px,${ry.current}px,0)`
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const applyState = useCallback((state: CursorState, label?: string) => {
    const ring     = ringRef.current
    const dot      = dotRef.current
    const pillCard = pillCardRef.current
    const labelEl  = labelSpanRef.current
    if (!ring || !dot || !pillCard || !labelEl) return

    activeState.current = state
    targetScale.current = RING_SCALE[state]

    if (state === "card") {
      // Hide ring + dot, show pill
      ring.style.opacity   = "0"
      dot.style.opacity    = "0"
      pillCard.style.opacity   = "1"
      pillCard.style.transform = "translateX(-50%) translateY(-50%) scale(1)"
      if (label) labelEl.textContent = label
    } else if (state === "link") {
      ring.style.opacity   = "1"
      dot.style.opacity    = "1"
      ring.style.borderColor = "rgba(180,180,180,0.55)"
      ring.style.background  = "transparent"
      pillCard.style.opacity   = "0"
      pillCard.style.transform = "translateX(-50%) translateY(-50%) scale(0.7)"
    } else {
      ring.style.opacity   = "1"
      dot.style.opacity    = "1"
      ring.style.borderColor = "rgba(130,130,130,0.35)"
      ring.style.background  = "transparent"
      pillCard.style.opacity   = "0"
      pillCard.style.transform = "translateX(-50%) translateY(-50%) scale(0.7)"
    }
  }, [])

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return

    const dot      = dotRef.current
    const ring     = ringRef.current
    const pillCard = pillCardRef.current
    if (!dot || !ring || !pillCard) return

    let visible = false
    dot.style.opacity    = "0"
    ring.style.opacity   = "0"
    pillCard.style.opacity = "0"

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX
      my.current = e.clientY
      if (!visible) {
        if (activeState.current !== "card") {
          dot.style.opacity  = "1"
          ring.style.opacity = "1"
        }
        visible = true
      }
    }

    const onOver = (e: PointerEvent) => {
      const el   = e.target as HTMLElement
      const card = el.closest("[data-cursor-card]")
      const link = el.closest("a,button,[role='button'],input,textarea,select,label")
      if (card) {
        const label = card.getAttribute("data-cursor-label") || "View"
        applyState("card", label)
      } else if (link) {
        applyState("link")
      } else {
        applyState("default")
      }
    }

    const onLeave = () => {
      dot.style.opacity    = "0"
      ring.style.opacity   = "0"
      pillCard.style.opacity = "0"
      visible = false
    }
    const onEnter = () => {
      if (!visible) {
        if (activeState.current !== "card") {
          dot.style.opacity  = "1"
          ring.style.opacity = "1"
        }
        visible = true
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener("mousemove",     onMove,  { passive: true })
    document.addEventListener("pointerover", onOver)
    document.addEventListener("mouseleave",  onLeave)
    document.addEventListener("mouseenter",  onEnter)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove",     onMove)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("mouseleave",  onLeave)
      document.removeEventListener("mouseenter",  onEnter)
    }
  }, [tick, applyState])

  return (
    <>
      {/* Dot — zero lag */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[1001]"
        style={{
          width:        DOT_SIZE,
          height:       DOT_SIZE,
          borderRadius: "50%",
          background:   "white",
          mixBlendMode: "difference",
          willChange:   "transform",
          transform:    "translate3d(-400px,-400px,0)",
          transition:   "opacity 0.12s ease",
        }}
      />

      {/* Ring — lerped */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[1000]"
        style={{
          width:        RING_SIZE,
          height:       RING_SIZE,
          borderRadius: "50%",
          border:       "1.5px solid rgba(130,130,130,0.35)",
          willChange:   "transform",
          transform:    "translate3d(-400px,-400px,0) scale(1)",
          transition:   "border-color 0.15s ease, background 0.15s ease, opacity 0.12s ease",
        }}
      />

      {/* Pill position anchor — follows lerped ring position */}
      <div
        ref={pillRef}
        className="pointer-events-none fixed top-0 left-0 z-[1002]"
        style={{ willChange: "transform", transform: "translate3d(-400px,-400px,0)" }}
      >
        {/* Pill — shown only in card state */}
        <div
          ref={pillCardRef}
          style={{
            position:       "absolute",
            top:            0,
            left:           0,
            opacity:        0,
            transform:      "translateX(-50%) translateY(-50%) scale(0.85)",
            transition:     "opacity 0.18s ease, transform 0.18s ease",
            borderRadius:   999,
            minWidth:       72,
            height:         30,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     "#ea580c",
            boxShadow:      "0 2px 10px rgba(234,88,12,0.35)",
          }}
        >
          <span
            ref={labelSpanRef}
            style={{
              color:         "white",
              fontSize:      10.5,
              fontWeight:    600,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              paddingLeft:   13,
              paddingRight:  13,
              whiteSpace:    "nowrap",
              userSelect:    "none",
            }}
          >
            View
          </span>
        </div>
      </div>
    </>
  )
}
