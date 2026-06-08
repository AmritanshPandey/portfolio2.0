"use client"

import Link from "next/link"
import Image from "next/image"
import { IconArrowUpRight } from "@tabler/icons-react"

type Props = {
  title: string
  description: string
  href: string
  image: string
  date?: string
  category?: string
  /** CSS gradient — renders instead of the image when provided */
  accent?: string
}

export function ArticleCard({
  title,
  description,
  href,
  image,
  date,
  category = "Article",
  accent,
}: Props) {
  return (
    <Link
      href={href}
      className="group block"
      data-cursor-card
      data-cursor-label="Read"
    >
      <div
        className="
          flex items-start gap-5 p-5 rounded-2xl

          bg-transparent border border-transparent

          transition-all duration-300 ease-out
          hover:bg-[var(--surface-hover)]

          hover:[transform:translate3d(0,-1.5px,0)]
        "
      >

        {/* COVER — gradient when accent provided, image fallback */}
        <div className="
          w-20 md:w-24 aspect-square
          rounded-xl overflow-hidden
          bg-muted flex-shrink-0
          relative
        ">
          {accent ? (
            <div
              className="w-full h-full"
              style={{ background: accent }}
            />
          ) : (
            <Image
              src={image}
              alt={title}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* CONTENT */}
        <div className="
          flex flex-col flex-1 min-w-0

          transition-opacity duration-300
          group-hover:opacity-95
        ">

          {/* CATEGORY */}
          <span className="
            text-[10px] font-semibold tracking-[0.18em] uppercase
            text-foreground/50 mb-1
          ">
            {category}
          </span>

          {/* TITLE */}
          <h3 className="
            text-sm md:text-base font-medium leading-[1.35]
            text-foreground mb-2 line-clamp-2

            transition-colors duration-200
            group-hover:text-orange-600 dark:group-hover:text-orange-400
          ">
            {title}
          </h3>

          {/* DESCRIPTION */}
          <p className="
            text-xs md:text-sm text-foreground/60
            leading-relaxed line-clamp-2
          ">
            {description}
          </p>

          {/* DATE */}
          {date && (
            <span className="
              text-[11px] text-foreground/40 mt-3
            ">
              {date}
            </span>
          )}
        </div>

        {/* ICON */}
        <div className="
          mt-1 opacity-0
          transition-all duration-300

          group-hover:opacity-100
          group-hover:[transform:translate3d(2px,-2px,0)]
        ">
          <IconArrowUpRight
            size={16}
            className="
              text-foreground/40
              transition-colors duration-200

              group-hover:text-orange-600
              dark:group-hover:text-orange-400
            "
          />
        </div>

      </div>
    </Link>
  )
}
