"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import clsx from "clsx"
import type { ReactNode } from "react"

export interface CsOutcomeItem {
  /** Small icon shown in a rounded tile. Optional — falls back to a dot. */
  icon?: ReactNode
  title: string
  text: string
}

export interface CsOutcomesProps {
  /** Media shown on the left (or right when `reverse`). */
  image: string
  imageAlt?: string
  /** Pill badge straddling the top-left of the media (e.g. "TEAM"). */
  tag?: string
  /** Outcome cells — rendered in a two-column grid. */
  items: CsOutcomeItem[]
  /** Put the media on the right instead of the left. */
  reverse?: boolean
  className?: string
}

/**
 * A two-column outcomes block: an editorial media card on one side and a
 * two-column grid of icon · title · description cells on the other. Built for
 * the "what changed / outcomes" beat of a case study. Both columns stretch to
 * the same height; on mobile they stack (media first).
 */
export function CsOutcomes({
  image,
  imageAlt = "",
  tag,
  items,
  reverse = false,
  className,
}: CsOutcomesProps) {
  return (
    <div
      className={clsx(
        "grid items-stretch gap-8 md:grid-cols-2 md:gap-12",
        reverse && "md:[&>*:first-child]:order-last",
        className
      )}
    >
      {/* Media */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-muted ring-1 ring-border/60 md:aspect-auto md:h-full md:min-h-[24rem]"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 520px"
          className="object-cover"
        />
        {tag && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-background/85 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground ring-1 ring-border/60 backdrop-blur">
            {tag}
          </span>
        )}
      </motion.div>

      {/* Outcome grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 gap-x-8 gap-y-9 self-center sm:grid-cols-2"
      >
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-foreground ring-1 ring-border/60 [&>svg]:size-[18px]">
              {item.icon ?? <span className="size-1.5 rounded-full bg-foreground/60" />}
            </span>
            <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground md:text-base">
              {item.title}
            </h3>
            <p className="max-w-[40ch] text-[13.5px] leading-relaxed text-muted-foreground">
              {item.text}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
