"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import {
  IconPencil,
  IconDevices,
  IconFocusCentered,
  IconBuilding,
  IconClockHour4,
  IconUsersGroup,
  IconBriefcase,
  IconCalendarEvent,
  IconLayersSubtract,
  IconClock,
  IconCalendar,
  IconCode,
} from "@tabler/icons-react"
import { ReadingProgress } from "@/components/shared/reading-progress"
import { entrance } from "@/lib/motion"
import type { ComponentType, CSSProperties, ReactNode } from "react"

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Breadcrumb {
  kind: string
  category: string
  client?: string
}

export interface CsHeroShellProps {
  // Navigation context (backwards-compat)
  breadcrumb: Breadcrumb
  // Copy
  title: ReactNode
  lede: ReactNode
  badge?: ReactNode
  // Accent-colored descriptor tags above the title (replaces breadcrumb visually when set)
  keywords?: string[]
  // Meta fields rendered as icon cards — max 4 looks best
  meta?: Record<string, string>
  // Footer bar
  readTime?: string
  publishedDate?: string
  topics?: string[]
  // Visual slot — untouched
  aside?: ReactNode
  asideLabel?: string
  asideCol?: string
  // Extra content (backwards-compat — renders below meta)
  children?: ReactNode
  className?: string
}

// ─── ICON MAP ────────────────────────────────────────────────────────────────

type TablerIcon = ComponentType<{ size?: number; stroke?: number; className?: string }>

const META_ICONS: Record<string, TablerIcon> = {
  role:          IconPencil,
  platform:      IconDevices,
  scope:         IconFocusCentered,
  organisation:  IconBuilding,
  organization:  IconBuilding,
  duration:      IconClockHour4,
  team:          IconUsersGroup,
  industry:      IconBriefcase,
  year:          IconCalendarEvent,
  brandsUnified: IconLayersSubtract,
  stack:         IconCode,
}

const META_LABELS: Record<string, string> = {
  role:          "Role",
  duration:      "Duration",
  platform:      "Platform",
  team:          "Team",
  brandsUnified: "Brands Unified",
  organisation:  "Organisation",
  organization:  "Organization",
  scope:         "Scope",
  industry:      "Industry",
  year:          "Year",
  stack:         "Stack",
}

function toLabel(key: string): string {
  return META_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
}

function MetaCard({ metaKey, value }: { metaKey: string; value: string }) {
  const Icon = META_ICONS[metaKey] ?? IconBriefcase
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/50 bg-foreground/[0.02] p-3.5 dark:bg-white/[0.025]">
      <Icon size={16} stroke={1.75} className="text-accent/75" />
      <div>
        <p className="mb-1 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">
          {toLabel(metaKey)}
        </p>
        <p className="text-[13px] font-medium leading-snug text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

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
  keywords,
  meta,
  readTime,
  publishedDate,
  topics,
}: CsHeroShellProps) {
  const hasAside   = Boolean(aside)
  const metaEntries = meta ? Object.entries(meta).filter(([, v]) => Boolean(v)) : []
  const hasMeta    = metaEntries.length > 0
  const hasFooter  = Boolean(readTime || publishedDate || (topics && topics.length > 0))

  return (
    <div className={clsx("bg-canvas-raised relative overflow-hidden", className)}>

      <ReadingProgress />

      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(820px_460px_at_16%_-12%,rgba(16,185,129,0.07),transparent_62%)] dark:bg-[radial-gradient(820px_460px_at_16%_-12%,rgba(16,185,129,0.11),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(620px_400px_at_100%_-6%,rgba(16,185,129,0.04),transparent_60%)] dark:bg-[radial-gradient(620px_400px_at_100%_-6%,rgba(16,185,129,0.07),transparent_60%)]" />
      </div>

      <div
        data-cs-hero-inner
        className="relative max-w-[1000px] mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <div
          data-cs-hero-grid
          className={clsx(
            hasAside
              ? "grid lg:grid-cols-[1fr_var(--cs-aside)] gap-12 lg:gap-16 items-start"
              : "block"
          )}
          style={hasAside ? ({ "--cs-aside": asideCol } as CSSProperties) : undefined}
        >

          {/* ── LEFT: copy ── */}
          <div className="min-w-0">

            {/* Keywords (accent tags) — or fallback to breadcrumb nav */}
            {keywords && keywords.length > 0 ? (
              <motion.p
                {...entrance(0)}
                className="mb-6 font-mono text-[10.5px] font-semibold tracking-[0.1em] uppercase text-accent"
              >
                {keywords.join(" · ")}
              </motion.p>
            ) : (
              <motion.nav
                {...entrance(0)}
                className="mb-7 flex flex-wrap items-center gap-3 font-mono text-[10.5px] font-semibold tracking-[0.1em] uppercase text-muted-foreground"
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
            )}

            {/* Badge pill */}
            {badge && (
              <motion.span
                {...entrance(1)}
                className="mb-5 inline-block rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                {badge}
              </motion.span>
            )}

            {/* Title */}
            <motion.h1
              data-cs-hero-title
              {...entrance(2)}
              className={clsx(
                "type-hero-internal mb-5 text-neutral-900 dark:text-white",
                hasAside ? "max-w-xl" : "max-w-3xl"
              )}
            >
              {title}
            </motion.h1>

            {/* Lede */}
            <motion.div
              data-cs-hero-lede
              {...entrance(3)}
              className={clsx(
                "text-[16px] leading-[1.7] text-foreground/65",
                hasAside ? "max-w-xl" : "max-w-[54ch]"
              )}
            >
              {lede}
            </motion.div>

            {/* Meta icon cards */}
            {hasMeta && (
              <motion.div
                {...entrance(4)}
                className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
              >
                {metaEntries.map(([key, value]) => (
                  <MetaCard key={key} metaKey={key} value={value} />
                ))}
              </motion.div>
            )}

            {/* Extra children (backwards-compat) */}
            {children && (
              <motion.div
                {...entrance(5)}
                className="mt-8"
              >
                {children}
              </motion.div>
            )}

            {/* Footer: read time · published date · topic tags */}
            {hasFooter && (
              <motion.div
                {...entrance(6)}
                className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-5 text-[12px] text-muted-foreground"
              >
                {readTime && (
                  <span className="flex items-center gap-1.5">
                    <IconClock size={13} stroke={1.75} />
                    {readTime}
                  </span>
                )}
                {readTime && (publishedDate || (topics && topics.length > 0)) && (
                  <div aria-hidden className="h-3 w-px bg-border/70" />
                )}
                {publishedDate && (
                  <span className="flex items-center gap-1.5">
                    <IconCalendar size={13} stroke={1.75} />
                    Published: {publishedDate}
                  </span>
                )}
                {publishedDate && topics && topics.length > 0 && (
                  <div aria-hidden className="h-3 w-px bg-border/70" />
                )}
                {topics && topics.length > 0 && (
                  <span>{topics.join(" · ")}</span>
                )}
              </motion.div>
            )}

          </div>

          {/* ── RIGHT: bespoke visual — untouched ── */}
          {hasAside && (
            <motion.div
              data-cs-hero-aside
              {...entrance(2)}
              className="min-w-0"
            >
              {asideLabel && (
                <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {asideLabel}
                </p>
              )}
              {aside}
            </motion.div>
          )}

        </div>
      </div>

      {/* Bottom separator */}
      <div aria-hidden className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
    </div>
  )
}
