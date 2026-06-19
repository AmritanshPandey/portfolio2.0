"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { motion, useReducedMotion } from "framer-motion"
import { IconArrowUpRight } from "@tabler/icons-react"

type Variant = "default" | "compact" | "featured"

type Props = {
  href: string
  image?: string
  title: string
  description?: string
  category?: string
  ctaLabel?: string
  variant?: Variant
  showImage?: boolean
  metric?: string
  index?: number
  /** Tailwind height class for the image area. Defaults to "h-44". */
  imageHeight?: string
  tags?: string[]
  thinkingBlock?: {
    constraint: string
    decision: string
    outcome: string
  }
  proofRow?: string
}

export function VerticalCard({
  href,
  image,
  title,
  category,
  ctaLabel = "View case study",
  variant = "default",
  showImage = true,
  description,
  metric,
  index,
  imageHeight = "h-44",
  tags,
  thinkingBlock,
  proofRow,
}: Props) {

  const isCompact = variant === "compact"
  const isFeatured = variant === "featured"
  const bodyText = description ?? metric

  const cursorLabelMap: Record<string, string> = {
    "View case study": "View",
    "Read case study": "Read",
    "Explore": "Explore",
    "Read article": "Read",
  }
  const cursorLabel = cursorLabelMap[ctaLabel] || "View"

  // Cursor-following spotlight. Updates CSS vars on the card element directly
  // (no React state → no re-render), rAF-throttled, and disabled for users who
  // prefer reduced motion — the glow then rests at its default top-center spot.
  const prefersReduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = cardRef.current
    if (!el || rafRef.current) return
    const { clientX, clientY } = e
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const r = el.getBoundingClientRect()
      el.style.setProperty("--mx", `${((clientX - r.left) / r.width) * 100}%`)
      el.style.setProperty("--my", `${((clientY - r.top) / r.height) * 100}%`)
    })
  }

  const resetSpotlight = () => {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty("--mx", "50%")
    el.style.setProperty("--my", "0%")
  }

  if (isCompact) {
    return (
      <Link
        href={href}
        data-cursor-card
        data-cursor-label={cursorLabel}
        className="group/card flex items-center gap-4 py-3.5 rounded-xl px-3 -mx-3 hover:bg-foreground/[0.03] dark:hover:bg-white/[0.03] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {showImage && image && (
          <div className="relative w-16 h-11 rounded-lg overflow-hidden shrink-0 bg-muted">
            <Image
              src={image}
              alt={title}
              fill
              sizes="64px"
              className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {category && <p className="type-meta mb-0.5">{category}</p>}
          <h3 className="text-[14px] font-semibold leading-[1.35] text-foreground line-clamp-1">{title}</h3>
          {metric && <p className="type-caption mt-0.5 line-clamp-1 text-accent/60">{metric}</p>}
        </div>
        <IconArrowUpRight size={14} stroke={2} className="shrink-0 text-foreground/20 transition-all duration-500 group-hover/card:text-foreground/50 group-hover/card:-translate-y-[1px] group-hover/card:translate-x-[1px]" />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      data-cursor-card
      data-cursor-label={cursorLabel}
      onPointerMove={prefersReduced ? undefined : handlePointerMove}
      onPointerLeave={prefersReduced ? undefined : resetSpotlight}
      className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: (index ?? 0) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
        "relative h-full flex flex-col overflow-hidden rounded-2xl",
        "bg-card",
        "border border-border/50",
        // Soft top highlight (inset hairline) + a faint lift shadow read as a
        // pressed surface on dark without glow or gradient.
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_1px_2px_0_rgba(0,0,0,0.10)]",
        isFeatured ? "min-h-[330px]" : "min-h-[215px]",
        // Only animate compositor-friendly props (transform/border), not
        // box-shadow transition, which forces a full repaint each frame.
        "transition-[transform,border-color,background-color] duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-[2px]",
        "hover:border-foreground/14 hover:bg-foreground/[0.025] dark:hover:border-white/[0.15] dark:hover:bg-white/[0.035]",
        // Tactile press — barely-there settle on click.
        "active:translate-y-0 active:scale-[0.994] active:duration-150",
      )}>

        {/* Amber spotlight — follows the cursor on hover (rests top-center). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{ background: "radial-gradient(300px 220px at var(--mx, 50%) var(--my, 0%), rgba(16,185,129,0.10), transparent 70%)" }}
        />

        {/* Image block */}
        {showImage && image && (
          <div className={clsx("relative overflow-hidden shrink-0", imageHeight)}>

            <Image
              src={image}
              alt={title}
              fill
              sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
            />

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--card))] opacity-80" />

            {/* Soft top vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

            {/* Index number */}
            {index !== undefined && (
              <span className="absolute top-3 left-3.5 font-mono text-[11px] font-medium text-white/40 tracking-wider select-none">
                {String(index).padStart(2, "0")}
              </span>
            )}

            {/* Arrow */}
            <span className={clsx(
              "absolute top-3 right-3",
              "w-8 h-8 rounded-full",
              "bg-black/20 border border-white/20",
              "flex items-center justify-center",
              "opacity-0 scale-90",
              "group-hover/card:opacity-100 group-hover/card:scale-100",
              "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            )}>
              <IconArrowUpRight size={14} stroke={2} className="text-white transition-transform duration-500 group-hover/card:-translate-y-[1px] group-hover/card:translate-x-[1px]" />
            </span>

          </div>
        )}

        {/* Content block */}
        <div
          className={clsx(
            "relative flex flex-1 flex-col",
            isFeatured
              ? "px-7 pb-7 pt-7 md:px-8 md:pb-8 md:pt-8"
              : "px-6 pb-6 pt-6"
          )}
        >

          {category && (
            <p className="type-meta">{category}</p>
          )}

          <h3
            className={clsx(
              "mt-2.5 text-foreground",
              isFeatured
                ? "type-card-title-featured max-w-[27rem]"
                : "type-card-title leading-[1.2]"
            )}
          >
            {title}
          </h3>

          {bodyText && (
            <p
              className={clsx(
                "mt-4 max-w-[44rem] text-foreground/58",
                isFeatured ? "type-card-body-featured" : "type-card-body"
              )}
            >
              {bodyText}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/35 bg-muted/25 px-2 py-0.5 text-[10px] font-medium leading-[1.45] text-foreground/42"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isFeatured && thinkingBlock && (
            <dl className="mt-7 space-y-3 text-[12px] leading-relaxed">
              {[
                ["Constraint", thinkingBlock.constraint],
                ["Decision", thinkingBlock.decision],
                ["Outcome", thinkingBlock.outcome],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 sm:grid-cols-[86px_1fr] sm:gap-3">
                  <dt className="text-foreground/32">{label}</dt>
                  <dd className="text-foreground/58">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {!isFeatured && proofRow && (
            <p className="mt-5 text-[12px] font-medium leading-relaxed text-foreground/48">
              {proofRow}
            </p>
          )}

          {/* CTA row */}
          <div className="mt-auto pt-7">
            <div className="flex items-center justify-between border-t border-border/40 pt-6">
              <span className="type-cta text-foreground/50 transition-colors duration-500 group-hover/card:text-foreground/82">
                {ctaLabel}
              </span>
              <IconArrowUpRight
                size={15}
                stroke={2}
                className="text-foreground/32 transition-all duration-500 group-hover/card:text-foreground/80 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px]"
              />
            </div>
          </div>

        </div>

      </motion.div>
    </Link>
  )
}
