"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import type { ReactNode } from "react"

type Variant = "default" | "muted" | "dark"

interface Props {
  label: string
  children: ReactNode
  variant?: Variant
  withDivider?: boolean
}

const BG: Record<Variant, string> = {
  default: "bg-[oklch(0.985_0_0)] dark:bg-[oklch(0.14_0_0)] text-foreground",
  muted:   "bg-[oklch(0.965_0.003_85)] dark:bg-[oklch(0.16_0.002_260)] text-foreground",
  dark:    "bg-neutral-950 text-white",
}

const DIVIDER: Record<Variant, string> = {
  default: "bg-border/60",
  muted:   "bg-border/60",
  dark:    "bg-white/[0.08]",
}

export function CsSection({ label, children, variant = "default", withDivider = true }: Props) {
  const isDark = variant === "dark"

  return (
    <section className={clsx("relative w-full overflow-hidden transition-colors duration-300", BG[variant])}>

      {/* Ambient — light/dark only */}
      {!isDark && (
        <div className="pointer-events-none absolute inset-0">
          <div className="
            absolute inset-0
            bg-[radial-gradient(900px_400px_at_20%_0%,rgba(249,115,22,0.04),transparent_60%)]
            opacity-70 dark:hidden
          " />
          <div className="
            hidden dark:block absolute inset-0
            bg-[radial-gradient(900px_400px_at_20%_0%,rgba(249,115,22,0.07),transparent_60%)]
          " />
        </div>
      )}

      <div className="relative max-w-[1000px] mx-auto px-6 py-20 md:py-24">

        {/* Top divider */}
        {withDivider && (
          <div className={clsx("h-px w-full mb-16", DIVIDER[variant])} />
        )}

        <div className="grid md:grid-cols-[180px_1fr] gap-10 md:gap-16 items-start">

          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={clsx(
              "text-[11px] font-semibold uppercase tracking-[0.18em] pt-0.5 shrink-0",
              isDark ? "text-neutral-500" : "text-muted-foreground"
            )}
          >
            {label}
          </motion.p>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            {children}
          </motion.div>

        </div>
      </div>

      {/* Bottom separator */}
      {!isDark && (
        <div className="
          absolute bottom-0 left-0 w-full h-px
          bg-gradient-to-r from-transparent via-foreground/10 to-transparent
          dark:via-white/10
        " />
      )}
    </section>
  )
}
