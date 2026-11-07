"use client"

import { useRef, useState, type ReactNode } from "react"

// A little longer than a note takes to open (globals.css).
const HOLD_MS = 460

/**
 * The work list and its switch. "Show the working" opens a note under every
 * row: the pressure, the call and what it cost, in each study's own words.
 * The notes are in the page already; this only marks the list, and CSS does
 * the rest. The switch stays in reach while the list scrolls past.
 */
export function WorkingScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  const toggle = () => {
    setOn(!on)

    // Notes above the row being read would push it away, so hold that row
    // still while they open or close. Safari has no scroll anchoring to do it.
    const barBottom = barRef.current?.getBoundingClientRect().bottom ?? 0
    const rows = ref.current?.querySelectorAll<HTMLElement>(".work-row") ?? []
    const row = Array.from(rows).find((el) => el.getBoundingClientRect().bottom > barBottom)
    if (!row) return
    const top = row.getBoundingClientRect().top
    const until = performance.now() + HOLD_MS
    const hold = (now: number) => {
      const drift = row.getBoundingClientRect().top - top
      if (Math.abs(drift) > 0.5) window.scrollBy({ top: drift, behavior: "instant" })
      if (now < until) requestAnimationFrame(hold)
    }
    requestAnimationFrame(hold)
  }

  return (
    <div ref={ref} data-working={on ? "" : undefined}>
      <div
        ref={barRef}
        className="sticky top-[calc(env(safe-area-inset-top)+var(--nav-h))] z-10 -mb-px flex min-h-12 items-center justify-between gap-4 border-b border-border bg-background"
      >
        <p className="ledger-label hidden sm:block">The call behind each piece of work, and what it cost</p>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={toggle}
          className="working-switch inline-flex min-h-11 items-center gap-3"
        >
          <span className="ledger-label"><span className="text-foreground">Show the working</span></span>
          <span aria-hidden className="working-switch-track" />
        </button>
      </div>
      {children}
    </div>
  )
}
