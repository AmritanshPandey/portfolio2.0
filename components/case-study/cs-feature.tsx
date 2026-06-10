"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import type { ReactNode } from "react"

export interface CsFeatureDetail {
  label: string
  text: string
}

export interface CsFeatureProps {
  tag: string
  title: string
  body: string
  details?: [CsFeatureDetail, CsFeatureDetail]
  visual: ReactNode
  reverse?: boolean
  stacked?: boolean
}

export function CsFeature({
  tag,
  title,
  body,
  details,
  visual,
  reverse = false,
  stacked = false,
}: CsFeatureProps) {
  return (
    <div
      className={clsx(
        "grid",
        stacked
          ? "gap-8 md:gap-10"
          : "md:grid-cols-2 gap-10 md:gap-16 items-center",
        !stacked && reverse && "md:[&>*:first-child]:order-last"
      )}
    >

      {/* Visual panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          "rounded-2xl bg-card border border-border/60 flex items-center justify-center overflow-hidden",
          stacked ? "order-2 aspect-[16/9] p-5 md:p-8" : "aspect-[4/3] p-8"
        )}
      >
        {visual}
      </motion.div>

      {/* Text panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={clsx("flex flex-col gap-5", stacked && "order-1 max-w-2xl")}
      >
        <p className="text-[11px] font-medium text-muted-foreground tracking-[0.12em] font-mono">
          {tag}
        </p>

        <h3 className="text-[clamp(26px,2.4vw,36px)] font-semibold tracking-tight leading-[1.12] text-foreground">
          {title}
        </h3>

        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[460px]">
          {body}
        </p>

        {details && (
          <div className="mt-2 pt-5 border-t border-border/60 grid gap-6 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  {d.label}
                </p>
                <p className="text-[14px] text-foreground leading-snug">{d.text}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  )
}
