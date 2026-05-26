import clsx from "clsx"

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
          className="grid"
          style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}
        >
          {cells.map((cell, i) => (
            <div
              key={cell.label}
              className={clsx(
                "py-7 flex flex-col gap-2.5",
                i > 0 && "pl-7 border-l border-border/50",
                i < cells.length - 1 && "pr-7"
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
