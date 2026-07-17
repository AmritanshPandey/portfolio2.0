"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import clsx from "clsx"

export interface VideoLoopProps {
  src: string
  /** Describe what the clip shows. This is the only content a screen reader gets. */
  alt: string
  /** First frame, shown before load and whenever the clip is paused. */
  poster?: string
  aspect?: string
  className?: string
}

/**
 * A silent, looping product clip.
 *
 * A prototype interaction is the one thing a screenshot genuinely cannot carry,
 * so this exists for motion that *is* the evidence, not for decoration.
 *
 * Three things it has to get right:
 * - `playsInline` + `muted`, or iOS Safari takes the video fullscreen on play.
 * - Pause when off-screen. A looping clip is a scroll-length battery drain
 *   otherwise, matching how the canvas backgrounds here already behave.
 * - A visible pause control, and no autoplay under prefers-reduced-motion.
 *   Looping motion the reader can't stop is the accessibility failure this
 *   component would otherwise introduce.
 */
export function VideoLoop({
  src,
  alt,
  poster,
  aspect = "16/9",
  className,
}: VideoLoopProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(false)

  // Only play while actually on screen, and never on first paint if the reader
  // asked for less motion.
  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (low power mode); that's a no-op.
          void el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: 0.25 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [reduce])

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (el.paused) void el.play().catch(() => {})
    else el.pause()
  }

  return (
    <figure className={clsx("relative w-full", className)}>
      <div
        className="relative overflow-hidden rounded-xl border border-border/60 bg-muted"
        style={{ aspectRatio: aspect }}
      >
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="size-full object-cover"
        />

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause clip" : "Play clip"}
          className={clsx(
            "absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/55 px-3 py-1.5",
            "font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm",
            "transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          )}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </figure>
  )
}
