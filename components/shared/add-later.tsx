import clsx from "clsx"

/** Shown everywhere except the live production site. */
const VISIBLE = process.env.NEXT_PUBLIC_DEPLOY_ENV !== "production"

/**
 * A visible editorial to-do, placed wherever a claim is unconfirmed or
 * contradicts itself somewhere else on the site.
 *
 * It renders as a highlighted note locally and on Vercel preview deployments,
 * and as nothing in production, so a recruiter never sees an unfinished note
 * and an unconfirmed number never ships. Deliberately styled outside the site's
 * palette (yellow, dashed) so it can't be mistaken for design.
 *
 * To find every open note: grep the codebase for `<AddLater`.
 */
export function AddLater({
  note,
  block = false,
  className,
}: {
  /** What's missing, written as an instruction: "the real PartnerBank turnaround". */
  note: string
  /** A standalone box (replacing a paragraph or metric) instead of inline text. */
  block?: boolean
  className?: string
}) {
  if (!VISIBLE) return null

  const Tag = block ? "div" : "span"
  return (
    <Tag
      role="note"
      className={clsx(
        "rounded-md border border-dashed border-yellow-500/80 bg-yellow-300/25 text-yellow-950 dark:bg-yellow-300/15 dark:text-yellow-100",
        block
          ? "flex w-full flex-wrap items-baseline gap-x-2 gap-y-1 px-4 py-3 text-[14px] leading-snug"
          : "inline px-1.5 py-0.5 text-[0.85em] leading-normal [box-decoration-break:clone]",
        className
      )}
    >
      <strong className="font-semibold">Add later:</strong> {note}
    </Tag>
  )
}
