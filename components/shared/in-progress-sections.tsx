const DEFAULT_SECTIONS = ["The Problem", "The Approach", "Key Decisions", "Outcomes"]

/**
 * Intentional placeholder state for explorations still being written up.
 * Reads like a journal entry in progress — honest, not a broken page.
 */
export function InProgressSections({
  sections = DEFAULT_SECTIONS,
  note = "Documenting the decisions as the work develops.",
}: {
  sections?: string[]
  note?: string
}) {
  return (
    <div className="space-y-10">

      <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
        <span className="w-[6px] h-[6px] rounded-full bg-amber-400" />
        <span>Case study in progress — {note}</span>
      </div>

      {sections.map((heading) => (
        <section key={heading} className="space-y-2.5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {heading}
          </h2>
          <p className="text-[15px] text-foreground/45 leading-relaxed">
            Details being documented. Check back soon.
          </p>
        </section>
      ))}

    </div>
  )
}
