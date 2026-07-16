"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { EASE, DURATION } from "@/lib/motion"

export interface CsPrinciple {
  /** The rule itself — imperative and specific. "Make AI intent visible". */
  title: string
  /** Why it existed and what it forced. One or two sentences. */
  body: string
  /** Optional: the concrete thing it produced in the product. */
  applied?: string
}

export interface CsPrinciplesProps {
  principles: CsPrinciple[]
  /** Optional framing line above the set. */
  intro?: string
  className?: string
}

/**
 * Design principles — the signature block of a case study.
 *
 * Deliberately not an icon-card grid: principles are numbered and set as an
 * editorial list so the *rule* carries the weight, with an optional "in
 * practice" line tying each one to something real in the product. Best at
 * 3–5; past that they stop being principles and become a checklist.
 */
export function CsPrinciples({ principles, intro, className }: CsPrinciplesProps) {
  return (
    <div className={className}>
      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="mb-8 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground"
        >
          {intro}
        </motion.p>
      )}

      <ol className="divide-y divide-border/60 border-y border-border/60">
        {principles.map((p, i) => (
          <motion.li
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: DURATION.base, delay: i * 0.06, ease: EASE }}
            className="group grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 py-6 md:gap-x-8 md:py-7"
          >
            <span
              aria-hidden
              className="mt-[3px] font-mono text-[11px] font-bold tabular-nums text-accent/70"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0">
              <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-foreground md:text-[19px]">
                {p.title}
              </h3>
              <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-muted-foreground">
                {p.body}
              </p>

              {p.applied && (
                <p className="mt-3.5 flex gap-2.5 text-[13px] leading-relaxed text-foreground/70">
                  <span
                    aria-hidden
                    className={clsx(
                      "mt-[7px] h-px w-4 shrink-0 bg-accent/50",
                    )}
                  />
                  <span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                      In practice{" "}
                    </span>
                    {p.applied}
                  </span>
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
