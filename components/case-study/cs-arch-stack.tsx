"use client"

import { motion } from "framer-motion"

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
            className={`
              relative rounded-2xl p-6 grid md:grid-cols-[72px_1fr_160px] gap-4 items-center
              border transition-all duration-300
              ${layer.isCore
                ? "bg-gradient-to-b from-accent/[0.14] to-accent/[0.04] border-accent/40 shadow-[0_20px_50px_-20px_rgba(249,115,22,0.3)]"
                : "bg-card border-border"
              }
            `}
          >
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
