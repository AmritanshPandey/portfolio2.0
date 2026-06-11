import clsx from "clsx"
import { Reveal, TextReveal } from "@/components/shared/motion"
import { ReadingProgress } from "@/components/shared/reading-progress"

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
  /** Small meta label above the title, e.g. "Exploration · Personal" */
  eyebrow?: string
  /** The thesis being tested — rendered as a pulled-out line under the title */
  hypothesis?: string
  status?: Status
  children?: React.ReactNode
}) {
  const sc = status ? statusConfig[status] : null

  return (
    <main className="relative">
      <ReadingProgress />

      {/* ── Header band — the exploration's own hero ─────────────────── */}
      <header className="relative overflow-hidden border-b border-border/45 bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_380px_at_14%_-10%,rgba(249,115,22,0.06),transparent_62%)] dark:bg-[radial-gradient(720px_380px_at_14%_-10%,rgba(249,115,22,0.10),transparent_62%)]"
        />

        <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-28 md:pt-32 md:pb-14">
          {(eyebrow || sc) && (
            <Reveal as="div" y={12} start="top 96%" className="mb-6 flex flex-wrap items-center gap-3">
              {eyebrow && (
                <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-muted-foreground">
                  {eyebrow}
                </span>
              )}
              {sc && (
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground/70">
                  <span className={clsx("h-[6px] w-[6px] rounded-full", sc.dot)} />
                  {status}
                </span>
              )}
            </Reveal>
          )}

          <TextReveal as="h1" start="top 96%" className="type-hero-internal mb-6 text-foreground">
            {title}
          </TextReveal>

          {hypothesis && (
            <Reveal
              as="blockquote"
              y={18}
              delay={0.18}
              start="top 96%"
              className="relative mb-6 pl-9 md:pl-11"
            >
              <span
                aria-hidden
                className="absolute -top-3 left-0 select-none text-[52px] font-black leading-none text-accent/30"
              >
                &ldquo;
              </span>
              <p className="text-[15px] italic leading-[1.6] text-foreground/80 md:text-[16px]">
                {hypothesis}
              </p>
            </Reveal>
          )}

          <Reveal
            as="p"
            y={18}
            delay={0.26}
            start="top 96%"
            className="max-w-[68ch] text-[16px] leading-[1.7] text-muted-foreground md:text-[17px]"
          >
            {description}
          </Reveal>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-12 md:pt-14">
        <div className="space-y-10">
          {children}
        </div>
      </div>
    </main>
  )
}
