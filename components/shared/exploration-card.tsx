"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"

type Status = "Concept" | "In Development" | "Live"

type Props = {
  title: string
  description: string
  image: string
  href: string
  tags: string[]
  status?: Status
}

const statusConfig: Record<Status, { dot: string; label: string }> = {
  "Concept":        { dot: "bg-amber-400",  label: "Concept" },
  "In Development": { dot: "bg-sky-400 animate-pulse",    label: "In Development" },
  "Live":           { dot: "bg-emerald-400 animate-pulse", label: "Live" },
}

export function ExplorationCard({
  title,
  description,
  image,
  href,
  tags,
  status,
}: Props) {
  const sc = status ? statusConfig[status] : null

  return (
    <Link
      href={href}
      data-cursor-card
      data-cursor-label="Explore"
      data-cursor-cta
      className={clsx(
        "group relative isolate rounded-2xl overflow-hidden block",
        "w-full h-full",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

      {/* TOP SHADOW — anchors top badges */}
      <div className="
        absolute inset-0
        bg-gradient-to-b
        from-black/40 via-transparent to-transparent
      " />

      {/* BASE GRADIENT — content anchor at bottom */}
      <div className="
        absolute inset-0
        bg-gradient-to-t
        from-black/80 via-black/30 to-transparent
      " />

      {/* HOVER AMBIENT GLOW */}
      <div className="
        absolute inset-0 pointer-events-none
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        bg-[radial-gradient(260px_150px_at_0%_100%,rgba(255,90,0,0.10),transparent_60%)]
      " />

      {/* HOVER VIGNETTE */}
      <div className="
        absolute inset-0
        bg-black/0 group-hover:bg-black/10
        transition-colors duration-500
      " />

      {/* HOVER BORDER HIGHLIGHT */}
      <div className="
        absolute inset-0 rounded-2xl
        ring-1 ring-inset ring-white/10
        group-hover:ring-white/20
        transition-colors duration-300
      " />

      {/* ── TOP ROW: status badge + CTA icon ── */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">

        {/* STATUS BADGE */}
        {sc && (
          <span className="
            flex items-center gap-1.5
            px-2.5 py-1 rounded-full
            bg-black/40 backdrop-blur-md
            border border-white/[0.12]
            text-[11px] font-medium text-white/80 leading-none
          ">
            <span className={clsx("w-[6px] h-[6px] rounded-full flex-shrink-0", sc.dot)} />
            {sc.label}
          </span>
        )}

        {/* CTA ICON */}
        <span className="
          ml-auto
          w-9 h-9 rounded-full
          bg-black/40 border border-white/[0.12] backdrop-blur-md
          flex items-center justify-center
          opacity-0 scale-90
          group-hover:opacity-100 group-hover:scale-100
          transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ">
          <IconArrowUpRight
            size={16}
            stroke={1.75}
            className="
              text-white
              transition-transform duration-300
              group-hover:-translate-y-[1.5px] group-hover:translate-x-[1.5px]
            "
          />
        </span>
      </div>

      {/* ── BOTTOM CONTENT ── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">

        {/* TITLE */}
        <h3 className="type-card-title mb-2 text-white">
          {title}
        </h3>

        {/* DESCRIPTION — hidden by default, revealed on hover */}
        <div className="
          overflow-hidden
          max-h-0 opacity-0
          group-hover:max-h-[96px] group-hover:opacity-100
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          mb-0 group-hover:mb-3
        ">
          <p className="type-card-body line-clamp-3 text-white/70">
            {description}
          </p>
        </div>

        {/* TAGS — always-dark glass pills, correct over any background */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="
                px-2.5 py-0.5 rounded-full
                bg-white/[0.10] border border-white/[0.12]
                type-caption text-white/75
                backdrop-blur-sm
              "
            >
              {tag}
            </span>
          ))}
        </div>

      </div>

    </Link>
  )
}
