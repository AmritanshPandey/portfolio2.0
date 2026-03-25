"use client"

import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"
import clsx from "clsx"

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
      data-cursor-card
      data-cursor-label="Read"
      data-cursor-cta
    >
      <div
        className={clsx(
          "relative flex flex-col h-full p-6 rounded-2xl overflow-hidden",
          "bg-card border border-border",

          // ✨ top edge
          "before:absolute before:inset-x-0 before:top-0 before:h-px",
          "before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent",
          "dark:before:via-white/20",

          // 🔥 Safari-safe transform (no layout shift)
          "transition-transform duration-300 ease-out",
          "[transform:translateZ(0)]",

          "hover:[transform:translate3d(-1px,-2px,0)]",
          "hover:border-border/80",

          // lighter shadow (avoid heavy repaint)
          "hover:shadow-md dark:hover:shadow-xl"
        )}
      >

        {/* subtle ambient (lighter + safe) */}
        <div className="
          pointer-events-none absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300

          bg-[radial-gradient(200px_100px_at_0%_100%,rgba(255,90,0,0.06),transparent_60%)]
          dark:bg-[radial-gradient(200px_100px_at_0%_100%,rgba(255,140,60,0.08),transparent_60%)]
        " />

        <div
          className="
            relative flex flex-col flex-1

            // 🔥 remove layout shift
            transition-transform duration-300
            group-hover:[transform:translate3d(-1px,-1px,0)]
          "
        >

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

              transition-colors duration-300
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
                  transition-transform duration-300

                  group-hover:text-orange-600
                  dark:group-hover:text-orange-400

                  group-hover:[transform:translate3d(2px,-2px,0)]
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
              transition-transform duration-200

              group-hover:text-orange-600
              dark:group-hover:text-orange-400

              group-hover:[transform:translate3d(2px,0,0)]
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