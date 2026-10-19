
/**
 * Approach: the six method steps, all visible at once.
 *
 * This replaced a swipeable card deck that showed one step at a time and
 * auto-advanced every few seconds. A fast scanner saw a sixth of the method,
 * and the loop competed with the page. A plain numbered list reads in one
 * pass, with the heading beside it on wide screens.
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
    <div className="ledger-grid gap-y-12">
      <div className="col-span-12 space-y-5 lg:col-span-4">
        <h2 data-settle className="type-section-title text-foreground">Approach</h2>
        <p data-settle style={{ ["--i" as string]: 1 }} className="type-section-intro text-muted-foreground">
          How I turn ambiguity into decisions teams can build from.
        </p>
      </div>

      <ol className="col-span-12 grid sm:grid-cols-2 sm:gap-x-[var(--col-gap)] lg:col-span-8">
        {STEPS.map((step, i) => (
          <li
            key={step.q}
            data-settle
            style={{ ["--i" as string]: i % 2 }}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] py-6 md:py-8"
          >
            <span className="ledger-label pt-1 text-accent">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="type-card-title text-foreground">{step.q}</h3>
              <p className="mt-2 text-[15px] leading-[1.55] text-muted-foreground text-pretty">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
