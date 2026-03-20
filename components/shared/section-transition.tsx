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
    default: "text-neutral-800 text-lg md:text-xl",
    muted: "text-neutral-600 text-base md:text-lg",
    highlight: "text-neutral-900 text-xl md:text-2xl font-medium",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="mt-2 md:mt-6"
    >

      {/* FULL HOVER AREA */}
      <div className="group inline-block">

        <div className="max-w-xl transition-transform duration-300 ease-out group-hover:translate-x-[2px]">

          {/* Divider */}
          <div className="h-px w-16 bg-neutral-300 mb-8 transition-all duration-300 ease-out group-hover:bg-red-500 group-hover:w-20" />

          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-[12px] tracking-[0.18em] uppercase text-neutral-400 mb-3 transition-colors duration-300 group-hover:text-neutral-600">
              {eyebrow}
            </p>
          )}

          {/* Text */}
          <p
            className={clsx(
              "leading-[1.6] tracking-tight transition-colors duration-300 ease-out",
              textStyles[variant],
              "group-hover:text-neutral-900"
            )}
          >
            {text}
          </p>

        </div>

      </div>

    </motion.div>
  )
}