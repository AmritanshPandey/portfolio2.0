"use client"

import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { IconArrowUpRight } from "@tabler/icons-react"

type Variant = "default" | "compact" | "featured"

type Props = {
  href: string
  image?: string
  title: string
  description?: string
  category?: string
  ctaLabel?: string
  variant?: Variant
  showImage?: boolean
}

export function VerticalCard({
  href,
  image,
  title,
  description,
  category,
  ctaLabel = "View case study",
  variant = "default",
  showImage = true,
}: Props) {

  const isCompact  = variant === "compact"
  const isFeatured = variant === "featured"

  return (
    <Link
      href={href}
      className={clsx(
        "group/card block h-full rounded-2xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
      )}
    >
      <div
        className={clsx(
          "h-full flex bg-white border border-neutral-200 rounded-2xl overflow-hidden",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
          isFeatured ? "flex-col md:flex-row" : "flex-col",
          isCompact  && "flex-col p-5"
        )}
      >

        {/* IMAGE */}
        {showImage && image && !isCompact && (
          <div
            className={clsx(
              "relative overflow-hidden bg-neutral-100 shrink-0",
              isFeatured
                ? "w-full aspect-video md:w-[45%] md:aspect-auto md:min-h-[260px] md:max-h-[320px]"
                : "w-full aspect-[16/7]"
            )}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
            />
            {/* Subtle image darkening at rest, lifts on hover */}
            <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover/card:opacity-0" />
          </div>
        )}

        {/* CONTENT */}
        <div
          className={clsx(
            "flex flex-col flex-1",
            isCompact ? "gap-3" : "p-6 gap-4"
          )}
        >
          {category && (
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              {category}
            </p>
          )}

          <h3
            className={clsx(
              "font-medium tracking-tight text-neutral-900 leading-[1.3]",
              "transition-colors duration-200 group-hover/card:text-neutral-600",
              isFeatured ? "text-xl md:text-2xl" :
              isCompact  ? "text-base"            : "text-lg md:text-xl"
            )}
          >
            {title}
          </h3>

          {description && !isCompact && (
            <p className="text-neutral-400 text-sm leading-relaxed">
              {description}
            </p>
          )}

          {/* CTA row — no nested <a>, parent Link handles it */}
          <div className="mt-auto pt-5 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-900 group-hover/card:underline underline-offset-4 decoration-neutral-300">
              {ctaLabel}
            </span>
            <span className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center transition-all duration-200 group-hover/card:bg-neutral-900 group-hover/card:border-neutral-900">
              <IconArrowUpRight
                size={16}
                stroke={2}
                className="text-neutral-400 transition-colors duration-200 group-hover/card:text-white"
              />
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}