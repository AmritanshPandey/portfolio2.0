"use client"

import clsx from "clsx"

type Props = {
  children: React.ReactNode
  className?: string
}

export function Pill({ children, className }: Props) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full",
        "px-3 py-1.5 text-[12px] font-medium",
        "relative overflow-hidden",

        // ── GLASS BASE
        "bg-white/70 text-black",
        "dark:bg-white/[0.08] dark:text-white",

        // ── BACKDROP
        "backdrop-blur-md",

        // ── EDGE (VERY IMPORTANT)
        "border border-white/40 dark:border-white/20",

        // ── DEPTH
        "shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:shadow-none",

        className
      )}
    >
      {/* ✨ top highlight (glass realism) */}
      <span
        className="
          pointer-events-none absolute inset-0 rounded-full
          bg-gradient-to-b from-white/40 to-transparent
          dark:from-white/10
        "
      />

      <span className="relative">{children}</span>
    </span>
  )
}