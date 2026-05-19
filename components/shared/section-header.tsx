"use client"

import { motion } from "framer-motion"
import clsx from "clsx"

type Variant = "default" | "compact" | "hero"
type HeadingLevel = "h1" | "h2" | "h3"

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  variant?: Variant
  /** Semantic heading element — defaults to h2. Use h1 only for the page hero. */
  as?: HeadingLevel
  /** Index of the word to accent with orange. Defaults to last word (-1). */
  accentIndex?: number
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  variant = "default",
  as: Tag = "h2",
  accentIndex = -1,
}: SectionHeaderProps) {
  const variants = {
    default: {
      container: "max-w-[700px] space-y-4",
      title: "text-3xl md:text-4xl lg:text-5xl",
      desc: "text-sm md:text-base",
    },
    compact: {
      container: "max-w-2xl space-y-4",
      title: "text-3xl md:text-4xl lg:text-5xl",
      desc: "text-sm md:text-base",
    },
    hero: {
      container: "mb-10 md:mb-12 max-w-3xl space-y-5",
      title: "text-4xl md:text-5xl lg:text-6xl",
      desc: "text-base md:text-lg",
    },
  }

  const styles = variants[variant]
  const words = title.split(" ")
  const resolvedAccent = accentIndex < 0 ? words.length + accentIndex : accentIndex

  return (
    <div className={clsx(styles.container)}>

      {/* EYEBROW */}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3"
        >
          <div className="w-6 h-[1.5px] bg-orange-500/70 rounded-full" />

          <p className="
            text-[11px] tracking-[0.18em] font-medium uppercase
            text-muted-foreground
          ">
            {eyebrow}
          </p>
        </motion.div>
      )}

      {/* TITLE */}
      <Tag
        className={clsx(
          "font-semibold tracking-tight leading-[1.08]",
          "text-neutral-900 dark:text-white",
          styles.title
        )}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.35em]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: i * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              className={clsx(
                i === resolvedAccent
                  ? "shimmer-accent"
                  : "text-inherit"
              )}
            >
              {word}
            </span>
          </motion.span>
        ))}
      </Tag>

      {/* DESCRIPTION */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className={clsx(
            "text-muted-foreground leading-[1.6] max-w-xl",
            styles.desc
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
