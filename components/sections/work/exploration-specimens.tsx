import type { ReactNode } from "react"
import clsx from "clsx"

/**
 * Exploration specimens: small, code-drawn previews of each self-directed
 * project, built from content that already lives on the project's own page.
 *
 * They replace the stock gradient covers, which showed no work and brought
 * orange and blue into a one-accent system. Neutrals carry the structure;
 * emerald marks the single thing each specimen is about. Decorative only
 * (aria-hidden): the card's text carries the meaning.
 */

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx(
        // Ledger's 4px corner on the frame; the mockups inside keep their own.
        "@container relative w-full overflow-hidden rounded-[4px] bg-card",
        "ring-1 ring-foreground/[0.08] dark:ring-white/[0.07]",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ── PlanR: goal → week → today, one loop ────────────────────────────────── */

const LOOP = ["Capture the goal", "Break it into milestones", "Plan the week", "Track execution", "Review and adjust"]

const TODAY = [
  { task: "Write final case intro", done: true },
  { task: "Review mobile layout", done: false },
  { task: "Log progress and blockers", done: false },
]

export function PlanRSpecimen({ className }: { className?: string }) {
  return (
    <Frame className={clsx("aspect-[16/10]", className)}>
      <div className="absolute inset-0 grid grid-cols-[0.9fr_1.1fr] gap-[3cqw] p-[4.5cqw]">
        {/* The loop the product is built around; the active stage is lit. */}
        <ol className="flex flex-col justify-center gap-[2.2cqw]">
          {LOOP.map((stage, i) => (
            <li key={stage} className="flex items-center gap-[2.2cqw]">
              <span
                className={clsx(
                  "grid size-[4.4cqw] shrink-0 place-items-center rounded-full text-[2.2cqw] font-semibold tabular-nums",
                  i === 2
                    ? "bg-accent text-white dark:text-neutral-950"
                    : "bg-foreground/[0.07] text-foreground/60"
                )}
              >
                {i + 1}
              </span>
              <span
                className={clsx(
                  "truncate text-[2.7cqw] leading-tight",
                  i === 2 ? "font-medium text-foreground" : "text-foreground/60"
                )}
              >
                {stage}
              </span>
            </li>
          ))}
        </ol>

        {/* Today, as the live app shows it. */}
        <div className="flex flex-col justify-center">
          <div className="rounded-[1.4cqw] bg-canvas-muted p-[3.6cqw] shadow-[0_1.2cqw_3cqw_-1.4cqw_rgba(0,0,0,0.35)] ring-1 ring-foreground/[0.06]">
            <p className="text-[2.3cqw] font-medium text-foreground/60">Today</p>
            <p className="mt-[0.8cqw] text-[3.3cqw] font-semibold leading-tight text-foreground">
              Launch portfolio refresh
            </p>
            <div className="mt-[1.8cqw] h-[1.1cqw] overflow-hidden rounded-full bg-foreground/[0.08]">
              <div className="h-full w-[38%] rounded-full bg-accent" />
            </div>
            <ul className="mt-[2.4cqw] space-y-[1.9cqw]">
              {TODAY.map((t) => (
                <li key={t.task} className="flex items-center gap-[1.4cqw]">
                  <span
                    className={clsx(
                      "grid size-[3.3cqw] shrink-0 place-items-center rounded-[0.6cqw]",
                      t.done ? "bg-accent" : "ring-1 ring-inset ring-foreground/25"
                    )}
                  >
                    {t.done && (
                      <svg viewBox="0 0 12 12" className="size-[70%] text-white dark:text-neutral-950">
                        <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={clsx(
                      "truncate text-[2.45cqw]",
                      t.done ? "text-foreground/60 line-through decoration-foreground/30" : "text-foreground/75"
                    )}
                  >
                    {t.task}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Frame>
  )
}

/* ── Fintech interface system: risk tiers + an AI recommendation ─────────── */

// The system's own four tiers. Weight rises with risk; only the dots carry
// hue, as a mockup of the product's palette (DESIGN.md colour-literal exception).
const TIERS = [
  { label: "Informational", rule: "Context only", dot: "bg-foreground/30" },
  { label: "Caution", rule: "Inline warning", dot: "bg-amber-400/80" },
  { label: "High-risk", rule: "Consequence statement", dot: "bg-orange-500/80" },
  { label: "Critical, irreversible", rule: "Confirm step required", dot: "bg-red-500/85" },
]

export function FintechSystemSpecimen({ className }: { className?: string }) {
  return (
    <Frame className={clsx("aspect-[16/10]", className)}>
      <div className="absolute inset-0 flex flex-col justify-center gap-[2.6cqw] p-[4.5cqw]">
        <ul className="divide-y divide-foreground/[0.07] overflow-hidden rounded-[1.4cqw] bg-canvas-muted ring-1 ring-foreground/[0.06]">
          {TIERS.map((t, i) => (
            <li key={t.label} className="flex items-center gap-[2cqw] px-[3cqw] py-[2.3cqw]">
              <span className={clsx("size-[2cqw] shrink-0 rounded-full", t.dot)} />
              <span
                className={clsx(
                  "flex-1 truncate text-[2.8cqw] text-foreground",
                  i === TIERS.length - 1 ? "font-semibold" : "font-medium"
                )}
              >
                {t.label}
              </span>
              <span className="truncate text-[2.45cqw] text-foreground/60">{t.rule}</span>
            </li>
          ))}
        </ul>

        {/* Summary first, confidence framed, override always available. */}
        <div className="flex items-center gap-[2cqw] rounded-[1.4cqw] bg-canvas-muted px-[3cqw] py-[2cqw] ring-1 ring-accent/30">
          <span className="rounded-[0.6cqw] bg-accent/[0.12] px-[1.4cqw] py-[0.5cqw] text-[2.2cqw] font-semibold text-accent">
            AI
          </span>
          <span className="flex-1 truncate text-[2.7cqw] text-foreground/80">
            Move ₹12,400 to savings · 72% confident
          </span>
          <span className="shrink-0 text-[2.45cqw] font-medium text-foreground underline decoration-foreground/30 underline-offset-[0.5cqw]">
            Choose differently
          </span>
        </div>
      </div>
    </Frame>
  )
}
