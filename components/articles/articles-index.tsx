"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { ArticleItem } from "@/lib/types/content"

/**
 * Essays index: a ruled register. Category filters are mono text buttons; each
 * essay is a line item with its reference, category, read time and date, then
 * the title and its one-line description. The lead essay keeps its mark when
 * nothing is filtered. Filtering swaps the list in place, no route change.
 */
export function ArticlesIndex({ articles }: { articles: ArticleItem[] }) {
  const [active, setActive] = useState<string | null>(null)

  const categories = useMemo(
    () => Array.from(new Set(articles.map((a) => a.category).filter((c): c is string => Boolean(c)))),
    [articles]
  )

  const filtered = active ? articles.filter((a) => a.category === active) : articles

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <section className="ledger" style={{ paddingTop: "calc(var(--nav-h) + clamp(40px, 6vw, 104px))" }}>
        <div aria-hidden data-hero-rule className="rule-ink" />
        <div className="ledger-grid mt-6 gap-y-6 md:mt-10">
          <h1 data-hero-line="1" className="type-hero-internal col-span-12 max-w-[16ch] lg:col-span-9">
            Writing on product systems, UX decisions, and digital craft
          </h1>
          <p data-hero-fade className="type-section-intro col-span-12 text-muted-foreground md:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end">
            Notes, essays, and breakdowns on product systems, constraints, and
            better decision-making.
          </p>
        </div>

        {categories.length > 0 ? (
          <div
            data-hero-fade
            role="group"
            aria-label="Filter articles by category"
            className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 md:mt-20"
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
                    "ledger-label relative pb-1 transition-colors duration-200",
                    selected ? "text-foreground" : "hover:text-foreground",
                  )}
                >
                  {category ?? "All writing"}
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute inset-x-0 -bottom-px h-[2px] origin-left bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      selected ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              )
            })}
          </div>
        ) : null}
      </section>

      <section className="ledger pb-28 pt-10 md:pt-14" aria-label="All articles">
        <div className="work-index">
          {filtered.map((article, i) => {
            const lead = !active && i === 0
            const meta = [article.category, article.readTime, article.date].filter(Boolean).join(" · ")
            return (
              <Link
                key={article.href}
                href={article.href}
                data-cursor-card
                data-cursor-label="Read"
                className="work-row group ledger-grid gap-y-3 border-t border-border py-7 last:border-b md:py-10"
              >
                <p className="ledger-label col-span-12 flex flex-wrap gap-x-4 md:col-span-3">
                  <span className="text-foreground transition-colors duration-300 group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {lead && <span className="text-accent">Featured</span>}
                  <span className="basis-full md:mt-1">{meta}</span>
                </p>
                <div className="col-span-11 min-w-0 md:col-span-7">
                  <h2
                    className={clsx(
                      "font-[760] leading-[1.02] tracking-[-0.03em] text-foreground [font-variation-settings:'wdth'_108] text-balance",
                      lead ? "text-[clamp(1.875rem,4vw,3.75rem)]" : "text-[clamp(1.375rem,2.4vw,2.25rem)]",
                    )}
                  >
                    {article.title}
                  </h2>
                  <p className="mt-3 max-w-[56ch] text-[15px] leading-[1.55] text-muted-foreground md:text-base">
                    {article.description}
                  </p>
                </div>
                <IconArrowUpRight
                  size={22}
                  stroke={1.75}
                  aria-hidden
                  className="col-span-1 justify-self-end text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1 md:col-start-12"
                />
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
