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
    <div className="flex flex-col gap-4">
      {layers.map((layer, i) => (
        <div key={layer.num}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={clsx(
              "relative overflow-hidden rounded-2xl border p-6",
              "grid gap-4 md:grid-cols-[72px_1fr_160px] md:items-center",
              "transition-all duration-300",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_28px_-26px_rgba(0,0,0,0.32)]",
              "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_70px_-48px_rgba(0,0,0,0.9)]",
              layer.isCore
                ? [
                    "border-accent/50 bg-[linear-gradient(180deg,oklch(0.985_0.022_55),oklch(0.955_0.018_48))]",
                    "dark:border-accent/40 dark:bg-gradient-to-b dark:from-accent/[0.14] dark:to-accent/[0.04]",
                  ]
                : [
                    "border-black/[0.08] bg-[linear-gradient(180deg,oklch(1_0_0),oklch(0.975_0_0))]",
                    "dark:border-white/[0.09] dark:bg-[linear-gradient(180deg,oklch(0.18_0_0),oklch(0.145_0_0))]",
                  ]
            )}
          >
            <div
              aria-hidden
              className={clsx(
                "pointer-events-none absolute inset-x-0 top-0 h-px",
                layer.isCore ? "bg-accent/45" : "bg-black/[0.06] dark:bg-white/[0.08]"
              )}
            />
            {/* Layer number */}
            <p className={`text-[11px] font-mono tracking-[0.08em] ${layer.isCore ? "text-accent" : "text-muted-foreground"}`}>
              {layer.num}
            </p>

            {/* Title + body */}
            <div>
              <p className="text-[17px] font-medium text-foreground leading-snug mb-1.5">
                {layer.title}
              </p>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-lg">
                {layer.body}
              </p>
            </div>

            {/* Meta tags */}
            {layer.meta && (
              <div className="hidden md:flex flex-col gap-1 text-right">
                {layer.meta.map(m => (
                  <span key={m} className="text-[11px] font-mono text-muted-foreground tracking-[0.06em]">
                    {m}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Connector arrow between layers */}
          {i < layers.length - 1 && (
            <div className="flex justify-center my-1">
              <div className="w-px h-6 bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
