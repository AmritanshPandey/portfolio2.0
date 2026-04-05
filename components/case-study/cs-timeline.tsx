"use client"

import { motion } from "framer-motion"
import type { TimelineItem } from "@/lib/types/case-study"

interface Props {
  items: TimelineItem[]
}

export function CsTimeline({ items }: Props) {
  return (
    <div className="relative">

      {/* Vertical connector line */}
      <div className="
        absolute left-[72px] md:left-[80px]
        top-3 bottom-3
        w-px bg-border/50 dark:bg-white/[0.08]
      " />

      <div className="flex flex-col">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-start gap-0 pb-10 last:pb-0"
          >
            {/* Week label */}
            <div className="shrink-0 w-[65px] md:w-[73px] text-right pr-0 pt-0.5">
              <p className="
                text-[10px] font-semibold leading-tight
                text-muted-foreground
              ">
                {item.week}
              </p>
            </div>

            {/* Dot — sits on the line */}
            <div className="
              relative z-10
              mx-[11px] mt-1
              w-2.5 h-2.5 rounded-full
              bg-orange-500/80
              ring-4 ring-background
              shrink-0
            " />

            {/* Content */}
            <div className="flex-1 pt-0 pl-2">
              <p className="text-sm font-semibold text-foreground mb-1 leading-snug">
                {item.label}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.detail}
              </p>
            </div>

          </motion.div>
        ))}
      </div>
    </div>
  )
}
