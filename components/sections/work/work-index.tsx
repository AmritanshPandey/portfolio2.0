import Link from "next/link"
import { ViewTransition } from "react"
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
 * study, each with a reference, its client, the role held, a drawn specimen
 * of the mechanism it shipped, and the problem and outcome as two entries.
 * Hovering a line runs the specimen and lets the other lines recede. Rows
 * settle in one by one as they scroll into view.
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
            {/* Specimen: a drawn picture of the mechanism, not a stock image.
                Named for the study's hero, so opening the study grows this
                specimen into its opening visual (CsHeroShell transitionName). */}
            <div className="col-span-12 md:col-span-5">
              <ViewTransition name={`case-${slugOf(item.href)}`} share="case-morph">
                <WorkSpecimen slug={slugOf(item.href)} />
              </ViewTransition>
            </div>

            {/* Entered like a line of the account: the reference hangs in the
                margin, the title and everything under it share one edge. */}
            <div className="col-span-12 grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 self-start md:col-span-7 md:grid-cols-[3rem_minmax(0,1fr)_auto] lg:pl-[calc(var(--col-gap)*1)]">
              <span className="ledger-label text-foreground transition-colors duration-300 group-hover:text-accent">{ref}</span>

              <h3 className="max-w-[22ch] text-[clamp(1.625rem,3vw,3.25rem)] font-[780] leading-[1] tracking-[-0.035em] text-foreground [font-variation-settings:'wdth'_108] text-balance">
                {item.title}
              </h3>

              <IconArrowUpRight
                size={22}
                stroke={1.75}
                aria-hidden
                className="self-start text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              />

              <p className="col-span-2 col-start-2 mt-3 text-[15px] leading-[1.4] text-muted-foreground md:text-base">
                {item.byline ?? [item.role, category.client].filter(Boolean).join(" at ")}
              </p>

              {/* Problem and outcome, entered like two lines of the account.
                  Phones give them the full width back. */}
              <dl className="col-span-3 mt-6 md:col-span-2 md:col-start-2 grid max-w-[64ch] grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-[15px] leading-[1.5] md:text-base">
                <dt className="ledger-label pt-[0.2em]">Problem</dt>
                <dd className="text-muted-foreground">{item.description}</dd>
                {item.metric && (
                  <>
                    <dt className="ledger-label pt-[0.2em]"><span className="text-accent">Outcome</span></dt>
                    <dd className="text-foreground tabular-nums">{item.metric}</dd>
                  </>
                )}
              </dl>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
