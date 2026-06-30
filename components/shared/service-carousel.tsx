"use client"

import { useEffect, useRef, useState } from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { ServiceCard, type ServiceCardItem } from "./service-card"

interface ServiceCarouselProps {
  items: ServiceCardItem[]
  /** Small uppercase label above the heading. */
  eyebrow?: string
  /** Section heading shown beside the prev/next controls. */
  heading?: string
  className?: string
}

/**
 * An expanding-panel carousel built from <ServiceCard>. One panel is active at
 * a time: hovering or focusing a card promotes it, and the prev/next controls
 * step the active panel (clamped, no wrap). On touch the row is a horizontal
 * scroll-snap strip; the arrows scroll the active card into view.
 */
export function ServiceCarousel({
  items,
  eyebrow = "Our Service",
  heading = "Build measurement systems that reveal",
  className,
}: ServiceCarouselProps) {
  const [active, setActive] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, next))
    setActive(clamped)
  }

  // Keep the active card in view on touch, where the row scrolls horizontally.
  useEffect(() => {
    cardRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [active])

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="max-w-[16ch] text-pretty text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-4xl">
            {heading}
          </h2>
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

      {/* Panels */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:snap-none md:overflow-visible md:px-0 md:pb-0">
        {items.map((item, i) => (
          <ServiceCard
            key={item.id}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            item={item}
            active={i === active}
            onActivate={() => setActive(i)}
          />
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
