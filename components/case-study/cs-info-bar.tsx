import clsx from "clsx"
import type { CSSProperties } from "react"

export interface CsInfoBarCell {
  label: string
  value: string
  sub?: string
}

export function CsInfoBar({ cells }: { cells: CsInfoBarCell[] }) {
  return (
    <div className="border-y border-border bg-[oklch(0.985_0_0)] dark:bg-[oklch(0.14_0_0)]">
      <div className="max-w-[1000px] mx-auto px-6">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(var(--cs-info-cols),minmax(0,1fr))]"
          style={{ "--cs-info-cols": cells.length } as CSSProperties}
        >
          {cells.map((cell, i) => (
            <div
              key={cell.label}
              className={clsx(
                "flex flex-col gap-2.5 border-border/50 py-5 sm:px-5 lg:py-7",
                "border-t first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0 lg:border-t-0",
                i > 0 && "lg:border-l",
                i < cells.length - 1 && "lg:pr-7"
              )}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {cell.label}
              </p>
              <p className="text-[15px] font-medium text-foreground leading-snug">
                {cell.value}
                {cell.sub && (
                  <span className="block text-[13px] font-normal text-muted-foreground mt-0.5">
                    {cell.sub}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
