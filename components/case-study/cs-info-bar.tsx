import clsx from "clsx"
import type { CSSProperties } from "react"

export interface CsInfoBarCell {
  label: string
  value: string
  sub?: string
}

/** Project facts as one ruled row on the sheet: label in mono, value below. */
export function CsInfoBar({ cells }: { cells: CsInfoBarCell[] }) {
  return (
    <div className="bg-background">
      <div className="ledger">
        <div
          className="grid grid-cols-1 border-y border-foreground sm:grid-cols-2 lg:grid-cols-[repeat(var(--cs-info-cols),minmax(0,1fr))]"
          style={{ "--cs-info-cols": cells.length } as CSSProperties}
        >
          {cells.map((cell, i) => (
            <div
              key={cell.label}
              className={clsx(
                "flex flex-col gap-2 border-border py-5 sm:pr-5 lg:py-6",
                "border-t first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0 lg:border-t-0",
                i > 0 && "lg:border-l lg:pl-5",
              )}
            >
              <p className="ledger-label">{cell.label}</p>
              <p className="text-[15px] font-semibold leading-snug tracking-[-0.005em] text-foreground">
                {cell.value}
                {cell.sub && (
                  <span className="mt-0.5 block text-[14px] font-normal text-muted-foreground">{cell.sub}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
