import type { ReactNode } from "react"
import { StudyIndex } from "./study-index"
import { StudyNext } from "./study-next"
import { StudyTracker } from "./study-tracker"

/**
 * The navigation every case study and exploration shares
 * (docs/superpowers/specs/2026-11-14-study-template-design.md): the page,
 * then the next study, with the place tracker and the index over it.
 * Mounted from the route-group layouts, so a page needs no code of its own
 * for any of it.
 */
export function StudyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <StudyNext />
      <StudyTracker />
      <StudyIndex />
    </>
  )
}
