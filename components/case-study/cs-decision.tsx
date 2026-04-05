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
      className="rounded-2xl border border-white/[0.08] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.08] flex items-start gap-5">
        <span className="
          text-[10px] font-bold tabular-nums text-orange-500/70
          shrink-0 mt-0.5
        ">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-base md:text-[17px] font-medium text-white leading-snug">
          {title}
        </h3>
      </div>

      {/* Parts grid */}
      <div className={`
        grid divide-white/[0.06]
        ${hasFourParts ? "md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" : "md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"}
      `}>
        {parts.map(({ label, value, accent }) => (
          <div key={label} className="px-6 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600 mb-2.5">
              {label}
            </p>
            <p className={`text-sm leading-relaxed ${accent ? "text-white" : "text-neutral-400"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
