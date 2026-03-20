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

          {label && (
            <p className="
              text-xl md:text-2xl lg:text-3xl
              font-semibold
              text-neutral-900
              leading-tight
            ">
              {label}
            </p>
          )}

          {description && (
            <p className="
              text-sm md:text-base
              text-neutral-500
              leading-[1.6]
              max-w-xl
            ">
              {description}
            </p>
          )}

        </div>
      )}

      {/* CONTENT */}
      <div>
        {children}
      </div>

    </div>
  )
}