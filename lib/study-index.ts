import type { ExplorationItem, WorkItem } from "@/lib/types/content"

/**
 * The study index: every case study and exploration, in the home page's
 * order, for the switcher and the next-study ending. Pure, so it is tested
 * without the app (lib/study-index.test.mjs); lib/data/studies.ts builds the
 * site's list from the real data.
 */

export type StudyKind = "work" | "exploration"

export interface StudyEntry {
  href: string
  slug: string
  title: string
  /** The name before the colon: "PartnerBank: A demo system…" → "PartnerBank". */
  short: string
  /** The public problem line (the work row's description). */
  problem: string
  kind: StudyKind
  /** Two-digit position within its kind: "01", "02"… */
  ref: string
}

const entry = (item: { href: string; title: string; description: string }, kind: StudyKind, i: number): StudyEntry => ({
  href: item.href,
  slug: item.href.split("/").filter(Boolean).pop() ?? "",
  title: item.title,
  short: item.title.split(":")[0].trim(),
  problem: item.description,
  kind,
  ref: String(i + 1).padStart(2, "0"),
})

export function buildStudies(work: WorkItem[], explorations: ExplorationItem[]): StudyEntry[] {
  return [...work.map((w, i) => entry(w, "work", i)), ...explorations.map((e, i) => entry(e, "exploration", i))]
}

export function studyAt(studies: StudyEntry[], href: string): StudyEntry | undefined {
  return studies.find((s) => s.href === href)
}

/** The next study of the same kind, wrapping to the first; none for an href outside the index. */
export function nextStudy(studies: StudyEntry[], href: string): StudyEntry | undefined {
  const current = studyAt(studies, href)
  if (!current) return undefined
  const same = studies.filter((s) => s.kind === current.kind)
  return same[(same.indexOf(current) + 1) % same.length]
}
