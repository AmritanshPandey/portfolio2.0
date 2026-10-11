import Link from "next/link"
import clsx from "clsx"
import type { ReactNode } from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

import { explorationItems, systemItems } from "@/lib/data"
import { FintechSystemSpecimen, PlanRSpecimen } from "./exploration-specimens"

/**
 * Explorations: two self-directed projects, side by side and always visible.
 *
 * This used to be a carousel, which hid nothing (there are only two items)
 * but still asked for arrows, and fronted each card with a stock gradient.
 * Now each card leads with a specimen of the actual work. The grid is
 * deliberately uneven so the pair doesn't read as a template card row.
 */

type Card = {
  href: string
  status: string
  title: string
  line: string
  cta: string
  specimen: ReactNode
}

export default function ExplorationsSection() {
  const planr = explorationItems[0]
  const system = systemItems[0]

  const cards: Card[] = [
    {
      href: planr.href,
      status: planr.status ?? "Exploration",
      title: planr.title,
      line: planr.learned ?? planr.description,
      cta: "Open case",
      specimen: <PlanRSpecimen />,
    },
    {
      href: system.href,
      status: system.category,
      title: system.title,
      line: system.description,
      cta: system.ctaLabel ?? "Explore system",
      specimen: <FintechSystemSpecimen />,
    },
  ]

  return (
    <div
      data-cursor-zone="exploration"
      className="grid gap-x-8 gap-y-14 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start"
    >
      {cards.map((card, i) => (
        <Link
          key={card.href}
          href={card.href}
          data-cursor-card
          data-cursor-label="Open"
          className={clsx(
            "group block rounded-2xl",
            // The second card sits lower, so the pair reads as two objects on
            // a desk rather than one row of equal tiles.
            i === 1 && "md:mt-20"
          )}
        >
          <div className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 motion-reduce:transition-none">
            {card.specimen}
          </div>

          <div className="mt-6 max-w-[34rem]">
            <p className="text-[13px] font-medium text-muted-foreground">
              {card.status === "Live" ? (
                <span className="inline-flex items-center gap-1.5 text-accent">
                  <span className="size-1.5 rounded-full bg-accent" />
                  Live product
                </span>
              ) : (
                card.status
              )}
            </p>
            <h3 className="mt-2 text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-snug tracking-[-0.012em] text-foreground text-balance">
              {card.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">
              {card.line}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground">
              <span className="underline decoration-border underline-offset-4 transition-colors group-hover:decoration-accent">
                {card.cta}
              </span>
              <IconArrowUpRight
                size={15}
                stroke={2}
                className="text-foreground/40 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
