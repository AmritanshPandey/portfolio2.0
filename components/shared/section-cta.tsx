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

  const containerRef = useRef<HTMLAnchorElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  const Icon =
    icon === "arrow"    ? IconArrowUpRight :
    icon === "download" ? IconDownload     : null

  // ───── NAVIGATION HANDLER ─────
  const handleClick = (e: React.MouseEvent) => {
    if (!href) return

    // internal section
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

  // ───── MAGNETIC (INNER ONLY) ─────
  const handleMove = (e: React.MouseEvent) => {
    if (variant !== "primary" || !containerRef.current || !innerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    const strength = 0.22
    const max = 10

    const moveX = Math.max(Math.min(x * strength, max), -max)
    const moveY = Math.max(Math.min(y * strength, max), -max)

    innerRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`
  }

  const handleLeave = () => {
    if (!innerRef.current) return

    innerRef.current.style.transform = "translate(0px, 0px)"
    innerRef.current.style.transition =
      "transform 0.45s cubic-bezier(0.22,1,0.36,1)"
  }

  // ───────── PRIMARY + SECONDARY ─────────
  if (variant !== "tertiary" && href) {
    return (
      <Link
        ref={containerRef}
        href={href}
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={clsx(
          "group/cta relative flex items-center justify-center",
          "w-full px-5 py-2.5 rounded-full text-sm font-medium",
          "overflow-hidden",
          "active:scale-[0.97]",

          // PRIMARY
          variant === "primary" && [
            "bg-orange-600 text-white",
            "shadow-[0_6px_18px_rgba(255,90,0,0.18)]",
            "hover:bg-orange-500",
            "hover:shadow-[0_12px_30px_rgba(255,90,0,0.28)]",
          ],

          // SECONDARY
          variant === "secondary" && [
            "border border-border text-foreground/80 bg-background/60 backdrop-blur",
            "hover:border-orange-500/40",
            "hover:text-foreground",
            "hover:bg-muted/40",
          ],

          className
        )}
      >

        {/* shimmer */}
        <span className="
          pointer-events-none absolute inset-0 -translate-x-full
          transition-transform duration-500 ease-out
          group-hover/cta:translate-x-full
          bg-gradient-to-r from-transparent via-white/[0.08] to-transparent
          dark:via-white/[0.12]
        " />

        {/* INNER (magnetic layer) */}
        <span
          ref={innerRef}
          className="relative flex items-center gap-2 transition-transform duration-200"
        >
          {label}

          {Icon && (
            <Icon
              size={15}
              stroke={2}
              className="
                opacity-80
                transition-all duration-200
                group-hover/cta:translate-x-[2px]
                group-hover/cta:-translate-y-[2px]
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
      onClick={handleClick}
      className={clsx(
        "group/cta inline-flex items-center gap-1.5 text-sm font-medium cursor-pointer",
        "text-foreground/80",
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
            group-hover/cta:translate-x-[2px]
            group-hover/cta:-translate-y-[2px]
          "
        />
      )}
    </span>
  )
}