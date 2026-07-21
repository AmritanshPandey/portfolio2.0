"use client"

import { useEffect, useState } from "react"
import clsx from "clsx"

export interface CsChapter {
  /** Must match the `id` passed to the matching <CsSection id="...">. */
  id: string
  label: string
}

export interface CsChapterNavProps {
  chapters: CsChapter[]
  className?: string
}

/**
 * Sticky chapter rail for long case studies.
 *
 * A recruiter shouldn't have to scroll a 12-section study to reach "Outcome".
 * This is a fixed vertical rail of dashes + labels that tracks the section in
 * view and jumps on click.
 *
 * Deliberately xl-and-up only: the floating site navbar owns the top of the
 * screen, so a horizontal bar would fight it, and on narrow screens the rail
 * would cover content. It's an accelerator, not the only way through — every
 * section is still reachable by scrolling, and each link is a plain anchor so
 * it works before hydration.
 */
export function CsChapterNav({ chapters, className }: CsChapterNavProps) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (els.length === 0) return

    // The topmost section crossing the upper third wins.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [chapters])

  // A rail for one section is noise.
  if (chapters.length < 2) return null

  return (
    <nav
      aria-label="Case study sections"
      className={clsx(
        "pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block",
        className
      )}
    >
      <ul className="pointer-events-auto flex flex-col gap-1">
        {chapters.map((c) => {
          const isActive = active === c.id
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-3 rounded-full py-1.5 pl-3 pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <span
                  className={clsx(
                    "whitespace-nowrap text-[11px] transition-all duration-300",
                    isActive
                      ? "text-foreground opacity-100"
                      : "text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  )}
                >
                  {c.label}
                </span>
                <span
                  aria-hidden
                  className={clsx(
                    "h-px shrink-0 rounded-full transition-all duration-300",
                    isActive
                      ? "w-6 bg-accent"
                      : "w-3 bg-border group-hover:w-5 group-hover:bg-foreground/40"
                  )}
                />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
