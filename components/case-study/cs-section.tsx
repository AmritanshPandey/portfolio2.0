"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import type { ReactNode } from "react"

type Variant = "default" | "muted" | "dark"

interface Props {
  /** Kept for call-site compatibility; section headings are rendered by each page. */
  label?: string
  children: ReactNode
  variant?: Variant
  /** Deprecated — section separation now comes from the single edge line. */
  withDivider?: boolean
  /** Anchor target for in-page links. */
  id?: string
}

const BG: Record<Variant, string> = {
  default: "bg-[oklch(0.98_0_0)] dark:bg-[oklch(0.14_0_0)] text-foreground",
  muted:   "bg-[oklch(0.965_0_0)] dark:bg-[oklch(0.105_0_0)] text-foreground",
  // "dark" is a contrast/accent band: a deeper neutral in light mode, near-black in dark mode.
  dark:    "bg-[oklch(0.925_0_0)] dark:bg-[oklch(0.12_0_0)] text-foreground",
}

const EDGE_LINE = "bg-border/70 dark:bg-white/[0.08]"
const EDGE_HIGHLIGHT = "bg-white/70 dark:bg-white/[0.03]"

export function CsSection({ children, variant = "default", id }: Props) {
  return (
    <section id={id} className={clsx("relative w-full overflow-hidden transition-colors duration-300", id && "scroll-mt-24", BG[variant])}>

      <div aria-hidden className={clsx("pointer-events-none absolute inset-x-0 top-0 h-px", EDGE_LINE)} />
      <div aria-hidden className={clsx("pointer-events-none absolute inset-x-0 top-px h-px", EDGE_HIGHLIGHT)} />

      <div className="relative max-w-[820px] mx-auto px-6 py-20 md:py-24">

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

      <div className={clsx("absolute bottom-0 left-0 h-px w-full", EDGE_LINE)} />
    </section>
  )
}
