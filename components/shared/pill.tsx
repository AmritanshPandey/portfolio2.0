"use client"

import clsx from "clsx"
import { motion } from "framer-motion"

type Variant = "default" | "soft" | "highlight"
type Size = "sm" | "md"

type Props = {
  children: React.ReactNode
  icon?: React.ReactNode
  variant?: Variant
  size?: Size
  active?: boolean
  onClick?: () => void
  className?: string
}

export function Pill({
  children,
  icon,
  variant = "default",
  size = "sm",
  active = false,
  onClick,
  className,
}: Props) {
  const isInteractive = !!onClick

  const sizes = {
    sm: "text-[11px] px-3 py-1 gap-1.5",
    md: "text-xs px-3.5 py-1.5 gap-2",
  }

  const base = `
    relative inline-flex items-center justify-center rounded-full
    border backdrop-blur-md
    transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
    ${isInteractive ? "cursor-pointer" : ""}
  `

  const variants = {
    default: `
      bg-muted/70
      border-border/70
      text-foreground/90

      /* DARK — STRONGER SURFACE */
      dark:bg-black/[0.05]
      dark:border-white/[0.12]
      dark:text-white/90
    `,

    soft: `
      bg-transparent
      border-border/60
      text-muted-foreground

      /* DARK — STILL READABLE */
      dark:bg-white/[0.04]
      dark:border-white/[0.10]
      dark:text-white/70
    `,

    highlight: `
      bg-orange-500/12
      border-orange-500/25
      text-orange-600

      /* 🔥 DARK — RICH BUT NOT NEON */
      dark:bg-orange-400/[0.18]
      dark:border-orange-400/[0.30]
      dark:text-orange-200
    `,
  }

  const activeStyles = active
    ? `
      bg-orange-500/15
      border-orange-500/30
      text-orange-600

      dark:bg-orange-400/[0.22]
      dark:border-orange-400/[0.35]
      dark:text-orange-200
    `
    : ""

  return (
    <motion.span
      whileTap={isInteractive ? { scale: 0.96 } : undefined}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        activeStyles,
        className,
        isInteractive && "md:hover:-translate-y-[1px]"
      )}
    >

      {/* ✨ INNER HIGHLIGHT (more controlled) */}
      <span className="
        pointer-events-none absolute inset-0 rounded-full
        bg-gradient-to-b from-white/[0.10] to-transparent
        opacity-0 group-hover:opacity-100
        transition-opacity duration-300
      " />

      {/* ✨ SUBTLE GLOW */}
      {isInteractive && (
        <span className="
          pointer-events-none absolute inset-0 rounded-full
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300

          bg-[radial-gradient(80px_40px_at_50%_0%,rgba(249,115,22,0.12),transparent_70%)]
        " />
      )}

      {/* CONTENT */}
      <span className="relative flex items-center gap-inherit">

        {icon && (
          <span className="flex items-center justify-center opacity-80">
            {icon}
          </span>
        )}

        <span>{children}</span>

      </span>

    </motion.span>
  )
}