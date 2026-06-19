"use client"

import { useEffect, useRef, useState } from "react"

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
 * Pauses off-screen and in hidden tabs, and renders the
 * first word statically under reduced motion or without JS.
 */
export function RollingWord({
  words = DEFAULT_WORDS,
  hold = 2.6,
  className,
}: RollingWordProps) {
  const maskRef = useRef<HTMLSpanElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const mask = maskRef.current
    if (
      !mask ||
      words.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return

    let timer: number | null = null
    const start = () => {
      if (timer !== null) return
      timer = window.setInterval(() => {
        if (!document.hidden) setIndex((current) => (current + 1) % words.length)
      }, hold * 1000)
    }
    const stop = () => {
      if (timer === null) return
      window.clearInterval(timer)
      timer = null
    }

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    )
    io.observe(mask)

    return () => {
      io.disconnect()
      stop()
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
      <span
        className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateY(-${index * 1.22}em)` }}
      >
        {words.map((word, i) => (
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
