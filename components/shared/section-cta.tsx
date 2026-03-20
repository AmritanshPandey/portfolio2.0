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
  asChild?: boolean // 👈 important
}

export function CTA({
  href = "#",
  label,
  variant = "primary",
  icon = "arrow",
  className,
  asChild = false,
}: Props) {

  const Icon =
    icon === "arrow"
      ? IconArrowUpRight
      : icon === "download"
      ? IconDownload
      : null

  // ---------------- PRIMARY / SECONDARY (real links)

  if (variant !== "tertiary" && href && !asChild) {
    return (
      <Link
        href={href}
        className={clsx(
          "group/cta inline-flex items-center gap-2 px-6 py-3 rounded-full",
          variant === "primary"
            ? "bg-black text-white hover:bg-neutral-800"
            : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
          "transition-all duration-200",
          className
        )}
      >
        {label}
        {Icon && (
          <Icon className="transition-transform duration-200 group-hover/cta:translate-x-[3px] group-hover/cta:-translate-y-[3px]" />
        )}
      </Link>
    )
  }

  // ---------------- TERTIARY OR CHILD MODE (NO LINK)

  return (
    <span
      className={clsx(
        "group/cta inline-flex items-center gap-2 text-red-600 font-medium text-sm",
        className
      )}
    >
      <span className="relative">
        {label}
        <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 bg-red-600 transition-all duration-300 group-hover/cta:w-full" />
      </span>

      {Icon && (
        <Icon
          size={16}
          className="transition-transform duration-200 group-hover/cta:translate-x-[3px] group-hover/cta:-translate-y-[3px]"
        />
      )}
    </span>
  )
}