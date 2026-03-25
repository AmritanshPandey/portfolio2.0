"use client"

import clsx from "clsx"

type Variant = "line" | "gradient" | "label"

export function FancyDivider({
  variant = "line",
  label,
  className,
}: {
  variant?: Variant
  label?: string
  className?: string
}) {
  const isGradient = variant === "gradient"
  const isLabel = variant === "label" && label

  return (
    <div
      className={clsx(
        "w-full flex items-center",
        "[transform:translateZ(0)]", // 🔥 Safari stability
        className
      )}
    >

      {/* LEFT */}
      <div
        className={clsx(
          "flex-1 h-px",

          isGradient
            ? "bg-gradient-to-r from-transparent via-border/80 to-border"
            : "bg-border/80"
        )}
      />

      {/* LABEL */}
      {isLabel && (
        <span
          className="
            px-4 text-[11px] uppercase tracking-[0.18em]
            text-muted-foreground font-medium

            whitespace-nowrap
          "
        >
          {label}
        </span>
      )}

      {/* RIGHT */}
      <div
        className={clsx(
          "flex-1 h-px",

          isGradient
            ? "bg-gradient-to-l from-transparent via-border/80 to-border"
            : "bg-border/80"
        )}
      />

    </div>
  )
}