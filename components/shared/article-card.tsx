"use client"

import Link from "next/link"
import { CTA } from "@/components/shared/section-cta"

type Props = {
  index: number
  title: string
  description: string
  href: string
}

export function ArticleCard({
  index,
  title,
  description,
  href,
}: Props) {

  return (
    <Link
      href={href}
      className="
        group/card flex flex-col h-full
        p-6 rounded-2xl border border-neutral-200
        bg-white/40 backdrop-blur-sm
        transition-all duration-200 ease-out
        hover:border-neutral-300
        hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]
        hover:-translate-y-[2px]
      "
    >

      {/* NUMBER */}
      <span className="
        text-xs font-medium text-neutral-400 mb-4
        transition-colors duration-200
        group-hover/card:text-red-600
      ">
        {String(index).padStart(2, "0")}
      </span>

      {/* TITLE */}
      <h3 className="
        text-lg md:text-xl font-semibold
        leading-snug tracking-tight
        mb-2
        transition-colors duration-200
        group-hover/card:text-red-600
        line-clamp-2
      ">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="
        text-neutral-600 text-sm
        leading-[1.6]
        mb-5
        line-clamp-3
      ">
        {description}
      </p>

      {/* CTA */}
      <div className="mt-auto group/cta">
        <CTA
          href={href}
          label="Read Article"
          variant="tertiary"
        />
      </div>

    </Link>
  )
}