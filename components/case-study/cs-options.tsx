"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { EASE, DURATION, STAGGER } from "@/lib/motion"

export interface CsOption {
  title: string
  /** What this approach actually was, in one or two sentences. */
  body: string
  /** Why it won, or why it lost. The reasoning is the point of this block. */
  verdict: string
  chosen?: boolean
}

export interface CsOptionsProps {
  options: CsOption[]
  /** The question these options were answering. */
  question?: string
  className?: string
}

/**
 * The options that were considered, and why one won.
 *
 * A case study that only shows the final answer reads as luck. This is the
 * block that shows judgement: the alternatives were real, and the choice was
 * reasoned. Rejected options are kept at full readability rather than greyed
 * into decoration, because the rejected reasoning is doing as much work as the
 * chosen one.
 *
 * The chosen option is marked with a label and an accent edge, never by colour
 * alone.
 */
export function CsOptions({ options, question, className }: CsOptionsProps) {
  return (
    <div className={clsx("w-full", className)}>
      {question && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="mb-6 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground"
        >
          {question}
        </motion.p>
      )}

      <ul className="grid gap-4 md:grid-cols-3">
        {options.map((o, i) => (
          <motion.li
            key={o.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: DURATION.base, delay: i * STAGGER, ease: EASE }}
            className={clsx(
              "relative flex flex-col overflow-hidden rounded-2xl border p-5",
              o.chosen
                ? "border-accent/35 bg-accent/[0.04]"
                : "border-border/70 bg-foreground/[0.02] dark:bg-white/[0.02]"
            )}
          >
            {o.chosen && (
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/60 via-accent/25 to-transparent"
              />
            )}

            <p
              className={clsx(
                "mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]",
                o.chosen ? "text-accent" : "text-muted-foreground/70"
              )}
            >
              {o.chosen ? "Chosen" : "Considered"}
            </p>

            <h3 className="mb-2 text-[15px] font-medium leading-snug text-foreground">
              {o.title}
            </h3>

            <p className="mb-4 text-[13.5px] leading-relaxed text-foreground/70">
              {o.body}
            </p>

            <p className="mt-auto border-t border-border/60 pt-3 text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground/80">
                {o.chosen ? "Why it won: " : "Why not: "}
              </span>
              {o.verdict}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
