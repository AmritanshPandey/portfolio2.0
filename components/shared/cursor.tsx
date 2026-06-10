"use client"

import { useEffect, useRef, useCallback } from "react"

const RING_SIZE = 36
const DOT_SIZE  = 5
const IBEAM_W   = 12
const IBEAM_H   = 24

type CursorState = "default" | "link" | "card" | "text"

/** True when the element directly contains selectable, non-whitespace text. */
function hasDirectText(el: Element | null): boolean {
  if (!el) return false
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) {
      return true
    }
  }
  return false
}

const RING_SCALE: Record<CursorState, number> = {
  default: 1,
  link:    1.5,
  card:    1,   // ring hidden in card state
  text:    1,   // ring hidden in text state (I-beam shown instead)
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
  const ibeamRef     = useRef<SVGSVGElement>(null)   // custom I-beam for text

  const rafRef = useRef(0)

  const mx = useRef(-400);  const my = useRef(-400)
  const rx = useRef(-400);  const ry = useRef(-400)
  const currentScale = useRef(RING_SCALE.default)
  const targetScale  = useRef(RING_SCALE.default)
  const activeState  = useRef<CursorState>("default")

  const applyState = useCallback((state: CursorState, label?: string) => {
    const ring     = ringRef.current
    const dot      = dotRef.current
    const pillCard = pillCardRef.current
    const labelEl  = labelSpanRef.current
    const ibeam    = ibeamRef.current
    if (!ring || !dot || !pillCard || !labelEl || !ibeam) return

    activeState.current = state
    targetScale.current = RING_SCALE[state]

    const showPill  = state === "card"
    const showIbeam = state === "text"
    const showDotRing = state === "default" || state === "link"

    ring.style.opacity     = showDotRing ? "1" : "0"
    dot.style.opacity      = showDotRing ? "1" : "0"
    ibeam.style.opacity    = showIbeam ? "1" : "0"
    pillCard.style.opacity = showPill ? "1" : "0"
    pillCard.style.transform = showPill
      ? "translateX(-50%) translateY(-50%) scale(1)"
      : "translateX(-50%) translateY(-50%) scale(0.7)"

    if (state === "card" && label) labelEl.textContent = label
    ring.style.background  = "transparent"
    ring.style.borderColor = state === "link" ? "rgba(180,180,180,0.55)" : "rgba(130,130,130,0.35)"
  }, [])

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return

    const dot      = dotRef.current
    const ring     = ringRef.current
    const pillCard = pillCardRef.current
    const ibeam    = ibeamRef.current
    if (!dot || !ring || !pillCard || !ibeam) return

    // Hide the native cursor only while the custom cursor is mounted and active.
    // (The CSS rule is scoped to html.custom-cursor, so every other page keeps
    // its normal cursor.)
    const root = document.documentElement
    root.classList.add("custom-cursor")

    let visible = false
    dot.style.opacity    = "0"
    ring.style.opacity   = "0"
    pillCard.style.opacity = "0"

    // Show dot + ring only when we're actually in a dot/ring state.
    const revealIfNeeded = () => {
      if (visible) return
      const s = activeState.current
      if (s === "default" || s === "link") {
        dot.style.opacity  = "1"
        ring.style.opacity = "1"
      } else if (s === "text") {
        ibeam.style.opacity = "1"
      }
      visible = true
    }

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX
      my.current = e.clientY
      revealIfNeeded()
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
      } else if (hasDirectText(el)) {
        applyState("text")
      } else {
        applyState("default")
      }
    }

    const onLeave = () => {
      dot.style.opacity      = "0"
      ring.style.opacity     = "0"
      pillCard.style.opacity = "0"
      ibeam.style.opacity    = "0"
      visible = false
    }
    const onEnter = () => revealIfNeeded()

    const tick = () => {
      rx.current += (mx.current - rx.current) * LERP
      ry.current += (my.current - ry.current) * LERP

      currentScale.current += (targetScale.current - currentScale.current) * SCALE_LR

      const pill = pillRef.current
      const half = RING_SIZE / 2

      ring.style.transform = `translate3d(${rx.current - half}px,${ry.current - half}px,0) scale(${currentScale.current})`
      dot.style.transform = `translate3d(${mx.current - DOT_SIZE / 2}px,${my.current - DOT_SIZE / 2}px,0)`
      ibeam.style.transform = `translate3d(${mx.current - IBEAM_W / 2}px,${my.current - IBEAM_H / 2}px,0)`

      if (pill) {
        pill.style.transform = `translate3d(${rx.current}px,${ry.current}px,0)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener("mousemove",     onMove,  { passive: true })
    document.addEventListener("pointerover", onOver)
    document.addEventListener("mouseleave",  onLeave)
    document.addEventListener("mouseenter",  onEnter)

    return () => {
      root.classList.remove("custom-cursor")
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove",     onMove)
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("mouseleave",  onLeave)
      document.removeEventListener("mouseenter",  onEnter)
    }
  }, [applyState])

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

      {/* I-beam — custom text-select cursor, zero lag */}
      <svg
        ref={ibeamRef}
        width={IBEAM_W}
        height={IBEAM_H}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[1001]"
        style={{
          mixBlendMode: "difference",
          willChange:   "transform",
          transform:    "translate3d(-400px,-400px,0)",
          opacity:      0,
          transition:   "opacity 0.12s ease",
        }}
      >
        <line x1={IBEAM_W / 2} y1="2.5" x2={IBEAM_W / 2} y2={IBEAM_H - 2.5} stroke="white" strokeWidth="1.5" />
        <path
          d={`M${IBEAM_W / 2 - 3.5} 2.5 Q${IBEAM_W / 2} 2.5 ${IBEAM_W / 2 + 3.5} 2.5 M${IBEAM_W / 2 - 3.5} ${IBEAM_H - 2.5} Q${IBEAM_W / 2} ${IBEAM_H - 2.5} ${IBEAM_W / 2 + 3.5} ${IBEAM_H - 2.5}`}
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

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
            background:     "var(--accent)",
            boxShadow:      "0 2px 12px color-mix(in srgb, var(--accent) 38%, transparent)",
          }}
        >
          <span
            ref={labelSpanRef}
            style={{
              color:         "var(--background)",
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
