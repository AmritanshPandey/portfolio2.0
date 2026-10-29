import Link from "next/link"
import clsx from "clsx"
import type { ReactNode } from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

import { explorationItems, systemItems } from "@/lib/data"
import { FintechSystemSpecimen, PlanRSpecimen } from "./exploration-specimens"

/**
 * Explorations: two self-directed projects, set as ruled line items like the
 * work above them: a drawn specimen of the project on the left, and on the
 * right its status, title and what it was for, entered like lines of the
 * account. Hovering a line lets the other recede (the work index's own rule,
 * via .work-index / .work-row).
 *
 * This used to be two staggered cards, and before that a carousel; as rows it
 * reads as the same ledger as the work, one tier down.
 */

type Row = {
  href: string
  status: string
  title: string
  entries: { term: string; text: string }[]
  specimen: ReactNode
}

export default function ExplorationsSection() {
  const planr = explorationItems[0]
  const system = systemItems[0]

  const rows: Row[] = [
    {
      href: planr.href,
      status: planr.status ?? "Exploration",
      title: planr.title,
      entries: [
        planr.question && { term: "Question", text: planr.question },
        planr.built && { term: "Built", text: planr.built },
        planr.learned && { term: "Learned", text: planr.learned },
      ].filter(Boolean) as Row["entries"],
      specimen: <PlanRSpecimen />,
    },
    {
      href: system.href,
      status: system.category,
      title: system.title,
      entries: [
        { term: "What", text: system.description },
        ...(system.stats?.length
          ? [{ term: "Scope", text: system.stats.map((s) => `${s.value} ${s.label}`).join(" · ") }]
          : []),
      ],
      specimen: <FintechSystemSpecimen />,
    },
  ]

  return (
    <div data-cursor-zone="exploration" className="work-index relative">
      {rows.map((row, i) => (
        <Link
          key={row.href}
          href={row.href}
          data-settle
          data-cursor-card
          data-cursor-label="Open"
          style={{ ["--i" as string]: i }}
          className={clsx(
            "work-row group ledger-grid gap-y-6 border-t border-border py-8 md:py-12",
            i === rows.length - 1 && "border-b",
          )}
        >
          <div className="col-span-12 md:col-span-5">{row.specimen}</div>

          <div className="col-span-12 flex min-w-0 flex-col md:col-span-7 lg:pl-[calc(var(--col-gap)*1)]">
            <div className="flex items-baseline justify-between gap-4">
              <p className="ledger-label flex items-baseline gap-4">
                <span className="text-foreground transition-colors duration-300 group-hover:text-accent">
                  E{i + 1}
                </span>
                {row.status === "Live" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden className="size-1.5 bg-accent" />
                    <span className="text-accent">Live product</span>
                  </span>
                ) : (
                  <span>{row.status}</span>
                )}
              </p>
              <IconArrowUpRight
                size={22}
                stroke={1.75}
                aria-hidden
                className="shrink-0 text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>

            <h3 className="mt-4 max-w-[24ch] text-[clamp(1.5rem,2.6vw,2.75rem)] font-[780] leading-[1.02] tracking-[-0.035em] text-foreground [font-variation-settings:'wdth'_108] text-balance">
              {row.title}
            </h3>

            <dl className="mt-6 grid max-w-[64ch] grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-[15px] leading-[1.5] md:text-base">
              {row.entries.map((entry) => (
                <div key={entry.term} className="contents">
                  <dt className="ledger-label pt-[0.2em]">{entry.term}</dt>
                  <dd className={entry.term === "Learned" ? "text-foreground" : "text-muted-foreground"}>{entry.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Link>
      ))}
    </div>
  )
}
