"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// How near (px from the edge) the pointer pulls, and how far the child follows.
const REACH = 80
const PULL = 6
// Share of the remaining distance covered each frame: a soft spring.
const EASE = 0.18

/**
 * Leans its child toward a nearby pointer and lets it settle back. Desktop
 * pointers with motion only; elsewhere the child renders untouched.
 */
export function Magnetic({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return
    let raf = 0
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0

    const frame = () => {
      x += (tx - x) * EASE
      y += (ty - y) * EASE
      if (Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05) {
        x = tx
        y = ty
      }
      el.style.transform = x || y ? `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)` : ""
      raf = x === tx && y === ty ? 0 : requestAnimationFrame(frame)
    }
    const run = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      // Measured without our own offset, so the pull doesn't chase itself.
      const rect = el.getBoundingClientRect()
      const cx = rect.left - x + rect.width / 2
      const cy = rect.top - y + rect.height / 2
      const dx = Math.max(rect.left - x - e.clientX, 0, e.clientX - (rect.right - x))
      const dy = Math.max(rect.top - y - e.clientY, 0, e.clientY - (rect.bottom - y))
      const near = Math.max(0, 1 - Math.hypot(dx, dy) / REACH)
      tx = near ? (((e.clientX - cx) / (rect.width / 2)) * PULL * near) : 0
      ty = near ? (((e.clientY - cy) / (rect.height / 2)) * PULL * near) : 0
      tx = Math.max(-PULL, Math.min(PULL, tx))
      ty = Math.max(-PULL, Math.min(PULL, ty))
      run()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      run()
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.style.transform = ""
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <span ref={ref} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </span>
  )
}
