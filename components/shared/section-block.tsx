"use client"

import clsx from "clsx"

type Props = {
  label: string
  children: React.ReactNode
  withDivider?: boolean
}

export function SectionBlock({
  label,
  children,
  withDivider = false,
}: Props) {
  return (
    <div>

      {/* Divider */}
      {withDivider && (
        <div className="h-px w-full bg-border/70 mb-12 md:mb-14" />
      )}

      <div className="
        grid md:grid-cols-[180px_1fr]
        gap-8 md:gap-12
        items-start
      ">

        {/* LABEL */}
        <p className="
          text-xs font-semibold uppercase tracking-[0.18em]
          text-muted-foreground
          pt-1
        ">
          {label}
        </p>

        {/* CONTENT */}
        <div className="space-y-8">
          {children}
        </div>

      </div>

    </div>
  )
}