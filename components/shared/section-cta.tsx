"use client"

import { IconArrowUpRight, IconDownload } from "@tabler/icons-react"
import clsx from "clsx"
import Link from "next/link"

type Variant = "primary" | "secondary" | "tertiary"

type Props = {
  href?: string
  label: string
  variant?: Variant
  icon?: "arrow" | "download" | "none"
  className?: string
}

export function CTA({
  href = "#",
  label,
  variant = "primary",
  icon = "arrow",
  className,
}: Props) {

  const Icon =
    icon === "arrow"    ? IconArrowUpRight :
    icon === "download" ? IconDownload     : null

  // ───────────── PRIMARY + SECONDARY ─────────────

  if (variant !== "tertiary" && href) {
    return (
      <Link
        href={href}
        className={clsx(
          "group/cta relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium",
          "overflow-hidden",
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-[1px] active:scale-[0.97]",

          // PRIMARY
          variant === "primary" && [
            "bg-primary text-primary-foreground",
            "shadow-sm",
            "hover:shadow-md",
          ],

          // SECONDARY
          variant === "secondary" && [
            "border border-border text-foreground/80",
            "hover:border-border/80 hover:text-foreground",
            "hover:bg-muted/40",
          ],

          className
        )}
      >
        {/* Subtle shimmer */}
        <span
          className="
            pointer-events-none absolute inset-0 -translate-x-full
            transition-transform duration-500 ease-out
            group-hover/cta:translate-x-full
            bg-gradient-to-r from-transparent via-white/[0.06] to-transparent
            dark:via-white/[0.08]
          "
        />

        <span className="relative">{label}</span>

        {Icon && (
          <Icon
            size={15}
            stroke={2}
            className="
              relative shrink-0 opacity-50
              transition-all duration-200
              group-hover/cta:opacity-80
              group-hover/cta:translate-x-[2px]
              group-hover/cta:-translate-y-[2px]
            "
          />
        )}
      </Link>
    )
  }

  // ───────────── TERTIARY ─────────────

  return (
    <span
      className={clsx(
        "group/cta inline-flex items-center gap-1.5 text-sm font-medium cursor-pointer",
        "text-foreground",
        className
      )}
    >
      <span className="relative">
        {label}
        <span className="
          absolute left-0 -bottom-px h-px w-0 bg-foreground
          transition-all duration-300 ease-out
          group-hover/cta:w-full
        " />
      </span>

      {Icon && (
        <Icon
          size={14}
          stroke={2}
          className="
            opacity-40 shrink-0
            transition-all duration-200
            group-hover/cta:opacity-70
            group-hover/cta:translate-x-[2px]
            group-hover/cta:-translate-y-[2px]
          "
        />
      )}
    </span>
  )
}