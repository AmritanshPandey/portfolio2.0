"use client"

import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { VerticalCard } from "@/components/shared/vertical-card"
import { workItems } from "@/lib/data"

export function CsNextStudies({ currentHref }: { currentHref: string }) {
  const nextStudies = [...workItems]
    .sort((a, b) => a.order - b.order)
    .filter((item) => item.href !== currentHref)
    .slice(0, 3)

  if (nextStudies.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-[oklch(0.985_0_0)] text-foreground transition-colors duration-500 dark:bg-[oklch(0.105_0_0)]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/[0.05] dark:bg-white/[0.06]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-px h-px bg-white/30 dark:bg-white/[0.02]" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-24">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
          <div className="max-w-2xl">
            <p className="type-meta mb-3">Keep reading</p>
            <h2 className="type-section-title text-foreground">
              More case studies
            </h2>
          </div>

          <Link
            href="/#work"
            className="group inline-flex min-h-11 items-center gap-2 text-[14px] font-medium text-muted-foreground transition-colors duration-500 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            All case studies
            <IconArrowRight
              size={15}
              stroke={2}
              className="transition-transform duration-500 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {nextStudies.map((item, index) => (
            <VerticalCard
              key={item.href}
              href={item.href}
              title={item.title}
              category={item.category}
              metric={item.metric}
              ctaLabel="View case study"
              index={index + 1}
              showImage={false}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
