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
      className="
        group/card block h-full rounded-2xl
        focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      "
    >
      <div
        className={clsx(
          "h-full flex bg-card border border-border rounded-2xl overflow-hidden",
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-[2px] hover:border-border/80",
          "hover:shadow-md dark:hover:shadow-lg",
          isFeatured ? "flex-col md:flex-row" : "flex-col",
          isCompact  && "flex-col p-5"
        )}
      >

        {/* IMAGE */}
        {showImage && image && !isCompact && (
          <div
            className={clsx(
              "relative overflow-hidden bg-muted shrink-0",
              isFeatured
                ? "w-full aspect-video md:w-[45%] md:aspect-auto md:min-h-[260px] md:max-h-[320px]"
                : "w-full aspect-[16/7]"
            )}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="
                object-cover
                transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover/card:scale-[1.04]
              "
            />

            {/* Overlay */}
            <div className="
              absolute inset-0
              bg-black/10 dark:bg-black/20
              transition-opacity duration-300
              group-hover/card:opacity-0
            " />
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
            <p className="
              text-[10px] font-medium uppercase tracking-[0.18em]
              text-muted-foreground
            ">
              {category}
            </p>
          )}

          <h3
            className={clsx(
              "font-medium tracking-tight leading-[1.3]",
              "text-foreground transition-colors duration-200",
              "group-hover/card:text-muted-foreground",
              isFeatured ? "text-xl md:text-2xl" :
              isCompact  ? "text-base"            : "text-lg md:text-xl"
            )}
          >
            {title}
          </h3>

          {description && !isCompact && (
            <p className="
              text-muted-foreground text-sm leading-relaxed
            ">
              {description}
            </p>
          )}

          {/* CTA */}
          <div className="
            mt-auto pt-5 border-t border-border
            flex items-center justify-between
          ">
            <span className="
              text-sm font-medium text-foreground
              group-hover/card:underline underline-offset-4
            ">
              {ctaLabel}
            </span>

            <span className="
              w-9 h-9 rounded-full
              border border-border
              flex items-center justify-center
              transition-all duration-200
              group-hover/card:bg-foreground
              group-hover/card:border-foreground
            ">
              <IconArrowUpRight
                size={16}
                stroke={2}
                className="
                  text-muted-foreground
                  transition-colors duration-200
                  group-hover/card:text-background
                "
              />
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}