"use client"

import { motion } from "framer-motion"
import clsx from "clsx"

export interface CsArchLayer {
  num: string
  title: string
  body: string
  meta?: string[]
  isCore?: boolean
}

export interface CsArchStackProps {
  layers: CsArchLayer[]
}

export function CsArchStack({ layers }: CsArchStackProps) {
  return (
    <div className="relative">
      {/* Vertical spine — runs through the centre of the node column */}
      <div
        aria-hidden
        className="absolute top-5 bottom-5 w-px bg-border/50 dark:bg-white/[0.07]"
        style={{ left: 19 }}
      />

      <div className="flex flex-col gap-3">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.num}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-4"
          >
            {/* Node — accent for key layer, neutral otherwise */}
            <div
              className={clsx(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                "font-mono text-[10.5px] font-semibold tracking-[0.04em]",
                layer.isCore
                  ? "border-accent bg-accent text-white shadow-[0_0_18px_rgba(16,185,129,0.35)] dark:text-black"
                  : "dark-bg-surface-18 border-border/60 bg-background text-muted-foreground"
              )}
            >
              {layer.num}
            </div>

            {/* Card */}
            <div
              className={clsx(
                "mb-1 flex-1 min-w-0 rounded-2xl border p-5 md:p-6",
                layer.isCore
                  ? [
                      "border-accent/35 bg-accent/[0.04] dark:bg-accent/[0.07]",
                      "shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_8px_24px_-16px_rgba(16,185,129,0.15)]",
                    ]
                  : [
                      "border-border/55 bg-card/60 dark:bg-white/[0.025]",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_14px_-10px_rgba(0,0,0,0.12)]",
                      "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_4px_14px_-10px_rgba(0,0,0,0.5)]",
                    ]
              )}
            >
              {/* Header row: title + key-layer badge + meta pills */}
              <div className="mb-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <h3 className="text-[15.5px] font-semibold leading-snug text-foreground">
                    {layer.title}
                  </h3>
                  {layer.isCore && (
                    <span className="shrink-0 rounded-full border border-accent/35 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
                      Key layer
                    </span>
                  )}
                </div>

                {/* Meta pills */}
                {layer.meta && layer.meta.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {layer.meta.map((m) => (
                      <span
                        key={m}
                        className={clsx(
                          "rounded-full border px-2.5 py-0.5 font-mono text-[10.5px]",
                          layer.isCore
                            ? "border-accent/30 bg-accent/[0.07] text-accent/80"
                            : "border-border/55 bg-muted/50 text-muted-foreground"
                        )}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                {layer.body}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
