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
 * pointers with motion only; elsewhere the child renders untouched. It
 * listens only while on screen and measures itself once per scroll, so the
 * pointer never forces layout.
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
    // Where the child sits at rest, measured on demand and dropped on scroll
    // or resize.
    let home: DOMRect | null = null

    const frame = () => {
      x += (tx - x) * EASE
      y += (ty - y) * EASE
      if (Math.abs(tx - x) < 0.05 && Math.abs(ty - y) < 0.05) {
        x = tx
        y = ty
      }
      el.style.transform = x || y ? `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)` : ""
      el.style.willChange = x || y ? "transform" : ""
      raf = x === tx && y === ty ? 0 : requestAnimationFrame(frame)
    }
    const run = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      if (!home) {
        // Measured without our own offset, so the pull doesn't chase itself.
        const r = el.getBoundingClientRect()
        home = new DOMRect(r.left - x, r.top - y, r.width, r.height)
      }
      const rect = home
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right)
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom)
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

    const forget = () => {
      home = null
    }
    let listening = false
    const listen = (on: boolean) => {
      if (on === listening) return
      listening = on
      const method = on ? "addEventListener" : "removeEventListener"
      window[method]("pointermove", onMove as EventListener, { passive: true })
      window[method]("scroll", forget, { passive: true })
      window[method]("resize", forget)
      document.documentElement[method]("pointerleave", onLeave)
      if (!on) onLeave()
    }
    const io = new IntersectionObserver(([entry]) => {
      forget()
      listen(entry.isIntersecting)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      listen(false)
      cancelAnimationFrame(raf)
      el.style.transform = ""
      el.style.willChange = ""
    }
  }, [])

  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      {children}
    </span>
  )
}
