"use client"

import { useMemo, useState } from "react"
import clsx from "clsx"
import type { ArticleItem } from "@/lib/types/content"
import { TextReveal, Reveal } from "@/components/shared/motion"
import { BlogGrid, FeaturedArticleCard } from "@/components/articles/article-ui"

/**
 * Articles index — typographic header plus working category filters.
 * The featured essay leads when "All writing" is active; filtering swaps
 * the grid in place without a route change.
 */
export function ArticlesIndex({ articles }: { articles: ArticleItem[] }) {
  const [active, setActive] = useState<string | null>(null)

  const categories = useMemo(
    () =>
      Array.from(
        new Set(articles.map((a) => a.category).filter((c): c is string => Boolean(c)))
      ),
    [articles]
  )

  const filtered = active ? articles.filter((a) => a.category === active) : articles
  const featured = active ? null : filtered[0]
  const rest = active ? filtered : filtered.slice(1)

  return (
    <div className="relative min-h-screen bg-background">
      {/* Studio light — same quiet key light the home bands carry */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <div
          className="absolute inset-0 opacity-0 dark:opacity-100"
          style={{ background: "radial-gradient(62% 100% at 50% 0%, rgba(255,255,255,0.045) 0%, transparent 72%)" }}
        />
        <div
          className="absolute -top-44 right-[-10%] h-[520px] w-[700px]"
          style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.05), transparent 72%)" }}
        />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pb-12 pt-32 md:pb-16 md:pt-36">
        <div className="max-w-3xl">
          <TextReveal
            as="h1"
            start="top 95%"
            className="type-hero-internal text-foreground"
          >
            Writing on product systems, UX decisions, and digital craft
          </TextReveal>
          <Reveal as="p" delay={0.15} y={18} start="top 95%" className="mt-6 max-w-2xl text-[16px] leading-8 text-muted-foreground md:text-[18px]">
            Notes, essays, and breakdowns on product systems, constraints, and
            better decision-making.
          </Reveal>
        </div>

        {categories.length > 0 ? (
          <Reveal
            as="div"
            delay={0.25}
            y={14}
            start="top 95%"
            className="mt-9 flex flex-wrap gap-2"
            aria-label="Filter articles by category"
            role="group"
          >
            {[null, ...categories].map((category) => {
              const selected = active === category
              return (
                <button
                  key={category ?? "all"}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(category)}
                  className={clsx(
                    "inline-flex h-8 items-center rounded-full border px-3.5 text-[12px] font-medium transition-colors duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    selected
                      ? "border-accent/60 bg-accent text-white dark:text-neutral-950"
                      : "border-border/60 bg-foreground/[0.03] text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                  )}
                >
                  {category ?? "All writing"}
                </button>
              )
            })}
          </Reveal>
        ) : null}
      </section>

      {featured ? (
        <section className="mx-auto max-w-6xl px-6 pb-14" aria-label="Featured article">
          <Reveal y={30}>
            <FeaturedArticleCard article={featured} />
          </Reveal>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 pb-28" aria-label="All articles">
        <BlogGrid articles={rest} />
      </section>
    </div>
  )
}
