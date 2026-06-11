"use client"

import {
  useEffect,
  useRef,
  createElement,
  type ElementType,
  type ReactNode,
} from "react"
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap"

/* ─────────────────────────────────────────────────────────────────────────
   Reveal — scroll-entry rise for blocks.

   Content is fully visible by default (no-JS, crawlers, reduced motion);
   gsap.from() only hides it for the duration of the entrance. With
   `stagger`, direct children animate as a sequence instead of the wrapper.
───────────────────────────────────────────────────────────────────────── */

interface RevealProps {
  children: ReactNode
  className?: string
  as?: ElementType
  /** Vertical travel in px. */
  y?: number
  delay?: number
  duration?: number
  /** Stagger (s) between direct children. 0 = animate the wrapper whole. */
  stagger?: number
  /** ScrollTrigger start position. */
  start?: string
  /** Anything else (aria-*, role, id, …) is forwarded to the rendered element. */
  [key: string]: unknown
}

export function Reveal({
  children,
  className,
  as = "div",
  y = 26,
  delay = 0,
  duration = 0.9,
  stagger = 0,
  start = "top 86%",
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const targets: Element[] | Element = stagger > 0 ? Array.from(el.children) : el
    const tween = gsap.from(targets, {
      y,
      autoAlpha: 0,
      duration,
      delay,
      stagger,
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: el, start, once: true },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [y, delay, duration, stagger, start])

  return createElement(as, { ref, className, ...rest }, children)
}

/* ─────────────────────────────────────────────────────────────────────────
   TextReveal — masked line reveal for headings.

   SplitText slices the heading into lines, wraps each in an overflow
   mask, and rolls them up on scroll entry. autoSplit re-splits on resize
   and after webfonts load so line breaks stay true. Reduced motion or
   no JS: the heading simply renders.
───────────────────────────────────────────────────────────────────────── */

interface TextRevealProps {
  children: ReactNode
  className?: string
  as?: ElementType
  delay?: number
  start?: string
  /** Per-line stagger in seconds. */
  stagger?: number
  /** Anything else (aria-*, role, id, …) is forwarded to the rendered element. */
  [key: string]: unknown
}

export function TextReveal({
  children,
  className,
  as = "h2",
  delay = 0,
  start = "top 88%",
  stagger = 0.09,
  ...rest
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    let split: SplitText | null = null
    let cancelled = false

    // Splitting before webfonts settle produces wrong line breaks; autoSplit
    // also re-splits on resize, keeping masks honest at every viewport.
    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return
      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.05,
            ease: "power4.out",
            stagger,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          }),
      })
    })

    return () => {
      cancelled = true
      split?.revert()
    }
  }, [delay, start, stagger])

  return createElement(as, { ref, className, ...rest }, children)
}

/* ─────────────────────────────────────────────────────────────────────────
   Grain — one quiet film-grain wash over the whole canvas.

   A static SVG turbulence tile: no animation, no blend mode, near-free to
   composite, identical in Safari. It keeps large dark surfaces from
   reading as flat digital black.
───────────────────────────────────────────────────────────────────────── */

const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.035] dark:opacity-[0.05]"
      style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "160px 160px" }}
    />
  )
}
