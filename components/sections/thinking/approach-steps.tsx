
/**
 * Approach: the six method steps, all visible at once.
 *
 * This replaced a swipeable card deck that showed one step at a time and
 * auto-advanced every few seconds. A fast scanner saw a sixth of the method,
 * and the loop competed with the page. A plain numbered list reads in one
 * pass. On wide screens the heading stays put while the steps scroll past.
 */

const STEPS = [
  {
    q: "Identify what cannot move",
    body: "Set the fixed points first, so the team knows where it can move.",
  },
  {
    q: "Map the moving parts",
    body: "See flows, handoffs, and edge cases before committing to a screen.",
  },
  {
    q: "Choose the smallest proof",
    body: "Build the smallest version that proves the decision.",
  },
  {
    q: "Prototype the risk",
    body: "Use the right fidelity for the unknown: sketch, Figma, content, code, or a demo.",
  },
  {
    q: "Make alignment concrete",
    body: "Turn debate into a shared artifact: a rule, a flow, a prototype.",
  },
  {
    q: "Systematize what works",
    body: "Turn proven decisions into components, templates, and docs.",
  },
]

export function ApproachSteps() {
  return (
    <div className="ledger-grid gap-y-10">
      {/* The heading holds its place while the steps scroll past it, so the
          section reads as a method being walked through rather than the same
          header-and-grid as the sections around it. */}
      <div className="col-span-12 lg:col-span-4">
        <div className="space-y-5 lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
          <h2 data-settle className="type-section-title text-foreground">Approach</h2>
          <p data-settle style={{ ["--i" as string]: 1 }} className="type-section-intro max-w-[30ch] text-muted-foreground">
            How I turn ambiguity into decisions teams can build from.
          </p>
        </div>
      </div>

      <ol className="col-span-12 border-t border-border lg:col-span-7 lg:col-start-6">
        {STEPS.map((step, i) => (
          <li
            key={step.q}
            data-settle
            className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-5 border-b border-border py-8 md:grid-cols-[5rem_minmax(0,1fr)] md:py-12"
          >
            <span
              aria-hidden
              className="text-[clamp(1.75rem,3vw,2.75rem)] font-[760] leading-[1] tracking-[-0.04em] text-muted-foreground tabular-nums [font-variation-settings:'wdth'_108]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[clamp(1.375rem,2.2vw,2.125rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground text-balance">
                {step.q}
              </h3>
              <p className="mt-3 max-w-[46ch] text-base leading-[1.55] text-muted-foreground text-pretty md:text-[17px]">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
