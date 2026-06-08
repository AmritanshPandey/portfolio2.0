"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"

type Props = {
  href: string
  title: string
  description: string
  category?: string
  image?: string
  ctaLabel?: string
  index?: number
}

export function HorizontalCard({
  href,
  title,
  description,
  category,
  image,
  ctaLabel = "Explore",
  index,
}: Props) {
  const cursorLabel = category === "Article" ? "Read" : ctaLabel === "Explore" ? "Open" : ctaLabel

  return (
    <Link
      href={href}
      data-cursor-card
      data-cursor-label={cursorLabel}
      className="group/card block rounded-2xl"
    >
      <div className={clsx(
        "relative rounded-2xl overflow-hidden",
        "bg-card border border-border/70",
        "shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-[3px]",
        "hover:border-border/50 dark:hover:border-white/[0.12]",
        "hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)]",
        "dark:hover:shadow-[0_16px_56px_rgba(0,0,0,0.50)]",
        "flex flex-col md:flex-row md:min-h-[240px]",
      )}>

        {/* TOP EDGE HIGHLIGHT */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent dark:via-white/15 pointer-events-none" />

        {/* ORANGE GLOW — content side, bottom-right */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-[radial-gradient(320px_180px_at_100%_100%,rgba(234,88,12,0.07),transparent_60%)] dark:bg-[radial-gradient(320px_180px_at_100%_100%,rgba(249,115,22,0.11),transparent_60%)]" />

        {/* IMAGE */}
        {image && (
          <div className="relative h-52 md:h-auto md:self-stretch md:w-[38%] shrink-0 overflow-hidden bg-muted">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
            />
            {/* Blend bottom into card on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent md:hidden" />
            {/* Blend right edge into card on desktop */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/60" />
            {/* Index */}
            {index !== undefined && (
              <span className="absolute top-3 left-3.5 font-mono text-[11px] font-medium text-white/40 tracking-wider select-none">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>
        )}

        {/* CONTENT */}
        <div className="relative flex flex-col justify-between flex-1 p-5 md:p-6 md:pl-7 h-full">

          <div className="flex flex-col gap-2.5 max-w-xl">
            {category && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                {category}
              </p>
            )}
            <h3 className="text-lg md:text-xl font-semibold tracking-[-0.02em] leading-[1.25] text-balance text-foreground">
              {title}
            </h3>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-foreground/70 line-clamp-3">
              {description}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-5 py-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-[12px] font-medium text-foreground/40 group-hover/card:text-orange-600 dark:group-hover/card:text-orange-400 transition-colors duration-200">
              {ctaLabel}
            </span>
            <IconArrowUpRight
              size={14}
              stroke={2}
              className="text-foreground/25 group-hover/card:text-orange-600 dark:group-hover/card:text-orange-400 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px] transition-all duration-200"
            />
          </div>

        </div>

      </div>
    </Link>
  )
}
