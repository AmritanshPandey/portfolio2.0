"use client"

import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

/** Pointer travel (px) before a press becomes a drag rather than a click. */
const DRAG_SLOP = 5
/** Room (px) kept around an item that keyboard focus pans into view. */
const FOCUS_MARGIN = 24

/**
 * The ledger's left edge inside a container `width` px wide, matching
 * `.ledger` (gutter clamp(20px, 4.2vw, 72px), 1560px container), so the
 * sheet's first column lines up with the page header above it.
 */
function ledgerInset(width: number) {
  const gutter = Math.min(72, Math.max(20, width * 0.042))
  return Math.max(gutter, (width - 1560) / 2)
}

/** The range an axis can pan over: a sheet smaller than its frame sits centred. */
function span(frame: number, sheet: number): [number, number] {
  return sheet <= frame ? [(frame - sheet) / 2, (frame - sheet) / 2] : [frame - sheet, 0]
}

const clamp = (v: number, [lo, hi]: [number, number]) => Math.min(hi, Math.max(lo, v))

interface PanSheetProps {
  /** Size of the content laid out on the sheet (px). */
  width: number
  height: number
  /** Space kept above and below the content (px). */
  padY: number
  label: string
  className?: string
  children: ReactNode
}

/**
 * A bounded sheet larger than its frame: drag it, or use a trackpad, wheel or
 * the arrow keys, to look around. It stops at its edges and never moves on its
 * own. Children are positioned absolutely within the content box.
 */
export function PanSheet({ width, height, padY, label, className, children }: PanSheetProps) {
  const reduced = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState({ w: 0, h: 0 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`
  const dots = useMotionTemplate`${x}px ${y}px`

  const inset = ledgerInset(frame.w)
  const sheetW = width + inset * 2
  const sheetH = height + padY * 2
  const [minX, maxX] = span(frame.w, sheetW)
  const [minY, maxY] = span(frame.h, sheetH)

  const moveBy = useCallback(
    (dx: number, dy: number) => {
      x.set(clamp(x.get() + dx, [minX, maxX]))
      y.set(clamp(y.get() + dy, [minY, maxY]))
    },
    [x, y, minX, maxX, minY, maxY],
  )

  // Keep the sheet inside its bounds whenever the frame or sheet resizes.
  useEffect(() => moveBy(0, 0), [moveBy])

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setFrame({ w: el.clientWidth, h: el.clientHeight }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // A released drag glides to a stop; trackpads bring their own momentum.
  const velocity = useRef({ x: 0, y: 0 })
  const glide = useRef(0)
  const stopGlide = useCallback(() => {
    cancelAnimationFrame(glide.current)
    glide.current = 0
  }, [])
  useEffect(() => stopGlide, [stopGlide])

  const startGlide = () => {
    stopGlide()
    if (reduced) return
    let last = performance.now()
    const step = (now: number) => {
      const dt = Math.min(now - last, 50)
      last = now
      const v = velocity.current
      const fromX = x.get()
      const fromY = y.get()
      moveBy((v.x * dt) / 1000, (v.y * dt) / 1000)
      // Reaching an edge ends the glide along that axis.
      if (x.get() === fromX) v.x = 0
      if (y.get() === fromY) v.y = 0
      const decay = Math.pow(0.9, dt / 16.67)
      v.x *= decay
      v.y *= decay
      glide.current = Math.hypot(v.x, v.y) > 10 ? requestAnimationFrame(step) : 0
    }
    glide.current = requestAnimationFrame(step)
  }

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return // pinch zoom
      e.preventDefault()
      stopGlide()
      const unit = e.deltaMode === 1 ? 16 : 1
      moveBy(-e.deltaX * unit, -e.deltaY * unit)
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [moveBy, stopGlide])

  const drag = useRef({ id: -1, startX: 0, startY: 0, lastX: 0, lastY: 0, time: 0, moved: false })

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    stopGlide()
    velocity.current = { x: 0, y: 0 }
    drag.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      time: performance.now(),
      moved: false,
    }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (d.id !== e.pointerId) return
    if (!d.moved) {
      if (Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY) < DRAG_SLOP) return
      // Capture only once it is a drag: capturing on press would send the
      // click to the sheet instead of the item that was pressed.
      d.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const now = performance.now()
    const dx = e.clientX - d.lastX
    const dy = e.clientY - d.lastY
    const elapsed = Math.max(16, now - d.time)
    moveBy(dx, dy)
    velocity.current = { x: (dx / elapsed) * 1000, y: (dy / elapsed) * 1000 }
    d.lastX = e.clientX
    d.lastY = e.clientY
    d.time = now
  }

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (d.id !== e.pointerId) return
    d.id = -1
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    // A pointer held still before letting go should not fling the sheet.
    if (d.moved && performance.now() - d.time < 80) startGlide()
  }

  // A drag that started on an item must not also open it.
  const onClickCapture = (e: MouseEvent) => {
    if (!drag.current.moved) return
    drag.current.moved = false
    e.preventDefault()
    e.stopPropagation()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 240 : 80
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }
    const move = moves[e.key]
    if (!move) return
    e.preventDefault()
    stopGlide()
    moveBy(...move)
  }

  // Tabbing to an item past the edge of the frame pans it into view. Only for
  // keyboard focus: a press on a half-hidden item should not jump the sheet.
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const el = frameRef.current
    if (!el || e.target === el || !e.target.matches(":focus-visible")) return
    const box = el.getBoundingClientRect()
    const item = e.target.getBoundingClientRect()
    let dx = 0
    let dy = 0
    if (item.left < box.left + FOCUS_MARGIN) dx = box.left + FOCUS_MARGIN - item.left
    else if (item.right > box.right - FOCUS_MARGIN) dx = box.right - FOCUS_MARGIN - item.right
    if (item.top < box.top + FOCUS_MARGIN) dy = box.top + FOCUS_MARGIN - item.top
    else if (item.bottom > box.bottom - FOCUS_MARGIN) dy = box.bottom - FOCUS_MARGIN - item.bottom
    stopGlide()
    moveBy(dx, dy)
  }

  return (
    <motion.div
      ref={frameRef}
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        "relative h-full w-full touch-none select-none overflow-hidden outline-none [overscroll-behavior:none]",
        // The hero's dot grid, moving with the sheet so a drag reads as one.
        "bg-[radial-gradient(circle,var(--hero-dot)_0.8px,transparent_1.8px)] bg-[length:18px_18px]",
        className,
      )}
      style={{ backgroundPosition: dots }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClickCapture={onClickCapture}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      // Focus can scroll an overflow-hidden frame; the sheet's transform is
      // the only offset it should have.
      onScroll={(e) => {
        e.currentTarget.scrollLeft = 0
        e.currentTarget.scrollTop = 0
      }}
    >
      <motion.div
        className="absolute left-0 top-0 will-change-transform"
        style={{ width: sheetW, height: sheetH, transform }}
      >
        <div className="absolute" style={{ left: inset, top: padY, width, height }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
