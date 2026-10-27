"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// How near (px) the pointer has to come for the glass to catch its light.
const REACH = 360

/**
 * A pane of glass behind a block of hero content (.glass-plate in
 * globals.css): frosted, with a light rim and a fixed sheen. Its sheen and rim
 * light follow the pointer through a leaf layer (.glass-glow), so a pointer
 * move restyles that one element rather than everything on the glass, and it
 * only listens while the plate is on screen.
 */
export function GlassPlate({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)

  // Living glass: --px, --py and --glass-hot on the glow layer, brightest when
  // the pointer is on the plate and fading out by REACH away. Desktop
  // pointers with motion only.
  useEffect(() => {
    const el = ref.current
    const glow = glowRef.current
    if (!el || !glow || !matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return
    let raf = 0
    let point: { x: number; y: number } | null = null
    // Measured on demand and dropped on scroll or resize, so a pointer move
    // never forces layout.
    let rect: DOMRect | null = null
    let last = { x: NaN, y: NaN, hot: -1 }

    const paint = () => {
      raf = 0
      rect ??= el.getBoundingClientRect()
      let hot = 0
      let x = last.x
      let y = last.y
      if (point) {
        const dx = Math.max(rect.left - point.x, 0, point.x - rect.right)
        const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom)
        hot = Math.max(0, 1 - Math.hypot(dx, dy) / REACH)
        x = point.x - rect.left
        y = point.y - rect.top
      }
      // Only what changed is written; a still glow costs nothing.
      if (hot > 0 && (Math.abs(x - last.x) >= 0.5 || Math.abs(y - last.y) >= 0.5)) {
        glow.style.setProperty("--px", `${x.toFixed(1)}px`)
        glow.style.setProperty("--py", `${y.toFixed(1)}px`)
        last.x = x
        last.y = y
      }
      if (Math.abs(hot - last.hot) >= 0.005 || (hot === 0 && last.hot !== 0)) {
        glow.style.setProperty("--glass-hot", hot.toFixed(3))
        last.hot = hot
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      point = { x: e.clientX, y: e.clientY }
      schedule()
    }
    const onLeave = () => {
      point = null
      schedule()
    }
    const forget = () => {
      rect = null
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
      last = { x: NaN, y: NaN, hot: -1 }
    }
  }, [])

  return (
    <div ref={ref} className={cn("glass-plate", className)}>
      <span ref={glowRef} aria-hidden className="glass-glow" />
      {children}
    </div>
  )
}
