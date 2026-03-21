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
      className="group/card flex flex-col h-full p-6 rounded-2xl border border-neutral-200 bg-white transition-all duration-300 ease-out hover:border-neutral-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
    >

      {/* TOP ROW — index + arrow */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-neutral-300 transition-colors duration-200 group-hover/card:text-neutral-400">
          {String(index).padStart(2, "0")}
        </span>
        <span className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center transition-all duration-200 group-hover/card:bg-neutral-900 group-hover/card:border-neutral-900">
          <IconArrowUpRight
            size={16}
            stroke={2}
            className="text-neutral-400 transition-colors duration-200 group-hover/card:text-white"
          />
        </span>
      </div>

      {/* TITLE */}
      <h3 className="text-base md:text-lg font-medium leading-snug tracking-tight text-neutral-900 mb-2.5 line-clamp-2 transition-colors duration-200 group-hover/card:text-neutral-600">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 flex-1">
        {description}
      </p>

      {/* BOTTOM — read time indicator */}
      <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-900 group-hover/card:underline underline-offset-4 decoration-neutral-300">
          Read article
        </span>
        <span className="text-[10px] text-neutral-300 tracking-wide">
          Article
        </span>
      </div>

    </Link>
  )
}