"use client"

import clsx from "clsx"
import { motion } from "framer-motion"

type Variant = "default" | "muted" | "highlight"

export function SectionTransition({
  eyebrow,
  text,
  variant = "default",
}: {
  eyebrow?: string
  text: string
  variant?: Variant
}) {

  const textStyles = {
    default: "text-foreground text-lg md:text-xl",
    muted: "text-muted-foreground text-base md:text-lg",
    highlight: "text-foreground text-xl md:text-2xl font-medium",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      className="mt-6 md:mt-10"
    >

      <div className="max-w-xl space-y-5">

        {/* ✨ DIVIDER */}
        <div className="relative h-[2px] w-20 overflow-hidden rounded-full">

          {/* base */}
          <div className="absolute inset-0 bg-border/60" />

          {/* animated fill */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "70%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="
              absolute left-0 top-0 h-full
              bg-gradient-to-r from-orange-500 to-orange-400
            "
          />

          {/* shimmer pass (very subtle) */}
          <motion.div
            initial={{ x: "-100%" }}
            whileInView={{ x: "120%" }}
            transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
            className="
              absolute top-0 h-full w-10
              bg-gradient-to-r from-transparent via-white/40 to-transparent
              dark:via-white/20
            "
          />

        </div>

        {/* EYEBROW */}
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="
              text-[11px] tracking-[0.2em] uppercase
              text-muted-foreground
            "
          >
            {eyebrow}
          </motion.p>
        )}

        {/* TEXT */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className={clsx(
            "leading-[1.65] tracking-tight",
            textStyles[variant]
          )}
        >
          {/* ✨ word-level micro animation */}
          {text.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.15 + i * 0.015, // stagger per word
              }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

      </div>
    </motion.div>
  )
}