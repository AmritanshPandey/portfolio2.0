"use client"

import { useEffect, useRef } from "react"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

interface RollingWordProps {
  words?: string[]
  /** Seconds each word holds before rolling. */
  hold?: number
  className?: string
}

const DEFAULT_WORDS = ["systems", "platforms", "experiences", "products"]

/**
 * Masked vertical word roll — the calmer successor to the typing caret.
 * Words sit in a column behind an overflow mask; every few seconds the
 * column rolls up one step with a single confident ease. The first word
 * is duplicated at the end so the loop wraps without a visible jump.
 *
 * Pauses off-screen and in hidden tabs (GSAP ticker), and renders the
 * first word statically under reduced motion or without JS.
 */
export function RollingWord({
  words = DEFAULT_WORDS,
  hold = 2.6,
  className,
}: RollingWordProps) {
  const maskRef = useRef<HTMLSpanElement>(null)
  const colRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const mask = maskRef.current
    const col = colRef.current
    if (!mask || !col || prefersReducedMotion() || words.length < 2) return

    const steps = words.length // includes the wrap onto the duplicated first word
    const tl = gsap.timeline({ repeat: -1, paused: true })
    for (let i = 1; i <= steps; i++) {
      tl.to(col, {
        yPercent: (-100 * i) / (steps + 1),
        duration: 0.75,
        ease: "power4.inOut",
        delay: hold,
      })
    }
    // Snap from the duplicate back to the real first word, invisibly.
    tl.set(col, { yPercent: 0 })

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? tl.play() : tl.pause()),
      { threshold: 0 }
    )
    io.observe(mask)

    return () => {
      io.disconnect()
      tl.kill()
    }
  }, [words, hold])

  return (
    // The mask runs 0.2em taller than the line box (pulled back with a
    // negative bottom margin so baseline alignment is untouched) and each
    // word slot matches it, giving descenders — y, p, g — room to render
    // without being cropped by the overflow clip.
    <span
      ref={maskRef}
      className="inline-block overflow-hidden align-bottom"
      style={{ height: "1.22em", marginBottom: "-0.2em" }}
    >
      <span ref={colRef} className="flex flex-col">
        {[...words, words[0]].map((word, i) => (
          <span
            key={`${word}-${i}`}
            aria-hidden={i > 0 || undefined}
            className={className}
            style={{ height: "1.22em", lineHeight: 1.02 }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  )
}
