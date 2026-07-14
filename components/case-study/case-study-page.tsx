"use client"

import { Fragment, useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { EASE, DURATION, RISE } from "@/lib/motion"

/**
 * The shared, document-style case-study scaffold. A sticky left table-of-contents
 * (scroll-spy active state + back link) sits beside a single reading column:
 * brand header → serif title → meta bar → sections.
 *
 * A single `sections` array drives BOTH the TOC and the rendered content, so they
 * can never drift out of sync. Each section renders an accent eyebrow (its label)
 * above arbitrary `content`. Canonical order the studies follow:
 *
 *   Overview → The problem → Research → Design goal → Design exploration →
 *   Final solution → Impact & takeaways → Reflection
 *
 * @example
 * <CaseStudyPage
 *   brand={{ name: "Marketeq", logo: <Logo /> }}
 *   title="Dual-currency wallet for B2B consulting teams"
 *   meta={[
 *     { label: "Project type", value: "B2B, IT Consulting" },
 *     { label: "My role", value: "UX Research & Design" },
 *   ]}
 *   sections={[
 *     { id: "overview", label: "Overview", content: <p>…</p> },
 *     { id: "problem", label: "The Problem", content: <p>…</p> },
 *   ]}
 * />
 */

export interface CaseStudyMeta {
  label: string
  value: ReactNode
}

export interface CaseStudySection {
  /** Anchor id — used by the TOC link and scroll-spy. */
  id: string
  /** Shown in the TOC and as the section's accent eyebrow. */
  label: string
  content: ReactNode
}

export interface CaseStudyPageProps {
  /** Optional brand lockup above the title. */
  brand?: { name: string; logo?: ReactNode }
  title: ReactNode
  /** Meta cells shown as a row beneath the title (e.g. project type, team, role, timeline). */
  meta?: CaseStudyMeta[]
  /** Drives both the TOC and the content body. */
  sections: CaseStudySection[]
  /** Back-link target + label shown under the TOC. */
  backHref?: string
  backLabel?: string
  className?: string
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0])

  useEffect(() => {
    if (ids.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      // Trip the active state as a section crosses the upper third of the viewport.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return active
}

export function CaseStudyPage({
  brand,
  title,
  meta,
  sections,
  backHref = "/#work",
  backLabel = "Back to Home",
  className,
}: CaseStudyPageProps) {
  const ids = sections.map((s) => s.id)
  const active = useActiveSection(ids)

  return (
    <div className={cn("min-h-screen", className)}>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pt-28 pb-28 lg:grid-cols-[176px_1fr] lg:gap-16">
        {/* ── Table of contents ─────────────────────── */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28 flex flex-col gap-1" aria-label="Sections">
            {sections.map((s) => {
              const selected = s.id === active
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={selected ? "true" : undefined}
                  className={cn(
                    "border-l-2 py-1 pl-3 text-[13px] transition-colors",
                    selected
                      ? "border-foreground font-medium text-foreground"
                      : "border-transparent text-muted-foreground/70 hover:text-foreground"
                  )}
                >
                  {s.label}
                </a>
              )
            })}

            <Link
              href={backHref}
              className="mt-5 inline-flex items-center gap-2 pl-3 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconArrowLeft size={15} stroke={2} />
              {backLabel}
            </Link>
          </nav>
        </aside>

        {/* ── Reading column ────────────────────────── */}
        <div className="min-w-0">
          {brand && (
            <motion.div
              initial={{ opacity: 0, y: RISE }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE }}
              className="mb-5"
            >
              <div className="flex items-center gap-2.5 text-accent">
                {brand.logo}
                <span className="text-[17px] font-semibold tracking-tight text-foreground">{brand.name}</span>
              </div>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: RISE }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, delay: 0.05, ease: EASE }}
            className="font-serif text-[clamp(26px,3.6vw,40px)] font-normal italic leading-[1.15] tracking-tight text-foreground"
          >
            {title}
          </motion.h1>

          {meta && meta.length > 0 && (
            <motion.dl
              initial={{ opacity: 0, y: RISE }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, delay: 0.1, ease: EASE }}
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4"
            >
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                    {m.label}
                  </dt>
                  <dd className="text-[13.5px] leading-snug text-foreground">{m.value}</dd>
                </div>
              ))}
            </motion.dl>
          )}

          <div aria-hidden className="mt-10 h-px w-full bg-border" />

          <div className="mt-12 flex flex-col gap-14">
            {sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                className="scroll-mt-28"
                initial={{ opacity: 0, y: RISE }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: DURATION.base, delay: (i % 2) * 0.05, ease: EASE }}
              >
                <div>
                  <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                    {s.label}
                  </p>
                  <Fragment key={`${s.id}-content`}>{s.content}</Fragment>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
