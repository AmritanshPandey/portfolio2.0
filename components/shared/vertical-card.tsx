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

  const isCompact = variant === "compact"
  const isFeatured = variant === "featured"

  const cursorLabelMap: Record<string, string> = {
    "View case study": "View",
    "Explore": "Explore",
    "Read article": "Read",
  }

  const cursorLabel = cursorLabelMap[ctaLabel] || "View"

  return (
    <Link
      href={href}
      data-cursor-card
      data-cursor-label={cursorLabel}
      className="group/card block h-full rounded-2xl"
    >
      <div
        className={clsx(
          "relative h-full flex rounded-2xl overflow-hidden",

          /* ✨ SURFACE (lighter dark mode) */
          "bg-card",
          "dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-white/[0.01]",

          "border border-border",

          isFeatured && [
            "border-border/80",
            "shadow-[0_10px_40px_rgba(0,0,0,0.06)]",
            "dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
          ],

          /* TOP EDGE */
          "before:absolute before:inset-x-0 before:top-0 before:h-px",
          "before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent",
          "dark:before:via-white/20",

          /* INTERACTION */
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-[2px] hover:translate-x-[1px]",
          "hover:border-border/80",
          "hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
          "dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]",

          isFeatured ? "flex-col md:flex-row" : "flex-col",
          isCompact && "p-5"
        )}
      >

        {/* ✨ CLEAN ORANGE GLOW */}
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 rounded-2xl overflow-hidden",
            "transition-opacity duration-500",

            isFeatured
              ? `
                opacity-100
                bg-[radial-gradient(420px_220px_at_0%_100%,rgba(255,90,0,0.10),transparent_60%)]
                dark:bg-[radial-gradient(420px_220px_at_0%_100%,rgba(255,140,60,0.14),transparent_60%)]
              `
              : `
                opacity-0 group-hover/card:opacity-100
                bg-[radial-gradient(300px_160px_at_0%_100%,rgba(255,90,0,0.08),transparent_60%)]
                dark:bg-[radial-gradient(300px_160px_at_0%_100%,rgba(255,140,60,0.12),transparent_60%)]
              `
          )}
        />

        {/* ✨ INNER LIGHT */}
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-400",

            isFeatured
              ? `
                opacity-60
                bg-[radial-gradient(240px_140px_at_100%_0%,rgba(255,255,255,0.06),transparent_70%)]
                dark:bg-[radial-gradient(240px_140px_at_100%_0%,rgba(255,255,255,0.10),transparent_70%)]
              `
              : `
                opacity-0 group-hover/card:opacity-100
                bg-[radial-gradient(200px_120px_at_10%_100%,rgba(255,255,255,0.05),transparent_70%)]
                dark:bg-[radial-gradient(200px_120px_at_10%_100%,rgba(255,255,255,0.07),transparent_70%)]
              `
          )}
        />

        {/* FEATURED WASH (cleaner) */}
        {isFeatured && (
          <div className="
            pointer-events-none absolute inset-0
            bg-gradient-to-br from-orange-600/[0.04] to-transparent
            dark:from-orange-400/[0.06]
          " />
        )}

        {/* IMAGE */}
        {showImage && image && !isCompact && (
          <div
            className={clsx(
              "relative overflow-hidden bg-muted shrink-0",
              isFeatured
                ? "w-full aspect-video md:w-[45%] md:min-h-[260px]"
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

            {/* overlay (balanced) */}
            <div className="
              absolute inset-0
              bg-gradient-to-t
              from-black/20 via-black/5 to-transparent
              dark:from-black/35
              opacity-80 group-hover/card:opacity-60
              transition-opacity duration-300
            " />
          </div>
        )}

        {/* CONTENT */}
        <div
          className={clsx(
            "relative flex flex-col flex-1",
            "transition-transform duration-300",
            "group-hover/card:translate-y-[-1px] group-hover/card:translate-x-[1px]",
            isCompact ? "gap-3" : "p-6 gap-4"
          )}
        >

          <div className="flex flex-col gap-2">

            {category && (
              <p className="
                text-[10px] font-medium uppercase tracking-[0.18em]
                text-foreground/50
              ">
                {category}
              </p>
            )}

            <h3 className="
              text-lg md:text-xl font-medium tracking-tight leading-[1.25]
              text-foreground
            ">
              {title}
            </h3>

          </div>

          {description && !isCompact && (
            <p className="
              text-foreground/70 text-sm leading-relaxed
            ">
              {description}
            </p>
          )}

          {/* CTA */}
          <div className="
            mt-auto pt-5 border-t border-border/60
            flex items-center justify-between
          ">

            <span className="
              text-sm font-medium text-foreground/80
              transition-all duration-200

              group-hover/card:text-orange-600
              dark:group-hover/card:text-orange-400

              group-hover/card:translate-x-[2px]
            ">
              {ctaLabel}
            </span>

            <span className="
              w-10 h-10 rounded-full flex items-center justify-center
              border border-border

              transition-all duration-300

              group-hover/card:border-orange-600/40
              dark:group-hover/card:border-orange-400/40

              group-hover/card:bg-orange-600/10
              dark:group-hover/card:bg-orange-400/10
            ">
              <IconArrowUpRight
                size={16}
                stroke={2}
                className="
                  text-foreground/60
                  transition-all duration-300

                  group-hover/card:text-orange-600
                  dark:group-hover/card:text-orange-400

                  group-hover/card:-translate-y-[2px]
                  group-hover/card:translate-x-[2px]
                "
              />
            </span>

          </div>

        </div>

      </div>
    </Link>
  )
}