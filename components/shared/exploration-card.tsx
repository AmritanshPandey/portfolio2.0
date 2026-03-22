"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"

type Props = {
  title: string
  description: string
  image: string
  href: string
  tags: string[]
  span?: string
}

export function ExplorationCard({
  title,
  description,
  image,
  href,
  tags,
  span,
}: Props) {
  return (
    <Link
      href={href}
      className={clsx(
        "group relative isolate rounded-2xl overflow-hidden block",
        "aspect-square md:aspect-auto",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        span
      )}
    >
      {/* IMAGE */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="
          object-cover object-center
          transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-[1.04]
        "
      />

      {/* BASE GRADIENT */}
      <div className="
        absolute inset-0
        bg-gradient-to-t
        from-black/70 via-black/20 to-transparent
        dark:via-black/10
      " />

      {/* HOVER VIGNETTE */}
      <div className="
        absolute inset-0
        bg-black/0
        group-hover:bg-black/25
        dark:group-hover:bg-black/35
        transition-colors duration-400 ease-out
      " />

      {/* ACTION */}
      <div className="absolute top-4 right-4 z-10">
        <span className="
          w-9 h-9 rounded-full
          bg-background/70 border border-border backdrop-blur-md
          flex items-center justify-center
          opacity-0 scale-90
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]
        ">
          <IconArrowUpRight size={16} className="text-foreground" />
        </span>
      </div>

      {/* CONTENT */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">

        {/* TAGS */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="
                text-[10px] font-medium px-2 py-0.5 rounded-full
                bg-background/60 border border-border
                text-foreground/70 backdrop-blur-sm
              "
            >
              {tag}
            </span>
          ))}
        </div>

        {/* TITLE */}
        <h3 className="
          text-base md:text-lg font-medium leading-snug tracking-tight
          text-white
        ">
          {title}
        </h3>

        {/* DESCRIPTION (STABLE — NO SHIFT) */}
        <div className="h-[38px] mt-1">
          <p className="
            text-[13px] text-white/70 leading-relaxed max-w-xs
            opacity-60 group-hover:opacity-100
            transition-opacity duration-300 ease-out
            line-clamp-2
          ">
            {description}
          </p>
        </div>

      </div>

      {/* BORDER */}
      <div className="
        absolute inset-0 rounded-2xl
        ring-1 ring-inset ring-border/40
        group-hover:ring-border/70
        transition-colors duration-300
      " />
    </Link>
  )
}