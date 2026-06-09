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
      className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className={clsx(
        "relative rounded-2xl overflow-hidden",
        "bg-card border border-border/65",
        "shadow-[0_1px_0_rgba(255,255,255,0.04)]",
        "transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-[2px]",
        "hover:border-foreground/20 hover:bg-foreground/[0.015]",
        "dark:hover:border-white/20 dark:hover:bg-white/[0.025]",
        "flex flex-col md:flex-row md:min-h-[240px]",
      )}>

        {/* TOP EDGE HIGHLIGHT */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent dark:via-white/15 pointer-events-none" />

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
              <span className="type-caption absolute top-3 left-3.5 font-mono text-white/45 select-none">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
          </div>
        )}

        {/* CONTENT */}
        <div className="relative flex flex-col flex-1 p-5 md:p-6 md:pl-7">

          <div className="flex flex-col gap-2.5 max-w-xl">
            {category && (
              <p className="type-meta">
                {category}
              </p>
            )}
            <h3 className="type-subtitle text-foreground">
              {title}
            </h3>
            <p className="type-card-body text-foreground/58 line-clamp-3">
              {description}
            </p>
          </div>

          {/* CTA — pinned to the bottom; mt-auto keeps spacing without forcing a fixed height */}
          <div className="mt-auto pt-5 border-t border-border/50 flex items-center justify-between">
            <span className="type-cta text-foreground/50 transition-colors duration-500 group-hover/card:text-foreground/82">
              {ctaLabel}
            </span>
            <IconArrowUpRight
              size={14}
              stroke={2}
              className="text-foreground/32 transition-all duration-500 group-hover/card:text-foreground/80 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px]"
            />
          </div>

        </div>

      </div>
    </Link>
  )
}
