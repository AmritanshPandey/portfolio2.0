"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import type { CSSProperties, ReactNode } from "react"

interface Breadcrumb {
  /** e.g. "Case Study" */
  kind: string
  /** Accent segment, e.g. "Enterprise Systems" */
  category: string
  /** e.g. "Mastercard · PartnerBank" */
  client?: string
}

interface Props {
  breadcrumb: Breadcrumb
  title: ReactNode
  lede: ReactNode
  /** Small pill above the title, e.g. "Flagship · Ongoing". */
  badge?: ReactNode
  /** Bespoke signature visual rendered in the right column. */
  aside?: ReactNode
  /** Optional caption shown above the aside. */
  asideLabel?: string
  /** Width of the aside column at lg+. Defaults to 360px. */
  asideCol?: string
  /** Extra content under the lede (pills, "presented at", etc.). */
  children?: ReactNode
  className?: string
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Standardised case-study hero shell: shared chrome (ambient glow, breadcrumb,
 * title, lede, separator, spacing) with a slot for each study's signature visual.
 */
export function CsHeroShell({
  breadcrumb,
  title,
  lede,
  badge,
  aside,
  asideLabel,
  asideCol = "360px",
  children,
  className,
}: Props) {
  const hasAside = Boolean(aside)

  return (
    <div className={clsx("relative overflow-hidden bg-[oklch(0.985_0_0)] dark:bg-[oklch(0.14_0_0)]", className)}>

      {/* Ambient glow — two soft accent layers for depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(820px_460px_at_16%_-12%,rgba(249,115,22,0.07),transparent_62%)] dark:bg-[radial-gradient(820px_460px_at_16%_-12%,rgba(249,115,22,0.11),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(620px_400px_at_100%_-6%,rgba(249,115,22,0.04),transparent_60%)] dark:bg-[radial-gradient(620px_400px_at_100%_-6%,rgba(249,115,22,0.07),transparent_60%)]" />
      </div>

      <div className="relative max-w-[1000px] mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-20">

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex flex-wrap items-center gap-3 mb-9 text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground"
        >
          <span>{breadcrumb.kind}</span>
          <span className="h-1 w-1 rounded-full bg-accent/60" />
          <span className="text-accent">{breadcrumb.category}</span>
          {breadcrumb.client && (
            <>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{breadcrumb.client}</span>
            </>
          )}
        </motion.nav>

        <div
          className={clsx(
            hasAside
              ? "grid lg:grid-cols-[1fr_var(--cs-aside)] gap-12 lg:gap-16 items-start"
              : "block"
          )}
          style={hasAside ? ({ "--cs-aside": asideCol } as CSSProperties) : undefined}
        >
          {/* Left column — copy */}
          <div className="min-w-0">
            {badge && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.04 }}
                className="inline-block mb-6 text-[10px] uppercase tracking-[0.16em] text-muted-foreground border border-border rounded px-2.5 py-1"
              >
                {badge}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
              className={clsx(
                "type-page-title text-neutral-900 dark:text-white mb-6",
                hasAside ? "max-w-xl" : "max-w-3xl"
              )}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
              className={clsx(
                "text-[17px] leading-relaxed text-muted-foreground",
                hasAside ? "max-w-xl" : "max-w-[52ch]"
              )}
            >
              {lede}
            </motion.p>

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2, ease: EASE }}
                className="mt-8"
              >
                {children}
              </motion.div>
            )}
          </div>

          {/* Right column — bespoke visual */}
          {hasAside && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
              className="min-w-0"
            >
              {asideLabel && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  {asideLabel}
                </p>
              )}
              {aside}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom separator */}
      <div aria-hidden className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
