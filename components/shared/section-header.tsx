"use client"

import { motion } from "framer-motion"
import clsx from "clsx"

type Variant = "default" | "compact" | "hero"

export function SectionHeader({
  eyebrow,
  title,
  description,
  variant = "default",
}: {
  eyebrow?: string
  title: string
  description?: string
  variant?: Variant
}) {

  const variants = {
    default: {
      container: "max-w-2xl space-y-2",
      title: "text-3xl md:text-4xl lg:text-5xl",
      desc: "text-sm md:text-base",
    },
    compact: {
      container: "mb-5 max-w-xl space-y-2",
      title: "text-2xl md:text-3xl",
      desc: "text-sm",
    },
    hero: {
      container: "mb-10 md:mb-12 max-w-3xl space-y-4",
      title: "text-4xl md:text-5xl lg:text-6xl",
      desc: "text-base md:text-lg",
    },
  }

  const styles = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className={styles.container}
    >

      {eyebrow && (
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-red-500" />
          <p className="text-[12px] tracking-[0.2em] font-medium uppercase text-neutral-600">
            {eyebrow}
          </p>
        </div>
      )}

      <h1
        className={clsx(
          "font-semibold tracking-tight text-neutral-900 leading-[1.1] pb-4 md:pb-6",
          styles.title
        )}
      >
        {title}
      </h1>

      {description && (
        <p
          className={clsx(
            "text-neutral-500 leading-[1.6] max-w-xl",
            styles.desc
          )}
        >
          {description}
        </p>
      )}

    </motion.div>
  )
}