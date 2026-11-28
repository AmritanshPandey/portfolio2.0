import clsx from "clsx"
import type { CSSProperties } from "react"

/*
 * The Email Builder study's visuals, coded rather than screenshotted: the
 * builder is an internal Mastercard tool, so these are anonymised
 * recreations. The email itself is someone else's interface and keeps its own
 * palette (DESIGN.md §2); everything around it is Ledger.
 */

const delay = (i: number) => ({ ["--i" as string]: i }) as CSSProperties

// ─── Client compatibility ────────────────────────────────────────────────────

const CLIENTS = [
  { name: "Outlook Desktop", status: "breaks", issue: "No div support · tables only · breaks modern CSS" },
  { name: "Outlook Web", status: "breaks", issue: "Inconsistent font rendering · dark mode issues" },
  { name: "Apple Mail", status: "partial", issue: "Good HTML5 support · dark mode needs extra handling" },
  { name: "Gmail", status: "ok", issue: "Strips head styles · inline CSS required" },
  { name: "iOS Mail", status: "ok", issue: "Reliable · good responsive support" },
  { name: "Samsung Mail", status: "partial", issue: "Variable rendering across Android versions" },
] as const

const STATUS = { breaks: "Breaks", partial: "Partial", ok: "Holds" } as const

/** Six email clients, one ruled row each, with how badly each one breaks. */
export function EmailClients() {
  return (
    <ol className="border-b border-border">
      {CLIENTS.map((c, i) => (
        <li
          key={c.name}
          data-settle
          style={delay(i)}
          className={clsx(
            "grid grid-cols-[minmax(0,9rem)_4.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-t py-3",
            c.status === "breaks" ? "border-foreground" : "border-border",
          )}
        >
          <span className="text-[15px] font-semibold text-foreground">{c.name}</span>
          <span className="ledger-label inline-flex items-center gap-2">
            <span
              aria-hidden
              className={clsx(
                "size-[7px] shrink-0",
                c.status === "breaks" ? "bg-accent" : c.status === "partial" ? "border border-current" : "bg-border",
              )}
            />
            {STATUS[c.status]}
          </span>
          <span className="text-[14px] leading-snug text-muted-foreground">{c.issue}</span>
        </li>
      ))}
    </ol>
  )
}

// ─── The Outlook table ───────────────────────────────────────────────────────

const ROWS = [
  ["Layout", "CSS div-based flexible layouts", "No div support, breaks entirely in Outlook Desktop", "Table-based layouts, rigid but universal and reliable"],
  ["Buttons", "CSS-styled dynamic buttons", "CSS buttons partially ignored, inconsistent borders and padding", "VML-backed buttons, renders consistently across all versions"],
  ["Typography", "Web fonts (brand typeface)", "Web fonts not supported, fallback to system fonts only", "Email-safe font stack with brand-aligned fallbacks"],
  ["Dark mode", "Dark mode-aware design", "Outlook inverts colours unpredictably in dark mode", "Tested colour pairs that remain legible in both modes"],
  ["Responsive", "Responsive fluid layouts", "Max-width and media queries inconsistently applied", "Fixed-width core (600px) with mobile-only breakpoint handling"],
  ["Motion", "HTML5 video embeds", "Not supported, blank space or broken placeholder", "Animated GIF with static fallback image, works everywhere"],
]

