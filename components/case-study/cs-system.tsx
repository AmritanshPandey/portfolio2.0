"use client"

import { motion } from "framer-motion"

interface Props {
  shared: string[]
  brandSpecific: string[]
}

const COLUMNS = [
  {
    heading:  "Shared Layer",
    caption:  "Identical across all brands",
    key:      "shared" as const,
    accent:   true,
  },
  {
    heading:  "Brand Layer",
    caption:  "Token-level overrides only",
    key:      "brandSpecific" as const,
    accent:   false,
  },
]

export function CsSystem({ shared, brandSpecific }: Props) {
  const data = { shared, brandSpecific }

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-10">
      {COLUMNS.map(({ heading, caption, key, accent }, colIdx) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: colIdx * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Column heading */}
          <div className="mb-5 pb-4 border-b border-white/[0.08]">
            <p className="text-sm font-semibold text-white mb-1">{heading}</p>
            <p className="text-xs text-neutral-500">{caption}</p>
          </div>

          {/* Items */}
          <ul className="space-y-3">
            {data[key].map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 + colIdx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 text-sm text-neutral-400 leading-relaxed"
              >
                <span className={`
                  mt-[8px] w-1.5 h-1.5 rounded-full shrink-0
                  ${accent ? "bg-orange-500/70" : "bg-neutral-600"}
                `} />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}
