"use client"

import { IconArrowUpRight, IconDownload } from "@tabler/icons-react"
import clsx from "clsx"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { scrollToSection } from "@/lib/scroll"

type Variant = "primary" | "secondary" | "tertiary"

type Props = {
  href?: string
  label: string
  variant?: Variant
  icon?: "arrow" | "download" | "none"
  className?: string
  /** Open in a new tab as a plain link. Use for files and other sites: a
   *  Next.js <Link> prefetches its target as a route, and a file isn't one, so
   *  every visit fetched a 404 page for /resume.pdf in the background. */
  newTab?: boolean
}

export function CTA({
  href = "#",
  label,
  variant = "primary",
  icon = "arrow",
  className,
  newTab = false,
}: Props) {
  const router   = useRouter()
  const pathname = usePathname()

  const Icon =
    icon === "arrow" ? IconArrowUpRight :
      icon === "download" ? IconDownload :
        null

  // ───── NAVIGATION ─────
  const handleClick = (e: React.MouseEvent) => {
    if (!href) return
    if (href.startsWith("#")) {
      e.preventDefault()
      const id = href.replace("#", "")
      if (pathname === "/") {
        scrollToSection(id)
      } else {
        router.push(`/#${id}`)
      }
    }
  }

  // ───────── PRIMARY + SECONDARY ─────────
  // Ledger controls: a solid ink rectangle and a ruled outline. Hover answers
  // in ultramarine (primary) or by inverting (secondary); press sinks 1px.
  if (variant !== "tertiary" && href) {
    const Root = (newTab ? "a" : Link) as typeof Link
    return (
      <Root
        href={href}
        onClick={handleClick}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={clsx(variant === "primary" ? "btn-ink" : "btn-line", "w-full sm:w-auto", className)}
      >
        {label}
        {Icon && <Icon size={16} stroke={2} aria-hidden className="btn-arrow" />}
      </Root>
    )
  }

  // ───────── TERTIARY ─────────
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick(e as unknown as React.MouseEvent)
        }
      }}
      className={clsx(
        "group/cta link-underline inline-flex cursor-pointer items-center gap-1.5 text-[15px] font-semibold text-foreground",
        className
      )}
    >
      {label}
      {Icon && (
        <Icon
          size={15}
          stroke={2}
          aria-hidden
          className="transition-transform duration-200 group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]"
        />
      )}
    </span>
  )
}
