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
  const isFeatured = variant === "featured"

  const cursorLabelMap: Record<string, string> = {
    "View case study": "View",
    "Read case study": "Read",
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
        className="group/card flex items-center gap-4 py-3.5 rounded-xl px-3 -mx-3 hover:bg-foreground/[0.03] dark:hover:bg-white/[0.03] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {showImage && image && (
          <div className="relative w-16 h-11 rounded-lg overflow-hidden shrink-0 bg-muted">
            <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover/card:scale-[1.04]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {category && <p className="type-meta mb-0.5">{category}</p>}
          <h3 className="text-[14px] font-semibold leading-[1.35] text-foreground line-clamp-1">{title}</h3>
          {metric && <p className="type-caption mt-0.5 line-clamp-1 text-orange-500/60 dark:text-orange-400/50">{metric}</p>}
        </div>
        <IconArrowUpRight size={14} stroke={2} className="shrink-0 text-foreground/20 transition-all duration-500 group-hover/card:text-foreground/50 group-hover/card:-translate-y-[1px] group-hover/card:translate-x-[1px]" />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      data-cursor-card
      data-cursor-label={cursorLabel}
      className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: (index ?? 0) * 0.05, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
        "relative h-full flex flex-col overflow-hidden rounded-2xl",
        "bg-card",
        "border border-border/55",
        // Soft top highlight (inset hairline) + a faint lift shadow read as a
        // pressed, premium surface on dark without any glow or gradient.
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_1px_2px_0_rgba(0,0,0,0.10)]",
        isFeatured ? "min-h-[270px] md:min-h-[300px]" : "min-h-[220px]",
        // Only animate compositor-friendly props (transform/border), not
        // box-shadow transition, which forces a full repaint each frame.
        "transition-[transform,border-color,background-color] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-[2px]",
        "hover:border-foreground/15 hover:bg-foreground/[0.02] dark:hover:border-white/[0.16] dark:hover:bg-white/[0.03]",
      )}>

        {/* Image block */}
        {showImage && image && (
          <div className={clsx("relative overflow-hidden shrink-0", imageHeight)}>

            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
            />

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--card))] opacity-80" />

            {/* Soft top vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent" />

            {/* Index number */}
            {index !== undefined && (
              <span className="absolute top-3 left-3.5 font-mono text-[11px] font-medium text-white/40 tracking-wider select-none">
                {String(index).padStart(2, "0")}
              </span>
            )}

            {/* Arrow */}
            <span className={clsx(
              "absolute top-3 right-3",
              "w-8 h-8 rounded-full",
              "bg-black/20 border border-white/20",
              "flex items-center justify-center",
              "opacity-0 scale-90",
              "group-hover/card:opacity-100 group-hover/card:scale-100",
              "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            )}>
              <IconArrowUpRight size={14} stroke={2} className="text-white transition-transform duration-500 group-hover/card:-translate-y-[1px] group-hover/card:translate-x-[1px]" />
            </span>

          </div>
        )}

        {/* Content block */}
        <div
          className={clsx(
            "relative flex flex-1 flex-col",
            isFeatured
              ? "px-7 pb-7 pt-7 md:px-8 md:pb-8 md:pt-8"
              : "px-6 pb-6 pt-6"
          )}
        >

          {category && (
            <p className="type-meta">{category}</p>
          )}

          <h3
            className={clsx(
              "mt-2.5 text-foreground",
              isFeatured
                ? "type-card-title-featured max-w-[27rem]"
                : "type-card-title"
            )}
          >
            {title}
          </h3>

          {metric && (
            <p
              className={clsx(
                "mt-3 max-w-[44rem] text-foreground/58",
                isFeatured ? "type-card-body-featured" : "type-card-body"
              )}
            >
              {metric}
            </p>
          )}

          {tags && tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="type-caption rounded-full border border-border/55 bg-muted/45 px-2.5 py-1 leading-none text-foreground/55">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA row */}
          <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-5">
            <span className="type-cta text-foreground/50 transition-colors duration-500 group-hover/card:text-foreground/82">
              {ctaLabel}
            </span>
            <IconArrowUpRight
              size={15}
              stroke={2}
              className="text-foreground/32 transition-all duration-500 group-hover/card:text-foreground/80 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px]"
            />
          </div>

        </div>

      </motion.div>
    </Link>
  )
}