/** What we wanted, what Outlook allowed, what we built: a real table, ruled. */
export function OutlookTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-foreground">
            {["", "What we wanted", "What Outlook allowed", "What we built"].map((h, i) => (
              <th key={i} scope="col" className="ledger-label py-3 pr-4 font-normal">
                {i === 3 ? (
                  <span className="inline-flex items-center gap-2 text-foreground">
                    <span aria-hidden className="size-[7px] bg-accent" />
                    {h}
                  </span>
                ) : (
                  h
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([criterion, want, allowed, built]) => (
            <tr key={criterion} className="border-b border-border align-top">
              <th scope="row" className="py-4 pr-4 text-[15px] font-semibold text-foreground">{criterion}</th>
              <td className="py-4 pr-4 text-[14px] leading-snug text-muted-foreground line-through decoration-border">{want}</td>
              <td className="py-4 pr-4 text-[14px] leading-snug text-muted-foreground">{allowed}</td>
              <td className="py-4 text-[14px] leading-snug text-foreground">{built}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Before and after ────────────────────────────────────────────────────────

const CODE = [
  { t: '<table width="600" border="0" cellspacing="0">', bad: false },
  { t: '  <tr><td style="padding:0;margin:0;">', bad: false },
  { t: "    <!--[if mso]><v:rect...>", bad: false },
  { t: '    <div style="color:#000"> <!-- breaks in OL -->', bad: true },
  { t: '    <p style="font-family:Arial;">', bad: false },
  { t: "    <!-- font ignored in Outlook 2016 -->", bad: true },
  { t: "    Hello [FIRST_NAME],", bad: false },
  { t: "  <!-- spacing broken on mobile -->", bad: true },
  { t: "</table>", bad: false },
]

const BLOCKS = [
  { label: "Hero banner", type: "Foundation" },
  { label: "Editorial block", type: "Component" },
  { label: "CTA module", type: "Component" },
  { label: "Legal footer", type: "Component" },
]

/** The old workflow (hand-written HTML) beside the new one (a stack of blocks). */
export function BuilderShift() {
  return (
    <div className="grid gap-x-[var(--col-gap)] gap-y-10 md:grid-cols-2">
      <figure>
        <p className="ledger-label mb-3">Before · HTML required</p>
        {/* A code editor: someone else's interface, so its own dark palette. */}
        <div data-keep-radius className="overflow-x-auto rounded-[4px] bg-[#141414] p-5 font-mono text-[12px] leading-[1.8] text-[#b9b6ae]">
          {CODE.map((l, i) => (
            <p key={i} className={clsx("whitespace-pre", l.bad && "text-[#f0a090]")}>{l.t}</p>
          ))}
        </div>
        <figcaption className="mt-3 text-[14px] leading-snug text-muted-foreground">
          Agency dependency · inconsistent output · weeks of turnaround
        </figcaption>
      </figure>
      <figure>
        <p className="ledger-label mb-3 inline-flex items-center gap-2 text-foreground">
          <span aria-hidden className="size-[7px] bg-accent" />
          After · zero HTML required
        </p>
        <ol className="border-b border-border">
          {BLOCKS.map((b, i) => (
            <li
              key={b.label}
              data-settle
              style={delay(i)}
              className="flex items-center gap-4 border-t border-border py-4"
            >
              <span aria-hidden className="grid grid-cols-2 gap-[3px]">
                {Array.from({ length: 6 }, (_, k) => (
                  <span key={k} className="size-[3px] bg-muted-foreground" />
                ))}
              </span>
              <span className="flex-1 text-[15px] font-semibold text-foreground">{b.label}</span>
              <span className="ledger-label">{b.type}</span>
            </li>
          ))}
        </ol>
        <figcaption className="mt-3 text-[14px] leading-snug text-muted-foreground">
          Any team · any region · on-brand · Outlook-safe
        </figcaption>
      </figure>
    </div>
  )
}

// ─── Anatomy of a built email ────────────────────────────────────────────────

const NOTES = [
  { title: "Component picker", text: "Every block comes from the 50+ piece library. Nothing on the canvas can go off-brand, because off-brand is not on the menu." },
  { title: "Composition, not code", text: "An email is a stack of components in an order. The system owns the HTML underneath, including the Outlook workarounds." },
  { title: "Email-safe by construction", text: "Table layout, VML buttons, tested colour pairs. The constraint work is baked into the pieces so authors never see it." },
  { title: "Governed footer", text: "Legal and unsubscribe blocks are locked components. The parts that carry risk are the parts nobody can improvise." },
]

function Mark({ n }: { n: number }) {
  return (
    <span className="absolute -left-3 top-3 z-10 grid size-6 place-items-center bg-[#111111] font-mono text-[11px] text-white">
      {n}
    </span>
  )
}

/**
 * An email assembled from four library blocks, with the four things the
 * system does marked on it. A neutral, anonymised sender: no Mastercard marks.
 */
export function EmailAnatomy() {
  return (
    <div className="ledger-grid items-start gap-y-10">
      <div className="col-span-12 lg:col-span-6">
        {/* The inbox: someone else's interface, a fixed light surface. */}
        <div data-keep-radius className="mx-auto max-w-[520px] rounded-[6px] border border-[#d8d6d0] bg-[#eceae6] p-3 text-[#1a1a1a] sm:p-5">
          <div className="mb-3 flex items-center justify-between px-1 text-[12px] text-[#6b6862]">
            <span>From: Creative Studio</span>
            <span>600px · table layout</span>
          </div>
          <div className="relative bg-white">
            <div className="relative">
              <Mark n={1} />
              <div className="bg-[#1f2a44] px-7 pb-8 pt-10 text-white">
                <p className="text-[11px] tracking-[0.02em] text-white/70">Quarterly update</p>
                <p className="mt-2 text-[26px] font-semibold leading-tight">What changed this quarter, in four minutes.</p>
              </div>
            </div>
            <div className="relative px-7 py-6">
              <Mark n={2} />
              <p className="text-[15px] font-semibold">Three launches, one place to read about them</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[#55524c]">
                A short summary of each release, who it is for, and where to find the details. Written once, sent in every region.
              </p>
            </div>
            <div className="relative px-7 pb-7">
              <Mark n={3} />
              <span className="inline-block bg-[#1f2a44] px-5 py-3 text-[13px] font-semibold text-white">Read the update</span>
            </div>
            <div className="relative border-t border-[#e6e4df] bg-[#f6f5f2] px-7 py-5">
              <Mark n={4} />
              <p className="text-[11px] leading-relaxed text-[#7a776f]">
                You are receiving this because you subscribed to product updates. Unsubscribe · Privacy · Contact
              </p>
            </div>
          </div>
        </div>
      </div>
      <ol className="col-span-12 border-b border-border lg:col-span-5 lg:col-start-8">
        {NOTES.map((n, i) => (
          <li key={n.title} data-settle style={delay(i)} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-t border-border py-5">
            <span className="ledger-label pt-[0.2em]">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="text-[16px] font-semibold leading-snug text-foreground">{n.title}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{n.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
