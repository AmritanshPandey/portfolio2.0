"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { EASE, DURATION } from "@/lib/motion"

export interface CsQuoteProps {
  /** The quote itself, without surrounding quotation marks. */
  quote: string
  /** Who said it. Anonymise where needed: "Product Director, issuing partner". */
  attribution: string
  /** Optional second line: role, team, or context. */
  role?: string
  className?: string
}

/**
 * An inline pull quote — stakeholder feedback as evidence.
 *
 * Sized to punctuate a section, not to become a testimonial card. Uses an
 * oversized accent quote mark rather than a left border stripe (side stripes
 * read as template chrome), and keeps attribution plain so an anonymised
 * source looks deliberate rather than evasive.
 */
export function CsQuote({ quote, attribution, role, className }: CsQuoteProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DURATION.base, ease: EASE }}
      className={clsx("relative py-2 pl-10 md:pl-12", className)}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 select-none font-serif text-[64px] leading-[0.8] text-accent/25 md:text-[76px]"
      >
        &ldquo;
      </span>

      <blockquote className="max-w-[58ch] text-[18px] font-medium leading-[1.5] tracking-[-0.01em] text-foreground md:text-[21px]">
        {quote}
      </blockquote>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px]">
        <span className="font-medium text-foreground/80">{attribution}</span>
        {role && (
          <>
            <span aria-hidden className="h-3 w-px bg-border" />
            <span className="text-muted-foreground">{role}</span>
          </>
        )}
      </figcaption>
    </motion.figure>
  )
}
