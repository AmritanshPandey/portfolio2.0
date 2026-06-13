"use client"

import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"

type Props = {
  title: string
  description: string
  href: string
  date?: string
  readTime?: string
  category?: string
  /** Accepted for call-site compatibility; no longer rendered. */
  image?: string
  accent?: string
}

export function ArticleCard({
  title,
  description,
  href,
  date,
  readTime,
  category = "Article",
}: Props) {
  return (
    <Link
      href={href}
      data-cursor-card
      data-cursor-label="Read"
      className="group/card block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div
        className="
          relative h-full flex flex-col overflow-hidden rounded-lg
          bg-background border border-border/65
          min-h-[245px]
          transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:-translate-y-[1px]
          hover:border-foreground/22 hover:bg-foreground/[0.012]
          dark:hover:border-white/20 dark:hover:bg-white/[0.02]
        "
      >
        {/* Amber glow — blooms from top-center on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{ background: "radial-gradient(260px 160px at 50% 0%, rgba(244,63,94,0.08), transparent 70%)" }}
        />

        <div className="relative flex flex-1 flex-col gap-4 px-5 pb-5 pt-5">

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {category && <p className="type-meta">{category}</p>}
            {readTime && (
              <>
                <span className="text-foreground/20">/</span>
                <p className="type-meta">{readTime}</p>
              </>
            )}
          </div>

          <h3 className="type-card-title max-w-[18rem] text-foreground">
            {title}
          </h3>

          {description && (
            <p className="type-card-body max-w-[44rem] text-foreground/58 line-clamp-3">
              {description}
            </p>
          )}

          {date && <p className="type-caption text-foreground/42">{date}</p>}

          {/* CTA row */}
          <div className="mt-auto flex items-center justify-between border-t border-border/55 pt-4">
            <span className="type-cta text-foreground/48 transition-colors duration-500 group-hover/card:text-foreground/82">
              Read article
            </span>
            <IconArrowUpRight
              size={15}
              stroke={2}
              className="text-foreground/32 transition-all duration-500 group-hover/card:text-foreground/80 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px]"
            />
          </div>

        </div>
      </div>
    </Link>
  )
}
