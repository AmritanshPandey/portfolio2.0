"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import clsx from "clsx"
import { EASE, DURATION } from "@/lib/motion"

export interface CsAnnotation {
  /** Position of the marker on the image, in % of width / height. */
  x: number
  y: number
  title: string
  text: string
}

export interface CsAnnotatedImageProps {
  src: string
  alt: string
  annotations: CsAnnotation[]
  caption?: string
  /** Aspect ratio of the frame, e.g. "16/10". Defaults to 16/10. */
  aspect?: string
  className?: string
}

/**
 * A screenshot with numbered hotspots and a linked legend.
 *
 * The workhorse for "key experience moments": instead of describing an
 * interface in prose, point at it. Hovering or focusing a marker highlights
 * its legend row and vice-versa, so the pairing reads on a laptop and on a
 * phone (where the markers are small, the legend carries the content).
 *
 * Accessibility: markers are real buttons in the tab order, the legend is an
 * ordered list that is fully readable on its own, and nothing is conveyed by
 * position alone — every marker's content also exists as text below.
 */
export function CsAnnotatedImage({
  src,
  alt,
  annotations,
  caption,
  aspect = "16/10",
  className,
}: CsAnnotatedImageProps) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DURATION.base, ease: EASE }}
      className={clsx("min-w-0", className)}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-border bg-muted/30"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 820px"
          className="object-cover"
        />

        {/* Scrim keeps the markers legible over busy screenshots. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
        />

        {annotations.map((a, i) => {
          const isActive = active === i
          return (
            <button
              key={a.title}
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              aria-label={`${i + 1}. ${a.title}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none"
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
            >
              <span
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full border font-mono text-[11px] font-bold tabular-nums backdrop-blur-md transition-all duration-300",
                  isActive
                    ? "scale-110 border-accent bg-accent text-white shadow-[0_6px_20px_rgba(0,0,0,0.3)] dark:text-neutral-950"
                    : "border-white/40 bg-black/45 text-white hover:scale-105"
                )}
              >
                {i + 1}
              </span>
            </button>
          )
        })}
      </div>

      {/* Legend — the real content; readable with the image ignored. */}
      <ol className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {annotations.map((a, i) => {
          const isActive = active === i
          return (
            <li
              key={a.title}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={clsx(
                "grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-lg px-2 py-1.5 transition-colors duration-200",
                isActive && "bg-accent/[0.06]"
              )}
            >
              <span
                aria-hidden
                className={clsx(
                  "mt-[2px] font-mono text-[10px] font-bold tabular-nums transition-colors",
                  isActive ? "text-accent" : "text-muted-foreground/70"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{a.title}. </span>
                {a.text}
              </p>
            </li>
          )
        })}
      </ol>

      {caption && (
        <figcaption className="mt-4 text-[12px] leading-relaxed text-muted-foreground/80">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
