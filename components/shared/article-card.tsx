"use client"

import Link from "next/link"
import Image from "next/image"
import { IconArrowUpRight } from "@tabler/icons-react"

type Props = {
  index: number
  title: string
  description: string
  href: string
  image: string
}

export function ArticleCard({ title, description, href, image }: Props) {
  return (
    <Link
      href={href}
      className="group block"
      data-cursor-card
      data-cursor-label="Read"
      data-cursor-cta
    >
      <div
        className="
          flex items-start gap-5 p-5 rounded-2xl

          bg-transparent border border-transparent

          transition-all duration-300 ease-out
          hover:bg-foreground/[0.04] dark:hover:bg-white/[0.03]

          hover:[transform:translate3d(0,-1.5px,0)]
        "
      >

        {/* IMAGE (1:1 aspect ratio) */}
        <div className="
          w-20 md:w-24 aspect-square
          rounded-xl overflow-hidden
          bg-muted flex-shrink-0
        ">
          <Image
            src={image}
            alt={title}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="
          flex flex-col flex-1 min-w-0

          transition-opacity duration-300
          group-hover:opacity-95
        ">

          {/* META */}
          <span className="
            text-[10px] font-semibold tracking-[0.18em] uppercase
            text-foreground/50 mb-1
          ">
            META
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
          <span className="
            text-[11px] text-foreground/40 mt-3
          ">
            April 8, 2026
          </span>
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