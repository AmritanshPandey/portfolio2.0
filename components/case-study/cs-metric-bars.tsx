"use client"

import { motion } from "framer-motion"

export interface CsMetricBar {
  label: string
  width: number
  displayValue: string
  isBefore?: boolean
}

export interface CsMetricBarsProps {
  sectionLabel?: string
  title: string
  bars: CsMetricBar[]
}

export function CsMetricBars({ sectionLabel, title, bars }: CsMetricBarsProps) {
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center py-10 border-y border-white/[0.08]">

      {/* Label */}
      <div>
        {sectionLabel && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-2">
            {sectionLabel}
          </p>
        )}
        <p className="text-[18px] font-medium text-white leading-snug">{title}</p>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-5">
        {bars.map((bar, i) => (
          <div key={bar.label} className="grid grid-cols-[72px_1fr_96px] gap-4 items-center">
            <p className="text-[11px] font-mono text-neutral-500 tracking-[0.04em]">{bar.label}</p>

            <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className={`h-full rounded-full origin-left ${bar.isBefore ? "bg-white/25" : "bg-gradient-to-r from-orange-500 to-orange-600"}`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 1.1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: `${bar.width}%` }}
              />
            </div>

            <p className="text-[12px] font-mono text-white text-right tracking-[0.03em]">
              {bar.displayValue}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}
