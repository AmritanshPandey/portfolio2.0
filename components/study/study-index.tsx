"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { studies } from "@/lib/data/studies"
import { studyAt, type StudyEntry } from "@/lib/study-index"
import { BodyPortal } from "./body-portal"

const work = studies.filter((s) => s.kind === "work")
const explorations = studies.filter((s) => s.kind === "exploration")

/**
 * Move between studies without going home. Wide screens get a mono strip
 * pinned to the bottom (the case studies in home order, then the
 * self-directed explorations, then All work); phones one line that opens a
 * sheet with the same list. It waits until the hero has scrolled away and
 * steps aside for the ending and the footer, so it never covers either.
 * Hidden, it is inert. Hovering a study shows its problem line. It renders
 * into <body> (BodyPortal), so it stays pinned to the screen.
 */
export function StudyIndex() {
  const pathname = usePathname()
  const current = studyAt(studies, pathname)
  const [shown, setShown] = useState(false)
  const [hint, setHint] = useState<StudyEntry | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const sheetRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Each route starts with the sheet shut and the index hidden until its
  // hero has scrolled away (the layout, and this component, persist).
  const [route, setRoute] = useState(pathname)
  if (route !== pathname) {
    setRoute(pathname)
    setSheetOpen(false)
    setShown(false)
  }

  // The sheet is a native <dialog> (Escape, backdrop and focus trap for
  // free), driven by state so a link in it can close it.
  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    if (sheetOpen && !sheet.open) sheet.showModal()
    if (!sheetOpen && sheet.open) sheet.close()
  }, [sheetOpen])

  useEffect(() => {
    const covering = new Map<Element, boolean>()
    const targets = document.querySelectorAll("[data-cs-hero-inner], [data-study-next], footer")
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => covering.set(e.target, e.isIntersecting))
      setShown(![...covering.values()].some(Boolean))
    })
    targets.forEach((t) => io.observe(t))
    // Nothing to wait for (no hero, ending or footer): show on the next frame.
    const frame = targets.length === 0 ? requestAnimationFrame(() => setShown(true)) : 0
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [pathname])

  const link = (s: StudyEntry, onClick?: () => void) => {
    const here = s.href === current?.href
    return (
      <Link
        key={s.href}
        href={s.href}
        data-study-href
        aria-current={here ? "page" : undefined}
        onClick={onClick}
        onMouseEnter={() => setHint(s)}
        onMouseLeave={() => setHint(null)}
        onFocus={() => setHint(s)}
        onBlur={() => setHint(null)}
        className={clsx(
          "inline-flex items-center gap-2 whitespace-nowrap transition-colors duration-200",
          here ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {here && <span aria-hidden className="size-[7px] bg-accent" />}
        <span className="tabular-nums">{s.ref}</span> {s.short}
      </Link>
    )
  }

  const total = current ? studies.filter((s) => s.kind === current.kind).length : 0
  const closeSheet = () => setSheetOpen(false)

  return (
    <BodyPortal>
      <nav
        data-study-index
        data-shown={shown}
        aria-label="Studies"
        inert={!shown}
        className={clsx(
          "fixed inset-x-0 bottom-0 z-40 transition-[transform,opacity] duration-300 motion-reduce:transition-none",
          shown ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
        )}
      >
        <div className="ledger">
          {hint && (
            <p className="mb-2 hidden max-w-[60ch] bg-background/95 py-2 text-[14px] leading-snug text-muted-foreground md:block">
              {hint.problem}
            </p>
          )}
          {/* Wide screens: the strip */}
          <div className="ledger-label hidden items-center gap-x-5 border-t border-border bg-background/95 py-3 md:flex">
            {work.map((s) => link(s))}
            {explorations.length > 0 && (
              <>
                <span aria-hidden className="h-3 w-px bg-border" />
                <span>Self-directed</span>
                {explorations.map((s) => link(s))}
              </>
            )}
            <Link href="/#work" className="ml-auto text-foreground">
              All work
            </Link>
          </div>
          {/* Phones: one line, the list in a sheet */}
          <div className="flex items-center justify-between border-t border-border bg-background/95 py-3 md:hidden">
            <button
              type="button"
              ref={triggerRef}
              data-study-index-trigger
              onClick={() => setSheetOpen(true)}
              className="ledger-label min-h-11 text-foreground"
            >
              {current ? `${current.ref} / ${String(total).padStart(2, "0")} · ${current.short}` : "Studies"}
            </button>
            <Link href="/#work" className="ledger-label text-foreground">
              All work
            </Link>
          </div>
        </div>
      </nav>

      <dialog
        ref={sheetRef}
        aria-label="All studies"
        className="m-0 mt-auto w-full max-w-none border-t border-border bg-background p-0 text-foreground backdrop:bg-black/30"
        onClick={(e) => e.target === e.currentTarget && closeSheet()}
        onClose={() => {
          setSheetOpen(false)
          triggerRef.current?.focus()
        }}
      >
        <div className="ledger-label flex flex-col px-4 pb-8 pt-4">
          {work.map((s) => (
            <div key={s.href} className="flex min-h-12 items-center border-b border-border">
              {link(s, closeSheet)}
            </div>
          ))}
          {explorations.length > 0 && <p className="pb-1 pt-5">Self-directed</p>}
          {explorations.map((s) => (
            <div key={s.href} className="flex min-h-12 items-center border-b border-border">
              {link(s, closeSheet)}
            </div>
          ))}
        </div>
      </dialog>
    </BodyPortal>
  )
}
