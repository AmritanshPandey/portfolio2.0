import type { Metadata } from "next"

import { PlaygroundWall } from "./playground-wall"

export const metadata: Metadata = {
  title: "Lab",
  description: "Working experiments — interactive components, diagrams, and models you can open and use.",
}

/* One screen: the intro on the sheet's rule, then the experiments pinned to
   a sheet that fills the rest of it. */
export default function PlaygroundPage() {
  return (
    <div className="flex h-[100svh] min-h-[640px] flex-col bg-background text-foreground">
      <header className="ledger shrink-0" style={{ paddingTop: "calc(var(--nav-h) + clamp(24px, 3.5vw, 56px))" }}>
        <div aria-hidden data-hero-rule className="rule-ink" />
        <div className="ledger-grid mt-5 gap-y-4 pb-6 md:mt-7 md:items-end md:pb-8">
          <h1 data-hero-line="1" className="type-page-title col-span-12 md:col-span-6">
            Lab
          </h1>
          <div data-hero-fade className="col-span-12 md:col-span-5 md:col-start-8">
            <p className="type-section-intro text-muted-foreground">
              Working pieces, not screenshots: interactions, diagrams, tools and models you can open and use. Some of
              them power a case study or an essay.
            </p>
            <p className="type-meta mt-3">Drag to look around · open one to use it</p>
          </div>
        </div>
      </header>
      <div className="relative min-h-0 flex-1 border-t border-border">
        <PlaygroundWall />
      </div>
    </div>
  )
}
