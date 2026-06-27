"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useReducedMotion } from "framer-motion"
import { IconArrowUpRight } from "@tabler/icons-react"

export type ExplorationCardData = {
  href: string
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  tags: string[]
  image: string
  status?: "Concept" | "In Development" | "Live"
  learned?: string
}

const STATUS_CONFIG = {
  "Live":           { dot: "bg-emerald-400", pulse: true,  label: "Live" },
  "In Development": { dot: "bg-sky-400",     pulse: true,  label: "In Dev" },
  "Concept":        { dot: "bg-amber-400",   pulse: false, label: "Concept" },
}

export function ExplorationProductCard({ card }: { card: ExplorationCardData }) {
  // Spotlight follows the cursor on the content pane only.
  // CSS vars updated via rAF — no re-renders, disabled for reduced motion.
  const prefersReduced = useReducedMotion()
  const contentRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = contentRef.current
    if (!el || rafRef.current) return
    const { clientX, clientY } = e
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const r = el.getBoundingClientRect()
      el.style.setProperty("--mx", `${((clientX - r.left) / r.width) * 100}%`)
      el.style.setProperty("--my", `${((clientY - r.top) / r.height) * 100}%`)
    })
  }

  const resetSpotlight = () => {
    contentRef.current?.style.setProperty("--mx", "50%")
    contentRef.current?.style.setProperty("--my", "0%")
  }

  const statusCfg = card.status ? STATUS_CONFIG[card.status] : null

  return (
    <Link
      href={card.href}
      data-cursor-card
      data-cursor-label="View"
      onPointerMove={prefersReduced ? undefined : handlePointerMove}
      onPointerLeave={prefersReduced ? undefined : resetSpotlight}
      className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex flex-col overflow-hidden rounded-2xl border border-border/65 bg-card [transform:translateZ(0)] transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:border-foreground/18 lg:flex-row dark:hover:border-white/[0.18]">

        {/* ── Image pane ── */}
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-[21/10] lg:aspect-auto lg:w-[42%]">
          <Image
            src={card.image}
            alt={card.title}
            fill
            sizes="(max-width: 1023px) 100vw, 42vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
          />
          {/* Gradient fade into card bg on mobile (content follows below) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card/70 to-transparent lg:hidden"
          />
        </div>

        {/* ── Content pane ── */}
        <div ref={contentRef} className="relative flex min-w-0 flex-1 flex-col p-5 sm:p-6 lg:p-7">

          {/* Emerald cursor spotlight — scoped to content half */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{ background: "radial-gradient(320px 240px at var(--mx, 50%) var(--my, 0%), rgba(16,185,129,0.09), transparent 70%)" }}
          />

          <div className="relative flex flex-1 flex-col">

            {/* Eyebrow + status badge */}
            <div className="flex items-center justify-between gap-3">
              <p className="type-meta">{card.eyebrow}</p>
              {statusCfg && (
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/40 bg-muted/40 px-2.5 py-1 text-[10px] font-medium leading-none text-foreground/55">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}${statusCfg.pulse ? " animate-pulse" : ""}`}
                  />
                  {statusCfg.label}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="mt-3 text-[clamp(1.1rem,2vw,1.35rem)] font-bold leading-[1.18] tracking-[-0.02em] text-foreground">
              {card.title}
            </h3>

            {/* Description */}
            <p className="mt-3 max-w-[64ch] text-[13.5px] leading-relaxed text-foreground/60 lg:max-w-none">
              {card.description}
            </p>

            {/* Learned insight — pull-quote style, only for explorations */}
            {card.learned && (
              <p className="mt-4 max-w-[68ch] border-l-[2px] border-accent/30 pl-3.5 text-[12.5px] italic leading-relaxed text-foreground/45 lg:max-w-none">
                {card.learned}
              </p>
            )}

            {/* Tags */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/35 bg-muted/25 px-2 py-0.5 text-[10px] font-medium leading-[1.45] text-foreground/42"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-auto pt-7">
              <div className="flex items-center justify-between border-t border-border/40 pt-5">
                <span className="type-cta text-foreground/50 transition-colors duration-500 group-hover/card:text-foreground/82">
                  {card.ctaLabel}
                </span>
                <IconArrowUpRight
                  size={15}
                  stroke={2}
                  className="text-foreground/32 transition-all duration-500 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px] group-hover/card:text-foreground/80"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </Link>
  )
}
