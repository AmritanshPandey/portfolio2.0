import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { ArticleItem } from "@/lib/types/content"

/**
 * Reading list — the quieter sibling of the work index. Same editorial
 * row grammar (hairlines, recede-on-hover), smaller voice. Pointing at an
 * essay (or reaching it by keyboard) opens its row to the one-line summary,
 * so a scanner can tell the essays apart without leaving the page; touch
 * screens, which can't hover, show the summary throughout.
 */
export function InsightsList({ items }: { items: ArticleItem[] }) {
  return (
    <div className="work-index">
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          data-settle
          data-cursor-card
          data-cursor-label="Read"
          style={{ ["--i" as string]: i }}
          className={clsx(
            "work-row group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-5 border-t border-border py-5 md:py-7",
            "md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)_auto] md:gap-x-[var(--col-gap)]",
            i === items.length - 1 && "border-b",
            "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          )}
        >
          <p className="ledger-label order-2 col-span-2 mt-2 md:order-none md:col-span-1 md:mt-0">
            {item.category}
            {item.readTime ? <span className="text-muted-foreground"> · {item.readTime}</span> : null}
          </p>

          <div className="order-1 min-w-0 md:order-none">
            <h3
              className={clsx(
                "text-[clamp(1.25rem,2.2vw,2rem)] font-[720] leading-[1.08] tracking-[-0.025em] text-foreground [font-variation-settings:'wdth'_106]",
                "transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] md:group-hover:translate-x-2"
              )}
            >
              {item.title}
            </h3>
            {item.description && (
              <div className="insight-more">
                <div>
                  <p className="max-w-[58ch] pt-3 text-[15px] leading-[1.55] text-muted-foreground text-pretty md:translate-x-2 md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <span className="order-1 md:order-none relative grid shrink-0 place-items-center overflow-hidden">
            <IconArrowUpRight
              size={17}
              stroke={2}
              className="col-start-1 row-start-1 text-foreground/30 transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[160%] group-hover:-translate-y-[160%]"
            />
            <IconArrowUpRight
              size={17}
              stroke={2}
              aria-hidden
              className="col-start-1 row-start-1 -translate-x-[160%] translate-y-[160%] text-accent transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0"
            />
          </span>
        </Link>
      ))}
    </div>
  )
}
