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
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
        span
      )}
    >
      {/* IMAGE */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
      />

      {/* PERMANENT GRADIENT — title always legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* HOVER VIGNETTE — deepens on hover for readability */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 ease-out" />

      {/* TOP — arrow only, no tags cluttering */}
      <div className="absolute top-4 right-4 z-10">
        <span className="
          w-9 h-9 rounded-full
          bg-white/10 border border-white/15 backdrop-blur-md
          flex items-center justify-center
          opacity-0 scale-75
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-300 ease-out
        ">
          <IconArrowUpRight size={16} stroke={1.75} className="text-white" />
        </span>
      </div>

      {/* BOTTOM CONTENT */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">

        {/* TAGS — small, bottom-left, always visible */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.12] border border-white/[0.1] text-white/60 tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* TITLE — always visible, shifts up on hover */}
        <h3 className="
          text-base md:text-lg font-medium leading-snug tracking-tight text-white
          translate-y-0 group-hover:-translate-y-1
          transition-transform duration-300 ease-out
          mb-0 group-hover:mb-2
        ">
          {title}
        </h3>

        {/* DESCRIPTION — hidden at rest, max-h reveal on hover */}
        <p className="
          text-[13px] text-white/55 leading-relaxed max-w-xs
          max-h-0 overflow-hidden opacity-0
          group-hover:max-h-[80px] group-hover:opacity-100
          transition-all duration-400 ease-out
          line-clamp-2
        ">
          {description}
        </p>

      </div>

      {/* INSET BORDER */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06] group-hover:ring-white/[0.12] transition-colors duration-300" />

    </Link>
  )
}