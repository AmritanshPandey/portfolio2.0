import clsx from "clsx"

type Status = "Concept" | "In Development" | "Live"

const statusConfig: Record<Status, { dot: string }> = {
  "Concept":        { dot: "bg-amber-400" },
  "In Development": { dot: "bg-sky-400" },
  "Live":           { dot: "bg-emerald-400" },
}

export default function ContentPage({
  title,
  description,
  eyebrow,
  hypothesis,
  status,
  children,
}: {
  title: string
  description: string
  /** Small caps label above the title, e.g. "Exploration · Personal" */
  eyebrow?: string
  /** The thesis being tested — rendered as a pulled-out line under the title */
  hypothesis?: string
  status?: Status
  children?: React.ReactNode
}) {
  const sc = status ? statusConfig[status] : null

  return (
    <main className="max-w-3xl mx-auto px-6 pt-28 md:pt-32 pb-24">

      {/* Eyebrow + status */}
      {(eyebrow || sc) && (
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {eyebrow && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {eyebrow}
            </span>
          )}
          {sc && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-card text-[11px] font-medium text-foreground/70">
              <span className={clsx("w-[6px] h-[6px] rounded-full", sc.dot)} />
              {status}
            </span>
          )}
        </div>
      )}

      <h1 className="text-[clamp(30px,4.5vw,44px)] font-semibold tracking-[-0.02em] leading-[1.1] mb-5">
        {title}
      </h1>

      {hypothesis && (
        <p className="border-l-2 border-accent/50 pl-4 mb-6 text-[15px] md:text-[16px] leading-[1.6] text-foreground/80 italic">
          {hypothesis}
        </p>
      )}

      <p className="text-[16px] md:text-[17px] text-muted-foreground leading-[1.7] mb-12 max-w-[68ch]">
        {description}
      </p>

      <div className="space-y-10">
        {children}
      </div>

    </main>
  )
}
