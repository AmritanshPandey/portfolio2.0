"use client"

import clsx from "clsx"
import { ReactNode } from "react"

interface CaseStudySectionProps {
  title: string
  subtitle?: string
  children: ReactNode
  variant?: "default" | "dark"
}

export function CaseStudySection({
  title,
  subtitle,
  children,
  variant = "default",
}: CaseStudySectionProps) {
  const isDark = variant === "dark"

  return (
    <section
      className={clsx(
        "py-20 md:py-28 transition-colors duration-300",
        isDark && "bg-black text-white"
      )}
    >
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={clsx(
              "mt-4 max-w-2xl text-base leading-relaxed",
              isDark ? "text-gray-400" : "text-gray-600"
            )}
          >
            {subtitle}
          </p>
        )}

        {/* Content */}
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  )
}
