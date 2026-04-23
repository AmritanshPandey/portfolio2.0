"use client"

import { IconArrowUpRight, IconDownload } from "@tabler/icons-react"
import clsx from "clsx"
import Link from "next/link"
import { useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { scrollToSection } from "@/lib/scroll"
import { saveScroll } from "@/lib/scroll-manager"

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
  const router = useRouter()
  const pathname = usePathname()

  // Removed refs for magnetic hover effect

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
      saveScroll(pathname)

      if (pathname === "/") {
        scrollToSection(id)
      } else {
        router.push(`/#${id}`)
      }
    }
  }



  // ───────── PRIMARY + SECONDARY ─────────
  if (variant !== "tertiary" && href) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={clsx(
          "group/cta relative flex items-center justify-center",
          "w-full px-5 py-3 rounded-full text-[15px] font-medium",
          "overflow-hidden",
          "active:scale-[0.97]",
          "transition-all duration-300",

          // PRIMARY
          variant === "primary" && [
            "bg-orange-600 text-white",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_18px_rgba(255,90,0,0.18)]",
            "hover:bg-orange-500",
            "hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_26px_rgba(255,90,0,0.28)]",
            "active:scale-[0.97]",
          ],

          // SECONDARY
          variant === "secondary" && [
            "border border-border/60",
            "bg-background/50 backdrop-blur-md",
            "text-foreground/70",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
            "hover:text-foreground",
            "hover:border-orange-500/40",
            "hover:bg-background/70",
            "hover:shadow-[0_6px_18px_rgba(255,90,0,0.12)]",
            "hover:-translate-y-[1px]",
            "dark:bg-white/[0.04]",
            "dark:border-white/[0.08]",
            "dark:hover:bg-white/[0.06]",
          ],

          // FOCUS
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40",

          className
        )}
      >
        {/* shimmer (subtle) */}
        <span className="
          pointer-events-none absolute inset-0 -translate-x-full
          transition-transform duration-500 ease-out
          group-hover/cta:translate-x-full
          bg-gradient-to-r from-transparent via-white/[0.05] to-transparent
        " />

        {/* INNER */}
        <span
          className="relative flex items-center gap-2 transition-all duration-200 group-hover/cta:translate-x-[1px] group-hover/cta:-translate-y-[1px]"
        >
          {label}

          {Icon && (
            <Icon
              size={15}
              stroke={2}
              className="
                opacity-80
                transition-all duration-200
                group-hover/cta:translate-x-[1.5px]
                group-hover/cta:-translate-y-[1.5px]
              "
            />
          )}
        </span>
      </Link>
    )
  }

  // ───────── TERTIARY ─────────
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={clsx(
        "group/cta inline-flex items-center gap-1.5 text-sm font-medium cursor-pointer",
        "text-foreground/70 hover:text-foreground transition",
        className
      )}
    >
      <span className="relative">
        {label}
        <span className="
          absolute left-0 -bottom-px h-px w-0
          bg-orange-600 dark:bg-orange-400
          transition-all duration-300 ease-out
          group-hover/cta:w-full
        " />
      </span>

      {Icon && (
        <Icon
          size={14}
          stroke={2}
          className="
            opacity-50
            transition-all duration-200
            group-hover/cta:opacity-100
            group-hover/cta:translate-x-[1.5px]
            group-hover/cta:-translate-y-[1.5px]
          "
        />
      )}
    </span>
  )
}