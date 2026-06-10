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
      className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div
        className="
          relative h-full flex flex-col overflow-hidden rounded-2xl
          bg-card border border-border/65
          shadow-[0_1px_0_rgba(255,255,255,0.04)]
          min-h-[235px]
          transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:-translate-y-[2px]
          hover:border-foreground/20 hover:bg-foreground/[0.015]
          dark:hover:border-white/20 dark:hover:bg-white/[0.025]
        "
      >
        <div className="relative flex flex-1 flex-col gap-3.5 px-5 pb-5 pt-5">

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {category && <p className="type-meta">{category}</p>}
            {readTime && (
              <>
                <span className="text-foreground/20">/</span>
                <p className="type-meta">{readTime}</p>
              </>
            )}
          </div>

          <h3 className="type-card-title text-foreground">
            {title}
          </h3>

          {description && (
            <p className="type-card-body max-w-[44rem] text-foreground/58 line-clamp-3">
              {description}
            </p>
          )}

          {date && <p className="type-caption text-foreground/40">{date}</p>}

          {/* CTA row */}
          <div className="mt-auto flex items-center justify-between border-t border-border/45 pt-4">
            <span className="type-cta text-foreground/50 transition-colors duration-500 group-hover/card:text-foreground/82">
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
