"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

export interface CsBeforeAfterCol {
  visual: ReactNode
  summary: string
  strongText?: string
}

export interface CsBeforeAfterProps {
  before: CsBeforeAfterCol
  after: CsBeforeAfterCol
}

export function CsBeforeAfter({ before, after }: CsBeforeAfterProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Before */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Before
          </p>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-muted/40 border border-dashed border-border p-8 flex items-center justify-center overflow-hidden opacity-75">
          {before.visual}
        </div>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          {before.strongText && (
            <span className="block text-[15px] font-medium text-foreground mb-1.5">{before.strongText}</span>
          )}
          {before.summary}
        </p>
      </motion.div>

      {/* After */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-orange-600/70 dark:text-orange-400/60">
            After
          </p>
        </div>
        <div className="aspect-[4/3] rounded-2xl bg-card border border-border p-8 flex items-center justify-center overflow-hidden">
          {after.visual}
        </div>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          {after.strongText && (
            <span className="block text-[15px] font-medium text-foreground mb-1.5">{after.strongText}</span>
          )}
          {after.summary}
        </p>
      </motion.div>

    </div>
  )
}
