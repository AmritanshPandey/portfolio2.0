import clsx from "clsx"

export type CsProvenanceKind =
  | "shipped"
  | "internal"
  | "conceptual"
  | "anonymised"
  | "exploration"

export interface CsProvenanceProps {
  kind: CsProvenanceKind
  /** Replaces the default wording, e.g. "Conceptual, not a Mastercard product". */
  label?: string
  className?: string
}

/**
 * States what a piece of work actually *is* before the reader assumes.
 *
 * The portfolio mixes shipped product, internal tooling, and self-directed
 * concepts. A reader who mistakes a concept for shipped work has been misled,
 * even by accident, so anything that isn't live in production carries one of
 * these. It reads as rigour rather than a disclaimer: naming the status is what
 * makes the shipped claims credible.
 *
 * Only "shipped" uses the accent. The rest stay neutral on purpose, so a
 * concept can never be dressed up to look like a result.
 */
const KIND: Record<CsProvenanceKind, { label: string; accent: boolean }> = {
  shipped: { label: "Shipped to production", accent: true },
  internal: { label: "Internal tool", accent: false },
  conceptual: { label: "Conceptual work", accent: false },
  anonymised: { label: "Anonymised", accent: false },
  exploration: { label: "Self-directed exploration", accent: false },
}

export function CsProvenance({ kind, label, className }: CsProvenanceProps) {
  const meta = KIND[kind]

  return (
    <span
      data-kind={kind}
      className={clsx(
        "ledger-label inline-flex w-fit items-center gap-2",
        meta.accent ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "size-[7px]",
          meta.accent ? "bg-accent" : "border border-current"
        )}
      />
      {label ?? meta.label}
    </span>
  )
}
