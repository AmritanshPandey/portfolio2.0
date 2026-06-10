"use client"

import { motion } from "framer-motion"

type Variant = "bullet" | "numbered"

interface Props {
  items: string[]
  variant?: Variant
  /** Accepted for call-site compatibility; list colour now follows the theme. */
  dark?: boolean
}

export function CsList({ items, variant = "bullet" }: Props) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className={`
            flex items-start gap-3.5
            text-sm md:text-[15px] leading-relaxed
            text-foreground/80
          `}
        >
          {variant === "bullet" && (
            <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0" />
          )}
          {variant === "numbered" && (
            <span className="
              mt-0.5 text-[10px] font-bold tabular-nums
              text-accent
              w-5 shrink-0 text-right
            ">
              {String(i + 1).padStart(2, "0")}
            </span>
          )}
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  )
}
