"use client"

import { motion } from "framer-motion"
import { IconArrowRight } from "@tabler/icons-react"

interface Props {
  steps: string[]
  dark?: boolean
}

export function CsFlow({ steps, dark = false }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`
              px-4 py-2.5 rounded-full
              border transition-colors
              ${dark
                ? "border-white/10 bg-white/[0.04]"
                : "border-border/60 bg-muted/40 dark:border-white/[0.08] dark:bg-white/[0.03]"
              }
            `}>
              <p className={`
                text-[10px] font-semibold uppercase tracking-[0.14em] mb-0.5
                ${dark ? "text-neutral-600" : "text-muted-foreground"}
              `}>
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className={`
                text-sm font-medium whitespace-nowrap
                ${dark ? "text-white" : "text-foreground"}
              `}>
                {step}
              </p>
            </div>
          </motion.div>

          {i < steps.length - 1 && (
            <IconArrowRight
              size={14}
              strokeWidth={2}
              className={dark ? "text-neutral-700 shrink-0" : "text-muted-foreground/40 shrink-0"}
            />
          )}

        </div>
      ))}
    </div>
  )
}
