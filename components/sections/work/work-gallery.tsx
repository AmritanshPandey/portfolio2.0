import Link from "next/link"
import { ViewTransition } from "react"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { WorkItem } from "@/lib/types/content"
import { WorkSpecimen } from "./work-specimens"
import { ElasticFrame } from "./elastic-frame"

function slugOf(href: string) {
  return href.split("/").filter(Boolean).pop() ?? ""
}

// One frame shape for every study: the specimens' own 16:10, so a frame with
// no media yet is filled edge to edge, and media is cropped to match.
const RATIO = 16 / 10

/**
 * Selected work: the first study leads, large, with its caption beside it;
 * the rest follow in a two-up grid, read left to right, top to bottom. Every
 * frame is the same shape and every caption reads the same way (reference
 * and role, the title, the outcome), so the eye always knows where to go
 * next.
 *
 * A frame with media becomes an elastic sheet on desktop (ElasticFrame); a
 * frame without shows the study's drawn specimen. Frame and caption are one
 * link, and the frame keeps the shared view-transition name, so opening a
 * study grows it into the study's hero.
 */
export function WorkGallery({ items }: { items: WorkItem[] }) {
  return (
    <div className="work-index work-gallery ledger-grid gap-y-14 md:gap-y-20">
      {items.map((item, i) => {
        const lead = i === 0
        const slug = slugOf(item.href)
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
              "work-row work-frame group min-w-0",
              lead
                ? "col-span-12 grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-[var(--col-gap)]"
                : "col-span-12 flex flex-col gap-y-6 md:col-span-6",
            )}
          >
            <div className={lead ? "md:col-span-8" : undefined}>
              <ViewTransition name={`case-${slug}`} share="case-morph">
                <figure className="m-0">
                  <ElasticFrame media={item.media} ratio={RATIO}>
                    <WorkSpecimen slug={slug} />
                  </ElasticFrame>
                </figure>
              </ViewTransition>
            </div>

            <div
              className={clsx(
                "relative z-[3] min-w-0",
                lead && "md:col-span-4 md:self-end md:pb-1",
              )}
            >
              <p className="ledger-label flex items-baseline gap-3">
                <span className="text-foreground transition-colors duration-300 group-hover:text-accent">{ref}</span>
                <span className="truncate">{item.byline ?? item.role}</span>
              </p>
              <h3
                className={clsx(
                  "mt-3 flex items-start justify-between gap-4 font-[720] tracking-[-0.025em] text-foreground [font-variation-settings:'wdth'_104]",
                  lead
                    ? "text-[clamp(1.625rem,2.6vw,2.5rem)] leading-[1.04]"
                    : "text-[clamp(1.375rem,1.9vw,1.875rem)] leading-[1.08]",
                )}
              >
                <span className="max-w-[24ch] text-balance">{item.title}</span>
                <IconArrowUpRight
                  size={lead ? 24 : 20}
                  stroke={1.75}
                  aria-hidden
                  className="mt-[0.15em] shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </h3>
              {item.metric && (
                <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.5] text-muted-foreground text-pretty tabular-nums md:text-base">
                  {item.metric}
                </p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
