"use client"

import { useCallback, useRef, useState, type ReactNode } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

/**
 * BeforeAfter — a draggable wipe slider that reveals one layer over another.
 *
 * Generic: `before` and `after` can be any nodes — two <img>s for a classic
 * before/after, or two copies of the same UI forced into different themes for a
 * live light↔dark split (wrap each in a `.light` / `.dark` container; the tokens
 * cascade so the same markup renders both ways).
 *
 * `after` sits underneath and establishes the height; `before` overlays it,
 * clipped to the divider position. Drag anywhere, or focus the handle and use
 * the arrow keys.
 */

const clamp = (n: number) => Math.min(100, Math.max(0, n))

export interface BeforeAfterProps {
  /** Revealed on the left, clipped by the divider. */
  before: ReactNode
  /** Underneath, visible on the right. Sets the component height. */
  after: ReactNode
  beforeLabel?: string
  afterLabel?: string
  /** Starting divider position, 0–100. */
  initial?: number
  className?: string
}

export function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  initial = 50,
  className,
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [pos, setPos] = useState(() => clamp(initial))

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos(clamp(((clientX - r.left) / Math.max(1, r.width)) * 100))
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      setFromClientX(e.clientX)
    },
    [setFromClientX]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (draggingRef.current) setFromClientX(e.clientX)
    },
    [setFromClientX]
  )

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }, [])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setPos((p) => clamp(p - 2))
      e.preventDefault()
    } else if (e.key === "ArrowRight") {
      setPos((p) => clamp(p + 2))
      e.preventDefault()
    } else if (e.key === "Home") {
      setPos(0)
      e.preventDefault()
    } else if (e.key === "End") {
      setPos(100)
      e.preventDefault()
    }
  }, [])

  const labelCls =
    "pointer-events-none absolute top-3 z-10 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm"

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn(
        "relative w-full select-none overflow-hidden rounded-2xl border border-border",
        "cursor-ew-resize touch-none",
        className
      )}
    >
      {/* After — in flow, sets the height and fills the right side */}
      <div className="[&_*]:pointer-events-none">{after}</div>

      {/* Before — overlay, clipped to the left of the divider */}
      <div
        className="absolute inset-0 [&_*]:pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {before}
      </div>

      {beforeLabel && <span className={cn(labelCls, "left-3")}>{beforeLabel}</span>}
      {afterLabel && <span className={cn(labelCls, "right-3")}>{afterLabel}</span>}

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -translate-x-1/2 border-l border-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
        <button
          type="button"
          role="slider"
          tabIndex={0}
          aria-label="Reveal before versus after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
          className={cn(
            "pointer-events-auto absolute top-1/2 left-0 flex size-9 -translate-x-1/2 -translate-y-1/2",
            "items-center justify-center rounded-full bg-white text-neutral-800 shadow-md ring-1 ring-black/10",
            "cursor-ew-resize transition-colors hover:bg-white focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-accent"
          )}
        >
          <IconChevronLeft size={14} stroke={2.5} className="-mr-0.5" />
          <IconChevronRight size={14} stroke={2.5} className="-ml-0.5" />
        </button>
      </div>
    </div>
  )
}
