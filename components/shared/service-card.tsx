"use client"

import Image from "next/image"
import { IconArrowUpRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export interface ServiceCardItem {
  /** Stable key. */
  id: string
  /** Two-digit ordinal shown in the eyebrow, e.g. "01". */
  index: string
  /** Short category label, e.g. "Finance". */
  category: string
  title: string
  description: string
  /** Background image (object-cover). */
  image: string
  /** Optional destination for the VIEW affordance. */
  href?: string
  /** Optional short chips shown by some variations (e.g. ServiceAccordion). */
  tags?: string[]
}

interface ServiceCardProps {
  item: ServiceCardItem
  /** Expanded state — drives width, scrim weight and the revealed body. */
  active: boolean
  /** Called on hover, focus-within and click so the parent can promote it.
   *  Optional so the card can be dropped into a Server Component for a static,
   *  pinned-state preview without passing a function prop across the boundary. */
  onActivate?: () => void
  ref?: React.Ref<HTMLDivElement>
  className?: string
}

/**
 * One panel of <ServiceCarousel> — an image tile that expands into a dark
 * editorial card. Collapsed it shows the image, an ordinal eyebrow and the
 * title; active it deepens the scrim and reveals the description + a VIEW
 * link.
 *
 * Layout is responsive without JS branching: below md every card is a fixed,
 * scroll-snapped panel with its body always shown; at md+ the cards become an
 * accordion row where `active` grows the panel (flex-grow) and the body fades
 * in. The body stays mounted (opacity/translate, never display:none) so the
 * VIEW link is always focusable — tabbing to it fires `onActivate` via the
 * card's onFocus, expanding the panel for keyboard users.
 */
export function ServiceCard({ item, active, onActivate, ref, className }: ServiceCardProps) {
  return (
    <div
      ref={ref}
      data-active={active}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className={cn(
        "group relative h-[24rem] overflow-hidden rounded-[1.5rem] md:h-[26rem] lg:h-[30rem]",
        "ring-1 ring-black/[0.06] dark:ring-white/[0.08]",
        // Mobile: fixed-width snap panel. md+: zero-basis accordion item that
        // grows when active. transition-[flex-grow] animates the expand.
        "w-[78vw] max-w-[22rem] shrink-0 snap-center",
        "md:w-auto md:max-w-none md:shrink md:basis-0 md:[flex-grow:1] md:data-[active=true]:[flex-grow:4]",
        "transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[flex-grow] motion-reduce:transition-none",
        "cursor-pointer outline-none",
        className
      )}
    >
      {/* Image */}
      <Image
        src={item.image}
        alt=""
        fill
        sizes="(max-width: 768px) 78vw, 40vw"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform md:group-data-[active=true]:scale-[1.04]"
      />

      {/* Scrim — readable at rest, near-solid when active so it reads as a
          dark panel rather than a captioned photo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-700 md:from-black/70 md:via-black/20 md:to-transparent md:opacity-90 md:group-data-[active=true]:opacity-100"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-black/45 opacity-100 transition-opacity duration-700 md:opacity-0 md:group-data-[active=true]:opacity-100"
      />

      {/* Content — three independently-placed layers so the collapsed→active
          swap is a crossfade (opacity, never display) and the body stays
          mounted + focusable. */}
      <div className="absolute inset-0 p-6 lg:p-7">
        {/* Eyebrow — index always; the rest reads only when expanded */}
        <p className="absolute inset-x-6 top-6 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 lg:inset-x-7 lg:top-7">
          <span className="text-accent">{item.index}</span>
          <span className="h-px w-4 bg-white/30 md:hidden md:group-data-[active=true]:block" />
          <span className="md:hidden md:group-data-[active=true]:inline">{item.category}</span>
        </p>

        {/* Collapsed: vertical title (md only) — reads bottom-to-top so a
            narrow panel still carries its label without clipping. */}
        <h3
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-5 hidden whitespace-nowrap rotate-180 text-lg font-semibold tracking-tight text-white opacity-0 transition-opacity duration-500 [writing-mode:vertical-rl] md:block md:opacity-100 md:group-data-[active=true]:opacity-0 lg:bottom-7 lg:left-6 lg:text-xl"
        >
          {item.title}
        </h3>

        {/* Expanded: full body (mobile always; md when active) */}
        <div
          className={cn(
            "absolute inset-x-6 bottom-6 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:inset-x-7 lg:bottom-7",
            "opacity-100 md:translate-y-2 md:opacity-0 md:group-data-[active=true]:translate-y-0 md:group-data-[active=true]:opacity-100 md:group-data-[active=true]:delay-200",
            "pointer-events-auto md:pointer-events-none md:group-data-[active=true]:pointer-events-auto motion-reduce:translate-y-0 motion-reduce:transition-none"
          )}
        >
          <h3 className="max-w-[22ch] text-pretty text-xl font-semibold leading-tight text-white md:text-2xl">
            {item.title}
          </h3>
          <p className="mt-3 max-w-[42ch] text-pretty text-sm leading-relaxed text-white/65">
            {item.description}
          </p>
          <ViewLink href={item.href} title={item.title} />
        </div>
      </div>
    </div>
  )
}

function ViewLink({ href, title }: { href?: string; title: string }) {
  const className =
    "mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"

  const inner = (
    <>
      View
      <IconArrowUpRight className="size-3.5" stroke={2.5} />
    </>
  )

  // Stop the click from bubbling to the card's activate handler so navigation
  // isn't shadowed by a state change.
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  if (!href) {
    return (
      <button type="button" onClick={stop} aria-label={`View ${title}`} className={className}>
        {inner}
      </button>
    )
  }

  return (
    <a href={href} onClick={stop} aria-label={`View ${title}`} className={className}>
      {inner}
    </a>
  )
}
