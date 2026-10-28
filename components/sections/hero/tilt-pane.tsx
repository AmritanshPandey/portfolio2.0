"use client"

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// The most the pane leans (degrees), and how far the photo drifts against it (px).
const TILT = 4
const DRIFT = 6
// Share of the remaining tilt covered each frame: a soft spring.
const EASE = 0.12
// Ripples in flight at once; older ones are dropped.
const MAX_RIPPLES = 3

type Ripple = { id: number; x: number; y: number; size: number }

/**
 * Makes the hero pane a card you can play with: it leans toward the pointer,
 * anything inside marked [data-tilt-drift] drifts a few px against it, and a
 * click sends a ripple across the glass. Both are plain transforms written
 * straight onto their elements, so a tilt frame restyles nothing else. Tilt
 * is for desktop pointers with motion; ripples answer taps too, and both stay
 * off under reduced motion.
 */
export function TiltPane({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return
    const drift = [...el.querySelectorAll<HTMLElement>("[data-tilt-drift]")]
    let raf = 0
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    // The pane's own box, measured once per hover: the tilt itself would skew
    // a fresh measurement on every move.
    let rect: DOMRect | null = null

    const frame = () => {
      x += (tx - x) * EASE
      y += (ty - y) * EASE
      if (Math.abs(tx - x) < 0.002 && Math.abs(ty - y) < 0.002) {
        x = tx
        y = ty
      }
      const moving = x !== tx || y !== ty || x !== 0 || y !== 0
      el.style.transform = moving
        ? `perspective(1200px) rotateX(${(-y * TILT).toFixed(3)}deg) rotateY(${(x * TILT).toFixed(3)}deg)`
        : ""
      for (const d of drift) {
        d.style.transform = moving ? `translate3d(${(-x * DRIFT).toFixed(2)}px, ${(-y * DRIFT).toFixed(2)}px, 0)` : ""
      }
      // A layer only while it moves; at rest the pane is part of the page.
      const hint = moving ? "transform" : ""
      el.style.willChange = hint
      for (const d of drift) d.style.willChange = hint
      raf = x === tx && y === ty ? 0 : requestAnimationFrame(frame)
    }
    const run = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onEnter = () => {
      rect = null
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      if (!rect) {
        // Measured flat, so the box is the pane's, not its tilted outline.
        const t = el.style.transform
        el.style.transform = ""
        rect = el.getBoundingClientRect()
        el.style.transform = t
      }
      tx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1))
      ty = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1))
      run()
    }
    const onLeave = () => {
      rect = null
      tx = 0
      ty = 0
      run()
    }

    el.addEventListener("pointerenter", onEnter)
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    window.addEventListener("scroll", onEnter, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      el.style.transform = ""
      el.style.willChange = ""
      for (const d of drift) {
        d.style.transform = ""
        d.style.willChange = ""
      }
      el.removeEventListener("pointerenter", onEnter)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("scroll", onEnter)
    }
  }, [])

  // Phones have no pointer to play with, so on the first visit of a session
  // the glass answers once by itself: one ring from near the top of the pane,
  // after the hero has landed. Desktop gets the pixel stroke instead.
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia("(pointer: coarse) and (prefers-reduced-motion: no-preference)").matches) return
    try {
      if (sessionStorage.getItem("pane:intro")) return
      sessionStorage.setItem("pane:intro", "1")
    } catch {
      return
    }
    const timer = window.setTimeout(() => {
      if (window.scrollY > 40) return
      const rect = el.getBoundingClientRect()
      const x = rect.width / 2
      const y = rect.height * 0.3
      const size = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y))
      setRipples([{ id: nextId.current++, x, y, size }])
    }, 1100)
    return () => clearTimeout(timer)
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // Big enough to reach the far corner from wherever it starts.
    const size = 2 * Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y))
    const id = nextId.current++
    setRipples((rs) => [...rs.slice(-(MAX_RIPPLES - 1)), { id, x, y, size }])
  }, [])

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      className={cn("relative", className)}
    >
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[4px]">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="glass-ripple"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
            onAnimationEnd={() => setRipples((rs) => rs.filter((q) => q.id !== r.id))}
          />
        ))}
      </div>
    </div>
  )
}
