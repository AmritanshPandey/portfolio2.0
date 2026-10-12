import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { WorkItem } from "@/lib/types/content"
import { WorkSpecimen } from "./work-specimens"

function splitCategory(category: string) {
  const [type, client] = category.split("/").map((part) => part.trim())
  return { type, client: client ?? "Portfolio" }
}

function slugOf(href: string) {
  return href.split("/").filter(Boolean).pop() ?? ""
}

/**
 * The work, set as a statement of account: one ruled line item per case
 * study, each with a reference, its client, and a drawn specimen of the
 * mechanism it shipped. Hovering a line runs the specimen and lets the other
 * lines recede. Rows settle in one by one as they scroll into view.
 */
export function WorkIndex({ items }: { items: WorkItem[] }) {
  return (
    <div className="work-index relative">
      {items.map((item, i) => {
        const category = splitCategory(item.category)
        const ref = String(i + 1).padStart(2, "0")

        return (
          <Link
            key={item.href}
            href={item.href}
            data-settle
            data-cursor-card
            data-cursor-label="Open"
            style={{ ["--i" as string]: i }}
            className={clsx(
              "work-row group ledger-grid gap-y-6 border-t border-border py-8 md:py-12",
              i === items.length - 1 && "border-b",
            )}
          >
            {/* Specimen: a drawn picture of the mechanism, not a stock image. */}
            <div className="col-span-12 md:col-span-5 lg:col-span-4">
              <WorkSpecimen slug={slugOf(item.href)} />
            </div>

            <div className="col-span-12 flex min-w-0 flex-col md:col-span-7 lg:col-span-8 lg:pl-[calc(var(--col-gap)*1)]">
              <div className="flex items-baseline justify-between gap-4">
                <p className="ledger-label flex items-baseline gap-4">
                  <span className="text-foreground transition-colors duration-300 group-hover:text-accent">{ref}</span>
                  <span>{category.client}</span>
                  <span className="hidden sm:inline">{category.type}</span>
                </p>
                <IconArrowUpRight
                  size={22}
                  stroke={1.75}
                  aria-hidden
                  className="shrink-0 text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>

              <h3 className="mt-4 max-w-[22ch] text-[clamp(1.625rem,3vw,3.25rem)] font-[780] leading-[1] tracking-[-0.035em] text-foreground [font-variation-settings:'wdth'_108] text-balance">
                {item.title}
              </h3>

              <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.55] text-muted-foreground md:text-base">
                {item.description}
              </p>

              {item.metric && (
                <p className="ledger-label mt-auto pt-6 text-foreground/80">→ {item.metric}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
