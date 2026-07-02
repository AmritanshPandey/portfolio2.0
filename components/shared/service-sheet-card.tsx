import Image from "next/image"
import { IconArrowRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { ServiceCardItem } from "./service-card"

interface ServiceSheetCardProps {
  item: ServiceCardItem
  /**
   * Force the open (raised-sheet) state. Left unset the card opens on hover /
   * focus-within via CSS alone, so it works inside a Server Component grid with
   * no controller. A carousel can drive it explicitly instead.
   */
  active?: boolean
  className?: string
}

/**
 * Light, editorial "paper sheet" service card. An image fills the tile; a
 * rounded sheet sits at the bottom carrying the meta and title. Hovering,
 * focusing or passing `active` raises the sheet to reveal the description and a VIEW button — the
 * sheet grows upward (grid-rows 0fr→1fr) and covers more of the image.
 *
 * Reveal is keyed on hover, focus-within and `data-active`, so the open state
 * is reachable by mouse, keyboard (the VIEW control stays in the DOM and pulls
 * the sheet open on focus) and by a parent controller alike.
 */
export function ServiceSheetCard({ item, active, className }: ServiceSheetCardProps) {
  return (
    <div
      data-active={active ? true : undefined}
      className={cn(
        "group relative h-[26rem] overflow-hidden rounded-[1.75rem] border border-foreground/[0.08] bg-card lg:h-[28rem] dark:border-white/[0.08]",
        className
      )}
    >
      {/* Image */}
      <Image
        src={item.image}
        alt=""
        fill
        sizes="(max-width: 768px) 88vw, 360px"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.04] group-focus-within:scale-[1.04] group-data-[active=true]:scale-[1.04] motion-reduce:transition-none"
      />

      {/* Sheet — anchored to the bottom, inset so the image frames it. */}
      <div className="absolute inset-x-4 bottom-4">
        <div className="relative overflow-hidden rounded-[1.25rem] bg-background px-5 pb-5 pt-5 ring-1 ring-foreground/[0.08] dark:ring-white/[0.06]">
          <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/62">
            <span>{item.index}</span>
            <span aria-hidden className="h-px w-4 bg-border" />
            <span className="truncate">{item.category}</span>
          </p>

          <h3 className="max-w-[20ch] text-pretty text-lg font-semibold leading-snug tracking-tight text-foreground md:text-xl">
            {item.title}
          </h3>

          {/* Reveal — description + VIEW. Collapsed to 0fr, opened on
              hover / focus-within / active. */}
          <div
            className={cn(
              "grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              "group-hover:grid-rows-[1fr] group-hover:opacity-100",
              "group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100",
              "group-data-[active=true]:grid-rows-[1fr] group-data-[active=true]:opacity-100",
              "motion-reduce:transition-none"
            )}
          >
            <div className="overflow-hidden">
              <p className="mt-3 max-w-[44ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              <ViewButton href={item.href} title={item.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ViewButton({ href, title }: { href?: string; title: string }) {
  const className = cn(
    "mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5",
    "text-[11px] font-semibold uppercase tracking-[0.16em] text-background",
    "transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  )

  const inner = (
    <>
      View
      <IconArrowRight className="size-3.5" stroke={2.5} />
    </>
  )

  if (!href) {
    return (
      <button type="button" aria-label={`View ${title}`} className={className}>
        {inner}
      </button>
    )
  }

  return (
    <a href={href} aria-label={`View ${title}`} className={className}>
      {inner}
    </a>
  )
}
