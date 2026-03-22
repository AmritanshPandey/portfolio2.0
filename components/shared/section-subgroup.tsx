"use client"

import clsx from "clsx"

type Variant = "default" | "muted" | "spacious"

export function SectionSubgroup({
  label,
  description,
  variant = "default",
  children,
}: {
  label?: string
  description?: string
  variant?: Variant
  children: React.ReactNode
}) {

  const spacing = {
    default: "space-y-4 md:space-y-5",
    muted: "space-y-3 md:space-y-4",
    spacious: "space-y-6 md:space-y-8",
  }

  return (
    <div className={clsx("w-full", spacing[variant])}>

      {/* HEADER */}
      {(label || description) && (
        <div className="space-y-2">

          {/* LABEL */}
          {label && (
            <p className="
              text-lg md:text-xl
              font-medium tracking-tight
              text-foreground
              leading-snug
            ">
              {label}
            </p>
          )}

          {/* DESCRIPTION */}
          {description && (
            <p className="
              text-sm md:text-base
              text-muted-foreground
              leading-[1.6]
              max-w-full
            ">
              {description}
            </p>
          )}

        </div>
      )}

      {/* CONTENT */}
      <div className="space-y-4">
        {children}
      </div>

    </div>
  )
}