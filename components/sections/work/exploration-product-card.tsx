"use client"

import { useRef } from "react"
import Link from "next/link"
import { useReducedMotion } from "framer-motion"
import { IconArrowUpRight } from "@tabler/icons-react"

export type ExplorationCardData = {
  href: string
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
  tags: string[]
}

export function ExplorationProductCard({ card }: { card: ExplorationCardData }) {
  // Cursor-following spotlight — mirrors VerticalCard: CSS vars updated directly
  // on the element (no re-render), rAF-throttled, disabled for reduced motion.
  const prefersReduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = cardRef.current
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
    const el = cardRef.current
    if (!el) return
    el.style.setProperty("--mx", "50%")
    el.style.setProperty("--my", "0%")
  }

  return (
    <Link
      href={card.href}
      data-cursor-card
      data-cursor-label="View"
      onPointerMove={prefersReduced ? undefined : handlePointerMove}
      onPointerLeave={prefersReduced ? undefined : resetSpotlight}
      className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div
        ref={cardRef}
        className="relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-2xl border border-border/65 bg-card p-6 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-foreground/20 hover:bg-foreground/[0.015] active:translate-y-0 active:scale-[0.994] active:duration-150 dark:hover:border-white/20 dark:hover:bg-white/[0.025] md:p-7"
      >
        {/* Amber spotlight — follows the cursor on hover (rests top-center). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{ background: "radial-gradient(300px 220px at var(--mx, 50%) var(--my, 0%), rgba(244,63,94,0.09), transparent 70%)" }}
        />

        <div className="relative flex flex-1 flex-col">
          <p className="type-meta">{card.eyebrow}</p>

          <h3 className="mt-3 type-card-title text-foreground">
            {card.title}
          </h3>

          <p className="mt-4 type-card-body text-foreground/58">
            {card.description}
          </p>

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

          <div className="mt-auto pt-7">
            <div className="flex items-center justify-between border-t border-border/45 pt-6">
              <span className="type-cta text-foreground/50 transition-colors duration-500 group-hover/card:text-foreground/82">
                {card.ctaLabel}
              </span>
              <IconArrowUpRight
                size={15}
                stroke={2}
                className="text-foreground/32 transition-all duration-500 group-hover/card:text-foreground/80 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px]"
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
