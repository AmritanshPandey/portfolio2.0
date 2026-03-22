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
  return (
    <div className={clsx("w-full flex items-center", className)}>

      {/* LEFT */}
      <div
        className={clsx(
          "flex-1 h-px",
          variant === "gradient"
            ? "bg-gradient-to-r from-transparent via-border to-border"
            : "bg-border"
        )}
      />

      {/* LABEL */}
      {variant === "label" && label && (
        <span className="
          px-4 text-[11px] uppercase tracking-[0.18em]
          text-muted-foreground font-medium
        ">
          {label}
        </span>
      )}

      {/* RIGHT */}
      <div
        className={clsx(
          "flex-1 h-px",
          variant === "gradient"
            ? "bg-gradient-to-l from-transparent via-border to-border"
            : "bg-border"
        )}
      />

    </div>
  )
}