import Link from "next/link"
import { ViewTransition, type CSSProperties } from "react"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { WorkItem } from "@/lib/types/content"
import { WorkSpecimen } from "./work-specimens"
import { ElasticFrame } from "./elastic-frame"

function slugOf(href: string) {
  return href.split("/").filter(Boolean).pop() ?? ""
}

/**
 * Where each frame sits in the gallery, by position in the sequence: a
 * staggered editorial spread of wide, portrait and tall frames. Columns are
 * 1-based grid lines on the 12-column ledger grid; `shift` drops a frame
 * below its row's top (in units of 1.4vw) so the spread never lines up flat.
 */
const SLOTS = [
  { format: "wide", ratio: 16 / 9, col: [1, 8], row: 1, shift: 0 },
  { format: "portrait", ratio: 4 / 5, col: [9, 13], row: 1, shift: 10 },
  { format: "wide", ratio: 16 / 9, col: [5, 13], row: 2, shift: 0 },
  { format: "wide", ratio: 16 / 9, col: [1, 9], row: 3, shift: 0 },
  { format: "tall", ratio: 2 / 3, col: [10, 13], row: 3, shift: 8 },
] as const

/**
 * Selected work as a gallery: each study a frame of its own media with a
 * short caption under it (reference, title, who I was there, the outcome).
 * Frames with media become elastic sheets on desktop (ElasticFrame); a frame
 * without media shows the study's drawn specimen until its media arrives.
 * The whole frame and caption is one link, and the frame keeps the shared
 * view-transition name, so opening a study grows it into the study's hero.
 */
export function WorkGallery({ items }: { items: WorkItem[] }) {
  return (
    <div className="work-index work-gallery relative grid grid-cols-12 gap-x-[var(--col-gap)] gap-y-16 md:gap-y-[clamp(5rem,9vw,9rem)]">
      {items.map((item, i) => {
        const slot = SLOTS[i % SLOTS.length]
        const slug = slugOf(item.href)
        const ref = String(i + 1).padStart(2, "0")
        const place = {
          "--col-start": slot.col[0],
          "--col-end": slot.col[1],
          "--row": slot.row,
          "--shift": slot.shift,
          "--i": i,
        } as CSSProperties

        return (
          <Link
            key={item.href}
            href={item.href}
            data-settle
            data-cursor-card
            data-cursor-label="Open"
            data-format={slot.format}
            style={place}
            className="work-row work-frame group col-span-12 block min-w-0"
          >
            <ViewTransition name={`case-${slug}`} share="case-morph">
              <figure className="m-0">
                <ElasticFrame media={item.media} ratio={slot.ratio}>
                  <WorkSpecimen slug={slug} />
                </ElasticFrame>
              </figure>
            </ViewTransition>

            <div className="relative z-[3] mt-5 grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 md:mt-6 md:grid-cols-[2.75rem_minmax(0,1fr)_auto]">
              <span className="ledger-label text-foreground transition-colors duration-300 group-hover:text-accent">
                {ref}
              </span>
              <h3
                className={clsx(
                  "font-[720] leading-[1.08] tracking-[-0.025em] text-foreground [font-variation-settings:'wdth'_104] text-balance",
                  slot.format === "wide"
                    ? "max-w-[26ch] text-[clamp(1.375rem,2.1vw,2.125rem)]"
                    : "max-w-[20ch] text-[clamp(1.25rem,1.6vw,1.625rem)]",
                )}
              >
                {item.title}
              </h3>
              <IconArrowUpRight
                size={20}
                stroke={1.75}
                aria-hidden
                className="self-start text-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1"
              />
              <p className="col-span-2 col-start-2 mt-2 text-[15px] leading-[1.4] text-muted-foreground">
                {item.byline ?? item.role}
              </p>
              {item.metric && (
                <p className="col-span-2 col-start-2 mt-3 max-w-[52ch] text-[15px] leading-[1.5] text-foreground text-pretty tabular-nums">
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
