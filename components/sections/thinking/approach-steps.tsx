import { ApproachShuffle, type ApproachStep } from "./approach-shuffle"

/**
 * Approach: the six method steps, all visible at once.
 *
 * This replaced a swipeable card deck that showed one step at a time and
 * auto-advanced every few seconds. A fast scanner saw a sixth of the method,
 * and the loop competed with the page. A plain numbered list reads in one
 * pass. On wide screens the heading stays put while the steps scroll past.
 * A reader can shuffle the steps to see what each depends on (ApproachShuffle).
 */

const STEPS: ApproachStep[] = [
  {
    q: "Identify what cannot move",
    body: "Set the fixed points first, so the team knows where it can move.",
    outOfPlace: "Everything after it assumes these are known. Found late, they undo work.",
  },
  {
    q: "Map the moving parts",
    body: "See flows, handoffs, and edge cases before committing to a screen.",
    outOfPlace: "Without the map, the proof tests the wrong part.",
  },
  {
    q: "Choose the smallest proof",
    body: "Build the smallest version that proves the decision.",
    outOfPlace: "Picked before the map, the proof is a guess.",
  },
  {
    q: "Prototype the risk",
    body: "Use the right fidelity for the unknown: sketch, Figma, content, code, or a demo.",
    outOfPlace: "Without a chosen proof, the prototype has no question to answer.",
  },
  {
    q: "Make alignment concrete",
    body: "Turn debate into a shared artifact: a rule, a flow, a prototype.",
    outOfPlace: "Alignment needs an artifact to point at; before the prototype there is none.",
  },
  {
    q: "Systematize what works",
    body: "Turn proven decisions into components, templates, and docs.",
    outOfPlace: "Systematize before it's proven and the guesses get locked in.",
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
          <h2 data-settle="title" className="type-section-title text-foreground">Approach</h2>
          <p data-settle style={{ ["--i" as string]: 1 }} className="type-section-intro max-w-[30ch] text-muted-foreground">
            How I turn ambiguity into decisions teams can build from.
          </p>
        </div>
      </div>

      <ApproachShuffle steps={STEPS} />
    </div>
  )
}
