"use client"

import { useLayoutEffect, useRef, useState } from "react"

export interface ApproachStep {
  q: string
  body: string
  /** What breaks when this step is taken out of its place. */
  outOfPlace: string
}

const SLIDE_MS = 560

// A new order with at least four steps away from home, so the point lands.
function shuffled(count: number): number[] {
  for (;;) {
    const order = Array.from({ length: count }, (_, i) => i)
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    if (order.filter((step, place) => step !== place).length >= Math.min(4, count)) return order
  }
}

/**
 * The Approach steps, which a reader can shuffle out of order to see what
 * each one depends on: a step that lands away from home says what breaks.
 * "Put it back" restores the method. Steps keep their own numbers, so a
 * moved step reads as out of place at a glance. Rows slide from where they
 * were to where they land (measured first, then eased), except under
 * reduced motion.
 */
export function ApproachShuffle({ steps }: { steps: ApproachStep[] }) {
  const [order, setOrder] = useState(() => steps.map((_, i) => i))
  const listRef = useRef<HTMLOListElement>(null)
  const before = useRef<Map<number, number> | null>(null)
  const misplaced = order.filter((step, place) => step !== place).length

  const reorder = (next: number[]) => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []
    before.current = new Map(Array.from(rows, (row) => [Number(row.dataset.step), row.getBoundingClientRect().top]))
    setOrder(next)
  }

  useLayoutEffect(() => {
    const tops = before.current
    before.current = null
    if (!tops || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    listRef.current?.querySelectorAll<HTMLElement>("[data-step]").forEach((row) => {
      const from = tops.get(Number(row.dataset.step))
      if (from === undefined) return
      const delta = from - row.getBoundingClientRect().top
      if (!delta) return
      row.animate([{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }], {
        duration: SLIDE_MS,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      })
    })
  }, [order])

  return (
    <div className="col-span-12 lg:col-span-7 lg:col-start-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="ledger-label">
          {misplaced ? `${misplaced} steps out of place` : "In the order I work"}
        </p>
        <button
          type="button"
          className="btn-line"
          onClick={() => reorder(misplaced ? steps.map((_, i) => i) : shuffled(steps.length))}
        >
          {misplaced ? "Put it back" : "Shuffle the order"}
        </button>
      </div>

      <ol ref={listRef} className="border-t border-border">
        {order.map((step, place) => {
          const s = steps[step]
          const away = step !== place
          return (
            <li
              key={s.q}
              data-step={step}
              data-settle
              className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-5 border-b border-border bg-background py-8 md:grid-cols-[5rem_minmax(0,1fr)] md:py-12"
            >
              <span
                aria-hidden
                className={`text-[clamp(1.75rem,3vw,2.75rem)] font-[760] leading-[1] tracking-[-0.04em] tabular-nums [font-variation-settings:'wdth'_108] transition-colors duration-300 ${away ? "text-accent" : "text-muted-foreground"}`}
              >
                {String(step + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[clamp(1.375rem,2.2vw,2.125rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground text-balance">
                  {s.q}
                </h3>
                <p className="mt-3 max-w-[46ch] text-base leading-[1.55] text-muted-foreground text-pretty md:text-[17px]">
                  {s.body}
                </p>
                {away && (
                  <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.5] text-foreground text-pretty">
                    <span className="ledger-label mr-2">Out of place</span>
                    {s.outOfPlace}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
