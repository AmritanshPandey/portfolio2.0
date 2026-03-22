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

  // ─── SIZE ─────────────────
  const sizes = {
    sm: "text-[11px] px-3 py-1 gap-1.5",
    md: "text-xs px-3.5 py-1.5 gap-2",
  }

  // ─── BASE ─────────────────
  const base = `
    inline-flex items-center justify-center rounded-full
    border backdrop-blur-sm

    transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]

    ${isInteractive ? "cursor-pointer" : ""}
  `

  // ─── VARIANTS ─────────────
  const variants = {
    default: `
      bg-muted/60
      border-border/60
      text-foreground/80

      ${isInteractive ? "hover:border-orange-500/30" : ""}
    `,

    soft: `
      bg-transparent
      border-border/50
      text-muted-foreground

      ${isInteractive ? "hover:text-foreground hover:border-border" : ""}
    `,

    highlight: `
      bg-orange-500/10
      border-orange-500/20
      text-orange-600

      dark:text-orange-400

      ${isInteractive ? "hover:bg-orange-500/15" : ""}
    `,
  }

  // ─── ACTIVE STATE ─────────
  const activeStyles = active
    ? `
      bg-orange-500/10
      border-orange-500/30
      text-orange-600
      dark:text-orange-400
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

        // subtle lift (desktop only)
        isInteractive && "md:hover:-translate-y-[1px]"
      )}
    >

      {/* ICON */}
      {icon && (
        <span className="flex items-center justify-center opacity-80">
          {icon}
        </span>
      )}

      {/* TEXT */}
      <span>{children}</span>

    </motion.span>
  )
}