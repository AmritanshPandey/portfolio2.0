"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"
import { Pill } from "@/components/shared/pill"

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
      data-cursor-card
      data-cursor-label="Explore"
      data-cursor-cta
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
        className="
          object-cover object-center
          transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-[1.04]
        "
      />

      {/* ✨ TOP BALANCE (fix washed look) */}
      <div className="
        absolute inset-0
        bg-gradient-to-b
        from-black/30 via-transparent to-transparent
      " />

      {/* BASE GRADIENT (stronger anchor) */}
      <div className="
        absolute inset-0
        bg-gradient-to-t
        from-black/75 via-black/25 to-transparent
      " />

      {/* ✨ CLEAN ORANGE GLOW (fixed color) */}
      <div className="
        absolute inset-0 pointer-events-none
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500

        bg-[radial-gradient(240px_140px_at_0%_100%,rgba(255,90,0,0.12),transparent_60%)]
      " />

      {/* ✨ INNER LIGHT */}
      <div className="
        absolute inset-0 pointer-events-none
        opacity-0 group-hover:opacity-100
        transition-opacity duration-400

        bg-[radial-gradient(180px_100px_at_10%_100%,rgba(255,255,255,0.06),transparent_70%)]
      " />

      {/* HOVER VIGNETTE (reduced heaviness) */}
      <div className="
        absolute inset-0
        bg-black/0
        group-hover:bg-black/15
        transition-colors duration-400
      " />

      {/* CTA ICON */}
      <div className="absolute top-4 right-4 z-10">
        <span className="
          w-9 h-9 rounded-full
          bg-background/70 border border-border backdrop-blur-md
          flex items-center justify-center

          opacity-0 scale-95
          group-hover:opacity-100 group-hover:scale-100

          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ">
          <IconArrowUpRight
            size={16}
            stroke={2}
            className="
              text-foreground
              transition-transform duration-300
              group-hover:-translate-y-[1.5px]
              group-hover:translate-x-[1.5px]
            "
          />
        </span>
      </div>

      {/* CONTENT */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, i) => (
            <Pill
              key={i}
              size="sm"
              className="
                bg-white/10 text-white border-white/20
                backdrop-blur-md
              "
            >
              {tag}
            </Pill>
          ))}
        </div>

        {/* TITLE */}
        <h3 className="
          text-base md:text-lg font-medium leading-snug tracking-tight
          text-white
        ">
          {title}
        </h3>

        {/* DESCRIPTION */}
        <div className="mt-1">
          <p className="
  text-[14px] text-white/75 leading-relaxed max-w-[400px]

  line-clamp-2 md:line-clamp-3

  transition-all duration-300
  group-hover:text-white
">
            {description}
          </p>
        </div>

      </div>

      {/* BORDER (cleaner) */}
      <div className="
        absolute inset-0 rounded-2xl
        ring-1 ring-inset ring-white/10
        group-hover:ring-white/20
        transition-colors duration-300
      " />

    </Link>
  )
}