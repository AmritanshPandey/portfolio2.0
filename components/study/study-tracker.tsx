"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"

interface Chapter {
  id: string
  label: string
}

// The reading line: a chapter is current once its top has passed 30% of the
// way down the screen (the line CsChapterNav used).
const LINE = 0.3

/**
 * Where you are in a study. Chapters are the page's labelled sections
 * (`section[data-chapter]`, emitted by CsSection), found after each route
 * change, so no page keeps a chapter list by hand.
 *
 * Wide screens get a rail of ticks on the left that names only the chapter in
 * view; narrower ones a hairline under the floating nav, filling as you read,
 * with the chapter's name beside it and the full list a tap away. Nothing is
 * current above the first chapter. No scroll listener: two
 * IntersectionObservers, one for the reading line and one for jumps.
 */
export function StudyTracker() {
  const pathname = usePathname()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [active, setActive] = useState(-1)
  const listRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[data-chapter]"))
    // Reading the DOM once per route: the page decides what its chapters are.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChapters(sections.map((s) => ({ id: s.id, label: s.dataset.chapterLabel ?? s.id })))
    setActive(-1)
    listRef.current?.close()
    if (sections.length === 0) return

    const update = () => {
      const line = window.innerHeight * LINE
      let current = -1
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= line) current = i
      })
      setActive(current)
    }
    // Reading: a chapter crossing the reading line. A jump (Home, a link back
    // to the top) can land somewhere no chapter is on screen, from somewhere
    // none was either (the hero, the footer), so no chapter changes and
    // nothing fires. The page's top-level blocks entering or leaving the
    // screen recount too (REDESIGN F10).
    const line = new IntersectionObserver(update, {
      rootMargin: `-${LINE * 100}% 0px -${100 - LINE * 100}% 0px`,
    })
    sections.forEach((s) => line.observe(s))
    const screen = new IntersectionObserver(update)
    document.querySelectorAll("main > *, main > * > *, footer").forEach((el) => screen.observe(el))
    update()
    return () => {
      line.disconnect()
      screen.disconnect()
    }
  }, [pathname])

  if (chapters.length === 0) return null
  const current = active >= 0 ? chapters[active] : null
  const ref = (i: number) => String(i + 1).padStart(2, "0")

  return (
    <>
      {/* Wide screens: the rail */}
      <nav
        data-study-tracker
        aria-label="Chapters"
        className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
      >
        <ol className="pointer-events-auto flex flex-col">
          {chapters.map((c, i) => {
            const on = i === active
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={on ? "location" : undefined}
                  aria-label={`${ref(i)} · ${c.label}`}
                  className="group flex h-6 items-center gap-3"
                >
                  <span
                    aria-hidden
                    className={clsx(
                      "h-px origin-left bg-foreground transition-[transform,opacity] duration-300",
                      on ? "w-7 opacity-100" : "w-4 opacity-30 group-hover:opacity-70",
                    )}
                  />
                  {on && (
                    <span className="ledger-label whitespace-nowrap text-foreground">
                      {ref(i)} · {c.label}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Narrower screens: a hairline under the nav, and the list on a tap */}
      <div className="fixed inset-x-0 z-30 xl:hidden" style={{ top: "var(--nav-h)" }}>
        <div aria-hidden className="h-px w-full bg-border">
          <div
            className="h-px origin-left bg-foreground transition-transform duration-300"
            style={{ transform: `scaleX(${(active + 1) / chapters.length})` }}
          />
        </div>
        {current && (
          <button
            type="button"
            data-study-tracker-phone
            onClick={() => listRef.current?.showModal()}
            className="ledger-label ml-4 mt-1 bg-background/90 px-2 py-1 text-foreground"
          >
            {ref(active)} · {current.label}
          </button>
        )}
      </div>

      <dialog
        ref={listRef}
        aria-label="Chapters"
        className="m-0 mt-auto w-full max-w-none border-t border-border bg-background p-0 text-foreground backdrop:bg-black/30"
        onClick={(e) => e.target === listRef.current && listRef.current?.close()}
      >
        <ol className="px-4 pb-8 pt-4">
          {chapters.map((c, i) => (
            <li key={c.id} className="border-b border-border">
              <a
                href={`#${c.id}`}
                onClick={() => listRef.current?.close()}
                aria-current={i === active ? "location" : undefined}
                className="flex min-h-12 items-center gap-3 text-[15px]"
              >
                <span className="ledger-label">{ref(i)}</span>
                {c.label}
              </a>
            </li>
          ))}
        </ol>
      </dialog>
    </>
  )
}
