import clsx from "clsx"
import type { CSSProperties, ReactNode } from "react"

/*
 * The study's ledger blocks: options, layers, calls, figures, bars and the
 * reflection. Ruled rows on the sheet, mono references, one ultramarine mark
 * at a time; no cards, pills, gradients or uppercase-tracked labels. Each lands
 * with the settle (`data-settle`), so reduced motion simply shows them at rest.
 */

const delay = (i: number) => ({ ["--i" as string]: i }) as CSSProperties

// ─── Options ─────────────────────────────────────────────────────────────────

export interface StudyOption {
  title: string
  verdict: string
  chosen?: boolean
}

/** The options that were on the table, side by side, and why one won. */
export function StudyOptions({ question, options }: { question?: string; options: StudyOption[] }) {
  return (
    <div className="ledger-offset">
      <div>
        {question && <p className="ledger-label mb-5">{question}</p>}
        <ol
          className={clsx(
            "grid gap-x-[var(--col-gap)] border-b border-border",
            options.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
          )}
        >
          {options.map((o, i) => (
            <li
              key={o.title}
              data-settle
              style={delay(i)}
              className={clsx("flex flex-col gap-3 border-t py-5", o.chosen ? "border-foreground" : "border-border")}
            >
              <p className="ledger-label inline-flex items-center gap-2">
                {o.chosen && <span aria-hidden className="size-[7px] bg-accent" />}
                {o.chosen ? "Chosen" : "Considered"}
              </p>
              <p className={clsx("text-[19px] font-semibold leading-snug tracking-[-0.01em]", o.chosen ? "text-foreground" : "text-muted-foreground")}>
                {o.title}
              </p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{o.verdict}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

// ─── Layers ──────────────────────────────────────────────────────────────────

export interface StudyLayer {
  ref: string
  title: string
  body: string
  /** The layer the idea lives in: outlined in ink with the accent mark. */
  key?: boolean
}

/**
 * An architecture drawn as a stack of plates, top to bottom, each one a
 * little narrower than the one under it, so the shape reads before the words.
 */
export function StudyLayers({ layers }: { layers: StudyLayer[] }) {
  const n = layers.length
  return (
    <ol className="flex flex-col items-center gap-2">
      {layers.map((l, i) => (
        <li
          key={l.ref}
          data-settle
          style={{ ...delay(i), width: `${100 - (n - 1 - i) * 7}%` }}
          className={clsx(
            "grid min-w-0 gap-x-[var(--col-gap)] gap-y-1 border px-4 py-4 sm:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.2fr)] sm:px-5",
            "max-sm:!w-full",
            l.key ? "border-foreground bg-[var(--surface-1)]" : "border-border",
          )}
        >
          <p className="ledger-label inline-flex items-center gap-2">
            {l.key && <span aria-hidden className="size-[7px] bg-accent" />}
            {l.ref}
          </p>
          <p className="text-[16px] font-semibold leading-snug text-foreground">{l.title}</p>
          <p className="text-[15px] leading-snug text-muted-foreground">{l.body}</p>
        </li>
      ))}
    </ol>
  )
}

// ─── Calls ───────────────────────────────────────────────────────────────────

export interface StudyCall {
  title: string
  call: ReactNode
  cost: ReactNode
  changed?: ReactNode
}

/** The other decisions, one ruled row each: the call, what it cost, what it changed. */
export function StudyCalls({ calls }: { calls: StudyCall[] }) {
  return (
    <div className="ledger-offset">
      <ol className="border-b border-border">
        {calls.map((c, i) => (
          <li
            key={c.title}
            data-settle
            style={delay(i)}
            className="grid gap-x-[var(--col-gap)] gap-y-3 border-t border-border py-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <div>
              <p className="ledger-label mb-2">{String(i + 1).padStart(2, "0")}</p>
              <p className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-foreground">{c.title}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/80">{c.call}</p>
            </div>
            <div>
              <p className="ledger-label mb-2">What it cost</p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{c.cost}</p>
            </div>
            {c.changed && (
              <div>
                <p className="ledger-label mb-2">What it changed</p>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{c.changed}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

// ─── Figures ─────────────────────────────────────────────────────────────────

export interface StudyFigureItem {
  figure: string
  label: string
}

/** The outcome in figures: big numbers on one ruled line, a note under each. */
export function StudyFigures({ items }: { items: StudyFigureItem[] }) {
  return (
    <dl
      className="grid border-y border-foreground sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
      style={{ ["--n" as string]: items.length } as CSSProperties}
    >
      {items.map((m, i) => (
        <div
          key={m.label}
          data-settle
          style={delay(i)}
          className={clsx("flex flex-col gap-3 py-8 sm:pr-6", i > 0 && "border-t border-border sm:border-l sm:border-t-0 sm:pl-6")}
        >
          <dt className="sr-only">{m.label}</dt>
          <dd className="text-[clamp(2.25rem,4.6vw,4.5rem)] font-[800] leading-[0.95] tracking-[-0.04em] text-foreground tabular-nums [font-variation-settings:'wdth'_112]">
            {m.figure}
          </dd>
          <dd className="max-w-[30ch] text-[15px] leading-snug text-muted-foreground">{m.label}</dd>
        </div>
      ))}
    </dl>
  )
}

// ─── Bars ────────────────────────────────────────────────────────────────────

export interface StudyBar {
  label: string
  value: string
  /** Share of the longest bar, 0 to 100. */
  width: number
  /** The bar that answers: drawn in the accent. */
  after?: boolean
}

/** A before and after drawn to scale. */
export function StudyBars({ title, bars }: { title: string; bars: StudyBar[] }) {
  return (
    <figure className="border-t border-border">
      <figcaption className="ledger-label py-3">{title}</figcaption>
      {bars.map((b, i) => (
        <div
          key={b.label}
          className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-x-4 border-b border-border py-4"
        >
          <span className="ledger-label">{b.label}</span>
          <span className="h-3">
            <span
              data-settle="rule"
              style={{ ...delay(i), width: `${b.width}%` }}
              className={clsx("block h-full", b.after ? "bg-accent" : "bg-foreground/25")}
            />
          </span>
          <span className="text-right text-[15px] font-medium tabular-nums text-foreground">{b.value}</span>
        </div>
      ))}
    </figure>
  )
}

// ─── Reflection ──────────────────────────────────────────────────────────────

/** One sentence at quote size, then what I'd do differently, and what's still open. */
export function StudyReflection({
  line,
  learned,
  next,
  open,
}: {
  line?: ReactNode
  learned?: ReactNode
  next?: ReactNode
  open?: ReactNode
}) {
  const rows = [
    learned && { label: "What it changed in how I work", value: learned },
    next && { label: "What I'd do differently", value: next },
    open && { label: "What still needs proving", value: open },
  ].filter(Boolean) as { label: string; value: ReactNode }[]

  return (
    <div className="ledger-offset">
      <div>
        {line && <blockquote
          data-settle
          className="max-w-[30ch] text-[clamp(1.5rem,2.6vw,2.375rem)] font-[650] leading-[1.15] tracking-[-0.02em] text-foreground [font-variation-settings:'wdth'_106]"
        >
          {line}
        </blockquote>}
        {rows.length > 0 && (
          <dl className="mt-12 border-b first:mt-0 border-border">
            {rows.map((r, i) => (
              <div
                key={r.label}
                data-settle
                style={delay(i + 1)}
                className="grid gap-x-[var(--col-gap)] gap-y-2 border-t border-border py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
              >
                <dt className="ledger-label">{r.label}</dt>
                <dd className="max-w-[62ch] text-[15px] leading-relaxed text-foreground/80">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}

// ─── Fan-out ─────────────────────────────────────────────────────────────────

export interface FanoutTarget {
  name: string
  /** A brand colour for the tile; without one the tile is a blank sheet. */
  color?: string
}

/**
 * One source feeding several outputs: the shape of a template copied by hand
 * (`tone="before"`: dashed, blank tiles) or of a system configured per brand
 * (`tone="after"`: solid, each tile in its own colour). The tiles are someone
 * else's interface, so they keep their own colours.
 */
export function StudyFanout({
  source,
  sourceNote,
  targets,
  targetNote,
  tone,
}: {
  source: string
  sourceNote: string
  targets: FanoutTarget[]
  targetNote: string
  tone: "before" | "after"
}) {
  const w = 360
  const step = w / targets.length
  const after = tone === "after"
  return (
    <svg viewBox="0 0 360 250" role="img" aria-label={`${source}: ${targets.map((t) => t.name).join(", ")}, ${targetNote}`} className="h-auto w-full overflow-visible">
      <g transform="translate(100,6)">
        <rect
          width="160"
          height="56"
          rx="3"
          fill={after ? "var(--surface-1)" : "none"}
          stroke={after ? "var(--foreground)" : "var(--text-muted)"}
          strokeDasharray={after ? undefined : "3 4"}
        />
        <text x="80" y="24" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-muted)">
          {sourceNote}
        </text>
        <text x="80" y="42" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--foreground)">
          {source}
        </text>
      </g>
      <g fill="none" stroke={after ? "var(--accent)" : "var(--text-muted)"} strokeDasharray={after ? undefined : "3 4"}>
        {targets.map((_, i) => (
          <path key={i} d={`M 180 62 C 180 100 ${step * i + step / 2} 100 ${step * i + step / 2} 140`} />
        ))}
      </g>
      {targets.map((t, i) => {
        const x = step * i + (step - 92) / 2
        return (
          <g key={t.name} transform={`translate(${x},140)`}>
            <rect
              width="92"
              height="104"
              rx="3"
              fill={after && t.color ? t.color : "none"}
              stroke={after && t.color ? t.color : "var(--text-muted)"}
              strokeDasharray={after ? undefined : "3 4"}
            />
            <rect x="12" y="14" width="56" height="5" fill={after && t.color ? "#ffffff" : "var(--border)"} opacity={after ? 0.6 : 1} />
            <rect x="12" y="26" width="40" height="5" fill={after && t.color ? "#ffffff" : "var(--border)"} opacity={after ? 0.9 : 1} />
            <text x="46" y="74" textAnchor="middle" fontSize="12" fontWeight="600" fill={after && t.color ? "#ffffff" : "var(--foreground)"}>
              {t.name}
            </text>
            <text x="46" y="90" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill={after && t.color ? "#ffffff" : "var(--text-muted)"}>
              {targetNote}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
