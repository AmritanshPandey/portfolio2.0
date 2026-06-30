"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import type { ServiceCardItem } from "./service-card"

interface ServiceAccordionProps {
  items: ServiceCardItem[]
  /** Small label shown to the right of the heading. */
  eyebrow?: string
  /** Section heading on the left. */
  heading?: string
  className?: string
}

/**
 * A light, editorial variation of <ServiceCarousel>. Collapsed panels are thin
 * vertical strips carrying a rotated title + ordinal; the active panel expands
 * to reveal an image, title, description and tag chips. One panel is active at a
 * time — hover or focus a card to promote it; the arrows step the active panel
 * (clamped, no wrap). On touch the row becomes a horizontal scroll-snap strip.
 */
export function ServiceAccordion({
  items,
  eyebrow = "Service",
  heading = "Our Expertise",
  className,
}: ServiceAccordionProps) {
  const [active, setActive] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const go = (next: number) => {
    setActive(Math.max(0, Math.min(items.length - 1, next)))
  }

  // Keep the active panel in view on touch, where the row scrolls horizontally.
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
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {heading}
        </h2>

        <div className="flex shrink-0 items-center gap-4">
          {eyebrow && (
            <span className="hidden items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex">
              <span className="size-1.5 rounded-full bg-accent" />
              {eyebrow}
            </span>
          )}
          <div className="flex items-center gap-2">
            <NavButton direction="prev" disabled={active === 0} onClick={() => go(active - 1)} />
            <NavButton
              direction="next"
              disabled={active === items.length - 1}
              onClick={() => go(active + 1)}
            />
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:snap-none md:gap-0 md:overflow-hidden md:rounded-[1.5rem] md:border md:border-border md:px-0 md:pb-0">
        {items.map((item, i) => (
          <Panel
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

function Panel({
  item,
  active,
  onActivate,
  ref,
}: {
  item: ServiceCardItem
  active: boolean
  onActivate: () => void
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={ref}
      data-active={active}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      className={cn(
        "group relative h-[26rem] overflow-hidden bg-card outline-none lg:h-[30rem]",
        // Mobile: fixed-width snap panel with rounded corners + border.
        "w-[80vw] max-w-[20rem] shrink-0 snap-center rounded-[1.5rem] ring-1 ring-border",
        // md+: zero-basis accordion item inside a shared bordered rail. Active
        // grows; dividers between panels are the rail's inner borders.
        "md:w-auto md:max-w-none md:shrink md:basis-0 md:rounded-none md:ring-0 md:[flex-grow:1] md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-border md:data-[active=true]:[flex-grow:5]",
        "transition-[flex-grow] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[flex-grow] motion-reduce:transition-none",
        "cursor-pointer focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-accent"
      )}
    >
      {/* Ordinal label — top, always present. */}
      <p className="absolute left-5 top-5 z-10 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Service <span className="text-foreground/40">/ {item.index}</span>
      </p>

      {/* Collapsed: vertical title (md only), reading bottom-to-top. */}
      <h3
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rotate-180 text-xl font-semibold tracking-tight text-foreground opacity-100 transition-opacity duration-300 [writing-mode:vertical-rl] md:block md:group-data-[active=true]:opacity-0 lg:text-2xl"
      >
        {item.title}
      </h3>

      {/* Expanded: image + title + description + chips. Always shown on mobile;
          on md it crossfades in when the panel is active. */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col p-5 pt-12 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:p-6 lg:pt-14",
          "opacity-100 md:translate-y-2 md:opacity-0 md:group-data-[active=true]:translate-y-0 md:group-data-[active=true]:opacity-100 md:group-data-[active=true]:delay-200",
          "pointer-events-none motion-reduce:translate-y-0 motion-reduce:transition-none"
        )}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-border/60">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(max-width: 768px) 80vw, 38vw"
            className="object-cover"
          />
        </div>

        <h3 className="mt-5 text-pretty text-xl font-semibold leading-tight tracking-tight text-foreground md:text-2xl">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 max-w-[44ch] text-pretty text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {item.tags && item.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
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
