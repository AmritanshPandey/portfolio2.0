"use client"

import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"

type Props = {
  index: number
  title: string
  description: string
  href: string
}

export function ArticleCard({ index, title, description, href }: Props) {
  return (
    <Link
      href={href}
      className="
        group/card flex flex-col h-full p-6 rounded-2xl
        border border-border bg-card
        transition-all duration-300 ease-out
        hover:border-border/80
        hover:shadow-md dark:hover:shadow-lg
        hover:-translate-y-1
        focus:outline-none
        focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      "
    >

      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-5">
        <span className="
          text-[10px] font-medium tracking-[0.18em] uppercase
          text-muted-foreground
          transition-colors duration-200
          group-hover/card:text-foreground
        ">
          {String(index).padStart(2, "0")}
        </span>

        <span className="
          w-9 h-9 rounded-full
          border border-border
          flex items-center justify-center
          transition-all duration-200
          group-hover/card:bg-foreground
          group-hover/card:border-foreground
        ">
          <IconArrowUpRight
            size={16}
            stroke={2}
            className="
              text-muted-foreground
              transition-colors duration-200
              group-hover/card:text-background
            "
          />
        </span>
      </div>

      {/* TITLE */}
      <h3 className="
        text-base md:text-lg font-medium leading-snug tracking-tight
        text-foreground mb-2.5 line-clamp-2
        transition-colors duration-200
        group-hover/card:text-muted-foreground
      ">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="
        text-muted-foreground text-sm leading-relaxed
        line-clamp-3 flex-1
      ">
        {description}
      </p>

      {/* BOTTOM */}
      <div className="
        mt-5 pt-4 border-t border-border
        flex items-center justify-between
      ">
        <span className="
          text-xs font-medium text-foreground
          group-hover/card:underline underline-offset-4
        ">
          Read article
        </span>

        <span className="
          text-[10px] text-muted-foreground tracking-wide
        ">
          Article
        </span>
      </div>

    </Link>
  )
}