"use client"

import { motion } from "framer-motion"
import type { CaseStudyDecision } from "@/lib/types/case-study"

interface Props extends CaseStudyDecision {
  index?: number
}

export function CsDecision({ title, problem, decision, tradeoff, impact, index = 0 }: Props) {
  const hasFourParts = Boolean(impact)

  const parts = [
    { label: "Problem",   value: problem,  accent: false },
    { label: "Decision",  value: decision, accent: true  },
    { label: "Tradeoff",  value: tradeoff, accent: false },
    ...(impact ? [{ label: "Impact", value: impact, accent: false }] : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-start gap-5">
        <span className="
          text-[10px] font-bold tabular-nums text-accent/80 dark:text-accent/70
          shrink-0 mt-0.5
        ">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-base md:text-[17px] font-medium text-foreground leading-snug">
          {title}
        </h3>
      </div>

      {/* Parts grid */}
      <div className={`
        grid divide-border
        ${hasFourParts ? "md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" : "md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"}
      `}>
        {parts.map(({ label, value, accent }) => (
          <div key={label} className="px-6 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2.5">
              {label}
            </p>
            <p className={`text-sm leading-relaxed ${accent ? "text-foreground" : "text-muted-foreground"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
