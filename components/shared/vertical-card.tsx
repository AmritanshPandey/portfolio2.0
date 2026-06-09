"use client"

import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { motion } from "framer-motion"
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
  metric?: string
  index?: number
  /** Tailwind height class for the image area. Defaults to "h-44". */
  imageHeight?: string
  tags?: string[]
}

export function VerticalCard({
  href,
  image,
  title,
  category,
  ctaLabel = "View case study",
  variant = "default",
  showImage = true,
  metric,
  index,
  imageHeight = "h-44",
  tags,
}: Props) {

  const isCompact = variant === "compact"

  const cursorLabelMap: Record<string, string> = {
    "View case study": "View",
    "Explore": "Explore",
    "Read article": "Read",
  }
  const cursorLabel = cursorLabelMap[ctaLabel] || "View"

  if (isCompact) {
    return (
      <Link
        href={href}
        data-cursor-card
        data-cursor-label={cursorLabel}
        className="group/card flex items-center gap-4 py-3.5 rounded-xl px-3 -mx-3 hover:bg-foreground/[0.03] dark:hover:bg-white/[0.03] transition-colors duration-200"
      >
        {showImage && image && (
          <div className="relative w-16 h-11 rounded-lg overflow-hidden shrink-0 bg-muted">
            <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover/card:scale-[1.06]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {category && <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/35 font-semibold mb-0.5">{category}</p>}
          <h3 className="text-[14px] font-semibold tracking-tight text-foreground line-clamp-1">{title}</h3>
          {metric && <p className="text-[11px] text-orange-500/60 dark:text-orange-400/50 mt-0.5 line-clamp-1">{metric}</p>}
        </div>
        <IconArrowUpRight size={14} stroke={2} className="shrink-0 text-foreground/20 group-hover/card:text-foreground/50 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px] transition-all duration-200" />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      data-cursor-card
      data-cursor-label={cursorLabel}
      className="group/card block rounded-2xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: (index ?? 0) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
        "relative h-full flex flex-col rounded-2xl overflow-hidden",
        "bg-card",
        "border border-border/70",
        "shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none",
        "transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-[4px]",
        "hover:border-orange-500/30 dark:hover:border-orange-400/25",
        "hover:shadow-[0_18px_50px_-12px_rgba(249,115,22,0.18)]",
        "dark:hover:shadow-[0_22px_60px_-14px_rgba(249,115,22,0.22)]",
      )}>

        {/* ── SOFT EMBER GLOW — subtle bloom from the bottom on hover */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-[radial-gradient(420px_200px_at_50%_120%,rgba(249,115,22,0.10),transparent_70%)]" />

        {/* ── IMAGE BLOCK */}
        {showImage && image && (
          <div className={clsx("relative overflow-hidden shrink-0", imageHeight)}>

            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.05]"
            />

            {/* Bottom gradient — bleeds image into card body */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--card))] opacity-80" />

            {/* Soft top vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

            {/* Index number — top-left */}
            {index !== undefined && (
              <span className="absolute top-3 left-3.5 font-mono text-[11px] font-medium text-white/40 tracking-wider select-none">
                {String(index).padStart(2, "0")}
              </span>
            )}

            {/* Arrow — top-right, appears on hover */}
            <span className={clsx(
              "absolute top-3 right-3",
              "w-8 h-8 rounded-full",
              "bg-white/10 border border-white/20 backdrop-blur-sm",
              "flex items-center justify-center",
              "opacity-0 scale-90",
              "group-hover/card:opacity-100 group-hover/card:scale-100",
              "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            )}>
              <IconArrowUpRight size={14} stroke={2} className="text-white transition-transform duration-300 group-hover/card:-translate-y-[1px] group-hover/card:translate-x-[1px]" />
            </span>

          </div>
        )}

        {/* ── CONTENT BLOCK */}
        <div className={clsx("flex flex-col flex-1 px-4 pb-4 gap-2.5", (!showImage || !image) ? "pt-4" : "pt-3")}>

          {category && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
              {category}
            </p>
          )}

          <h3 className="text-[15px] md:text-[17px] font-semibold tracking-[-0.02em] leading-[1.3] text-foreground line-clamp-2 group-hover/card:text-orange-600 dark:group-hover/card:text-orange-400 transition-colors duration-200">
            {title}
          </h3>

          {metric && (
            <p className="text-[12px] text-foreground/55 leading-[1.55] line-clamp-2 mt-auto pt-1">
              {metric}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
              {tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-muted border border-border/60 text-[10px] font-medium text-foreground/50 leading-relaxed">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── CTA ROW */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-border/50">
            <span className="text-[12px] font-medium text-foreground/40 group-hover/card:text-orange-600 dark:group-hover/card:text-orange-400 transition-colors duration-200">
              {ctaLabel}
            </span>
            <IconArrowUpRight
              size={14}
              stroke={2}
              className="text-foreground/25 group-hover/card:text-orange-600 dark:group-hover/card:text-orange-400 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px] transition-all duration-200"
            />
          </div>

        </div>

      </motion.div>
    </Link>
  )
}
