"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import { AsciiField } from "@/components/shared/ascii-field"
import { approachFields } from "./approach-fields"

/**
 * Approach: the six method steps, all visible at once, as a numbered list.
 * On wide screens the heading stays put while the steps scroll past, and an
 * ASCII field under it draws the step being read (approach-fields.ts),
 * decoding from one picture into the next. The step nearest the middle of
 * the screen is the one drawn; its number takes the accent.
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

const num = (i: number) => String(i + 1).padStart(2, "0")

export function ApproachSteps() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLOListElement>(null)
  const motifs = useMemo(() => approachFields(), [])

  // The step crossing the middle band of the screen is the one being read.
  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]")
    if (!items?.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step))
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )
    items.forEach((item) => io.observe(item))
    return () => io.disconnect()
  }, [])

  return (
    <div className="ledger-grid gap-y-10">
      <div className="col-span-12 lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
          <div className="space-y-5">
            <h2 data-settle="title" className="type-section-title text-foreground">Approach</h2>
            <p data-settle style={{ ["--i" as string]: 1 }} className="type-section-intro max-w-[30ch] text-muted-foreground">
              How I turn ambiguity into decisions teams can build from.
            </p>
          </div>

          {/* The picture of the step being read. Wide screens only: below
              that the steps stack under the heading and there is no column
              beside them to hold it. */}
          <figure aria-hidden className="mt-10 hidden lg:block">
            <div className="relative aspect-[5/6] max-h-[calc(100svh-var(--nav-h)-26rem)] w-full overflow-hidden rounded-[4px] bg-card ring-1 ring-foreground/[0.08] dark:ring-white/[0.07]">
              <AsciiField motifs={motifs} index={active} cell={10} className="absolute inset-0" />
            </div>
            <figcaption className="ledger-label mt-4 flex gap-3">
              <span className="text-accent">{num(active)}</span>
              <span className="text-foreground">{STEPS[active].q}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <ol ref={listRef} className="col-span-12 border-t border-border lg:col-span-7 lg:col-start-6">
        {STEPS.map((s, i) => (
          <li
            key={s.q}
            data-step={i}
            data-settle
            className={clsx(
              "grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 py-8 md:grid-cols-[3.5rem_minmax(0,1fr)] md:py-12",
              i < STEPS.length - 1 ? "border-b border-border" : "pb-0 md:pb-0",
            )}
          >
            <span
              aria-hidden
              className={clsx(
                "ledger-label pt-[0.45em] transition-colors duration-300 motion-reduce:transition-none",
                i === active && "lg:text-accent",
              )}
            >
              {num(i)}
            </span>
            <div>
              <h3 className="text-[clamp(1.375rem,2.2vw,2.125rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground text-balance">
                {s.q}
              </h3>
              <p className="mt-3 max-w-[46ch] text-base leading-[1.55] text-muted-foreground text-pretty md:text-[17px]">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
