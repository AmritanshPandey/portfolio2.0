"use client"

import { useEffect, useRef, useState } from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { ServiceSheetCard } from "./service-sheet-card"
import type { ServiceCardItem } from "./service-card"

interface ServiceSheetCarouselProps {
  items: ServiceCardItem[]
  /** Optional small uppercase label above the heading. */
  eyebrow?: string
  /** Optional section heading (title) shown beside the prev/next controls. */
  heading?: string
  /** Optional supporting line under the heading. */
  subtitle?: string
  className?: string
}

/**
 * A horizontal carousel of <ServiceSheetCard>s with prev/next arrows pinned to
 * the top-right. The active card is raised (sheet open) to preview the state;
 * the arrows step through (clamped, no wrap) and scroll the active card into
 * view. The strip is a scroll-snap row so it also drags/swipes on touch.
 */
export function ServiceSheetCarousel({
  items,
  eyebrow,
  heading,
  subtitle,
  className,
}: ServiceSheetCarouselProps) {
  const [active, setActive] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const go = (next: number) => {
    setActive(Math.max(0, Math.min(items.length - 1, next)))
  }

  // Keep the active card in view as the arrows step through.
  useEffect(() => {
    cardRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [active])

  return (
    <div className={cn("w-full", className)}>
      {/* Header — title + subtitle on the left, controls pinned top-right. */}
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          {eyebrow && (
            <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="max-w-[16ch] text-pretty text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-4xl">
              {heading}
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 max-w-[48ch] text-pretty text-sm leading-relaxed text-muted-foreground md:text-[15px]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <NavButton
            direction="prev"
            disabled={active === 0}
            onClick={() => go(active - 1)}
          />
          <NavButton
            direction="next"
            disabled={active === items.length - 1}
            onClick={() => go(active + 1)}
          />
        </div>
      </div>

      {/* Strip — scroll-snap row; padded gutters so the raised sheet + pill of
          edge cards aren't clipped by the scroll container. */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-2 md:px-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="shrink-0 snap-center"
          >
            <ServiceSheetCard
              item={item}
              active={i === active}
              className="w-[80vw] max-w-[20rem] sm:w-[20rem]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next"
  disabled?: boolean
  onClick: () => void
}) {
  const Icon = direction === "prev" ? IconArrowLeft : IconArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous service" : "Next service"}
      className={cn(
        "flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300",
        "hover:border-foreground/40 hover:bg-foreground/[0.04]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border disabled:hover:bg-transparent"
      )}
    >
      <Icon className="size-[18px]" stroke={1.75} />
    </button>
  )
}
