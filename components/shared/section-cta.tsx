"use client"

import { IconArrowUpRight, IconDownload } from "@tabler/icons-react"
import clsx from "clsx"
import Link from "next/link"

type Variant = "primary" | "secondary" | "tertiary"
type Tone = "light" | "dark"

type Props = {
  href?: string
  label: string
  variant?: Variant
  icon?: "arrow" | "download" | "none"
  className?: string
  tone?: Tone
}

export function CTA({
  href = "#",
  label,
  variant = "primary",
  icon = "arrow",
  className,
  tone = "dark",
}: Props) {

  const Icon =
    icon === "arrow"    ? IconArrowUpRight :
    icon === "download" ? IconDownload     : null

  if (variant !== "tertiary" && href) {
    return (
      <Link
        href={href}
        className={clsx(
          "group/cta relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium",
          "overflow-hidden",
          "transition-all duration-300 ease-out",
          "hover:-translate-y-[1px] active:scale-[0.97]",

          // Light tone — on dark backgrounds (hero)
          tone === "light" && variant === "primary" && [
            "bg-white text-neutral-900",
            "shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.15)]",
            "hover:shadow-[0_4px_16px_rgba(255,255,255,0.15)]",
          ],

          tone === "light" && variant === "secondary" && [
            "border border-white/20 text-white/75",
            "hover:border-white/40 hover:text-white",
            "hover:bg-white/[0.06]",
          ],

          // Dark tone — on light backgrounds
          tone === "dark" && variant === "primary" && [
            "bg-neutral-900 text-white",
            "shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]",
            "hover:bg-neutral-800 hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]",
          ],

          tone === "dark" && variant === "secondary" && [
            "border border-neutral-200 text-neutral-600",
            "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
            "hover:border-neutral-300 hover:text-neutral-900 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]",
          ],

          className
        )}
      >
        {/* Shimmer layer — sweeps across on hover */}
        <span
          className={clsx(
            "pointer-events-none absolute inset-0 -translate-x-full",
            "transition-transform duration-500 ease-out group-hover/cta:translate-x-full",
            tone === "light" && variant === "primary" &&
              "bg-gradient-to-r from-transparent via-black/[0.04] to-transparent",
            tone === "dark" && variant === "primary" &&
              "bg-gradient-to-r from-transparent via-white/[0.06] to-transparent",
            tone === "dark" && variant === "secondary" &&
              "bg-gradient-to-r from-transparent via-neutral-900/[0.03] to-transparent",
          )}
          aria-hidden="true"
        />

        <span className="relative">{label}</span>

        {Icon && (
          <Icon
            size={15}
            stroke={2}
            className={clsx(
              "relative shrink-0 transition-all duration-200",
              "group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]",
              tone === "light" && variant === "primary"   && "opacity-50",
              tone === "light" && variant === "secondary" && "opacity-50 group-hover/cta:opacity-70",
              tone === "dark"  && variant === "primary"   && "opacity-50",
              tone === "dark"  && variant === "secondary" && "opacity-40 group-hover/cta:opacity-70",
            )}
          />
        )}
      </Link>
    )
  }

  // TERTIARY — text link, char-by-char underline draw + icon nudge
  return (
    <span
      className={clsx(
        "group/cta inline-flex items-center gap-1.5 text-sm font-medium",
        "text-neutral-900 cursor-pointer",
        className
      )}
    >
      <span className="relative">
        {label}
        {/* Underline draws in from left, erases to right on hover-out */}
        <span className="absolute left-0 -bottom-px h-px w-0 bg-neutral-900 transition-all duration-300 ease-out group-hover/cta:w-full" />
      </span>

      {Icon && (
        <Icon
          size={14}
          stroke={2}
          className={clsx(
            "opacity-40 shrink-0",
            "transition-all duration-200",
            "group-hover/cta:opacity-70",
            "group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]",
          )}
        />
      )}
    </span>
  )
}
