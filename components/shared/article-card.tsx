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
      className="group block h-full rounded-2xl"
    >
      <div
        className="
          relative flex flex-col h-full p-6 rounded-2xl overflow-hidden
          bg-card border border-border

          before:absolute before:inset-x-0 before:top-0 before:h-px
          before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent
          dark:before:via-white/20

          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:-translate-y-[2px] hover:-translate-x-[1px]
          hover:border-border/80
          hover:shadow-[0_10px_28px_rgba(0,0,0,0.06)]
          dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.5)]
        "
      >

        {/* subtle ambient */}
     <div className="
  pointer-events-none absolute inset-0
  rounded-2xl overflow-hidden

  opacity-0 group-hover:opacity-100
  transition-opacity duration-400

  bg-[radial-gradient(240px_120px_at_0%_100%,rgba(255,90,0,0.08),transparent_60%)]
  dark:bg-[radial-gradient(240px_120px_at_0%_100%,rgba(255,140,60,0.12),transparent_60%)]
" />

        <div className="
          relative flex flex-col flex-1
          transition-transform duration-300
          group-hover:translate-y-[-1px] group-hover:-translate-x-[1px]
        ">

          {/* TOP */}
          <div className="flex items-center justify-between mb-5">

            {/* index */}
            <span className="
              text-[10px] font-semibold tracking-[0.18em] uppercase
              text-foreground/60
              transition-colors duration-200
              group-hover:text-orange-600 dark:group-hover:text-orange-400
            ">
              {String(index).padStart(2, "0")}
            </span>

            {/* icon */}
            <span className="
              w-9 h-9 rounded-full
              border border-border
              flex items-center justify-center

              transition-all duration-300
              group-hover:border-orange-600/50
              dark:group-hover:border-orange-400/50

              group-hover:bg-orange-600/10
              dark:group-hover:bg-orange-400/10
            ">
              <IconArrowUpRight
                size={16}
                stroke={2}
                className="
                  text-foreground/60
                  transition-all duration-300

                  group-hover:text-orange-600
                  dark:group-hover:text-orange-400

                  group-hover:-translate-y-[2px]
                  group-hover:translate-x-[2px]
                "
              />
            </span>

          </div>

          {/* TITLE */}
          <h3 className="
            text-base md:text-lg font-medium leading-[1.3] tracking-tight
            text-foreground mb-2.5 line-clamp-2
          ">
            {title}
          </h3>

          {/* DESCRIPTION */}
          <p className="
            text-foreground/70 text-sm leading-relaxed
            line-clamp-3 flex-1
          ">
            {description}
          </p>

          {/* BOTTOM */}
          <div className="
            mt-5 pt-4 border-t border-border/60
            flex items-center justify-between
          ">

            <span className="
              text-xs font-medium text-foreground/80
              transition-all duration-200

              group-hover:text-orange-600
              dark:group-hover:text-orange-400

              group-hover:translate-x-[2px]
            ">
              Read article
            </span>

            <span className="
              text-[10px] text-foreground/50 tracking-wide
            ">
              Article
            </span>

          </div>

        </div>
      </div>
    </Link>
  )
}