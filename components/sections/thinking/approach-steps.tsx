import { FadeIn } from "@/components/shared/fade-in"

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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-16">
      <div className="max-w-[640px] space-y-4">
        <h2 className="type-section-title text-foreground">Approach</h2>
        <p className="type-section-intro text-muted-foreground">
          How I turn ambiguity into decisions teams can build from.
        </p>
      </div>

      <ol className="grid gap-x-10 sm:grid-cols-2">
        {STEPS.map((step, i) => (
          <li key={step.q} className="border-t border-border/60">
            <FadeIn delay={(i % 2) * 0.06} y={14} className="flex gap-4 py-6 md:py-7">
              <span className="w-6 shrink-0 pt-0.5 font-mono text-[13px] tabular-nums text-accent">
                {i + 1}
              </span>
              <div>
                <h3 className="type-card-title text-foreground">{step.q}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground text-pretty">
                  {step.body}
                </p>
              </div>
            </FadeIn>
          </li>
        ))}
      </ol>
    </div>
  )
}
