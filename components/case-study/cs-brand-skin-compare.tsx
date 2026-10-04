"use client"

import { useState, type CSSProperties } from "react"
import clsx from "clsx"

import { BeforeAfter } from "@/components/shared/before-after/before-after"

/**
 * CsBrandSkinCompare — the white-label claim made draggable.
 *
 * One banking screen, rendered twice from the same markup. The only thing that
 * differs between the two layers is the brand token object passed in as CSS
 * variables, so wiping the divider shows exactly what a config swap changes
 * (and, just as importantly, what it doesn't).
 *
 * The screen is a fixed light "product" surface rather than site-themed: it
 * stands in for a prospect's app, not for this portfolio's UI.
 */

export interface BrandSkin {
  id: string
  bank: string
  primary: string
  /** Second stop of the account-card gradient. */
  deep: string
  radius: string
  /** Shown in the token table. */
  fontLabel: string
  fontStack: string
}

const TXNS = [
  { name: "Salary · Acme Ltd", date: "Sep 26", amount: "+4,200.00", credit: true },
  { name: "Rent transfer", date: "Sep 25", amount: "−1,450.00" },
  { name: "Grocer & Co", date: "Sep 24", amount: "−86.40" },
  { name: "City Transit", date: "Sep 23", amount: "−12.00" },
]

function BankScreen({ skin }: { skin: BrandSkin }) {
  const vars = {
    "--b-primary": skin.primary,
    "--b-deep": skin.deep,
    "--b-radius": skin.radius,
    fontFamily: skin.fontStack,
  } as CSSProperties

  return (
    // Top padding clears the BeforeAfter corner labels so they never sit on the top bar.
    <div style={vars} className="bg-[#f6f6f4] px-4 pt-12 pb-4 text-[#16181a] sm:px-6 sm:pb-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="size-6 rounded-[calc(var(--b-radius)*0.5)] bg-[var(--b-primary)]" />
          <span className="text-sm font-semibold tracking-tight">{skin.bank}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#5d6166]">
          <span className="hidden sm:inline">Accounts</span>
          <span className="hidden sm:inline">Payments</span>
          <span className="size-7 rounded-full bg-[#e3e3df]" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_1fr]">
        {/* Account card */}
        <div className="flex flex-col gap-4">
          <div
            className="relative flex h-32 flex-col justify-between overflow-hidden rounded-[var(--b-radius)] p-4 text-white sm:h-36"
            style={{ background: "linear-gradient(135deg, var(--b-primary), var(--b-deep))" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.18),transparent_55%)]" />
            <div className="relative flex items-start justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/85">
                Current account
              </span>
              <span className="h-4 w-6 rounded-[3px] bg-white/25" />
            </div>
            <div className="relative">
              <p className="text-[11px] text-white/75">Available balance</p>
              <p className="text-2xl font-semibold tracking-tight">£12,480.22</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {["Transfer", "Pay", "Statements"].map((a) => (
              <div
                key={a}
                className="rounded-[calc(var(--b-radius)*0.75)] border border-[#e1e1dc] bg-white px-2 py-2.5 text-center text-[11px] font-medium"
              >
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-[var(--b-radius)] border border-[#e1e1dc] bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">Recent activity</p>
            <p className="text-[11px] font-medium text-[var(--b-primary)]">See all</p>
          </div>
          <ul className="mt-3 divide-y divide-[#efefeb]">
            {TXNS.map((t) => (
              <li key={t.name} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[12px] font-medium">{t.name}</p>
                  <p className="text-[11px] text-[#5d6166]">{t.date}</p>
                </div>
                <p
                  className={clsx(
                    "font-mono text-[12px]",
                    t.credit ? "text-[var(--b-primary)]" : "text-[#16181a]"
                  )}
                >
                  {t.amount}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-3 rounded-[calc(var(--b-radius)*0.75)] bg-[var(--b-primary)] py-2 text-center text-[12px] font-semibold text-white">
            Move money
          </div>
        </div>
      </div>
    </div>
  )
}

export interface CsBrandSkinCompareProps {
  /** The fixed skin on the left of the divider. */
  base: BrandSkin
  /** Skins the reader can pick for the right-hand side. */
  alternates: BrandSkin[]
  className?: string
}

export function CsBrandSkinCompare({ base, alternates, className }: CsBrandSkinCompareProps) {
  const [activeId, setActiveId] = useState(alternates[0]?.id)
  const active = alternates.find((s) => s.id === activeId) ?? alternates[0]

  const rows: [string, string, string][] = [
    ["primary", base.primary, active.primary],
    ["radius", base.radius, active.radius],
    ["font", base.fontLabel, active.fontLabel],
    ["components", "unchanged", "unchanged"],
  ]

  return (
    <div className={clsx("flex flex-col gap-5", className)}>
      {alternates.length > 1 && (
        <div role="group" aria-label="Compare against" className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[13px] text-muted-foreground">Compare {base.bank} with</span>
          {alternates.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={s.id === active.id}
              onClick={() => setActiveId(s.id)}
              className={clsx(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                s.id === active.id
                  ? "border-foreground/40 bg-foreground/[0.06] text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground"
              )}
            >
              <span className="size-2.5 rounded-full" style={{ background: s.primary }} />
              {s.bank}
            </button>
          ))}
        </div>
      )}

      <BeforeAfter
        before={<BankScreen skin={base} />}
        after={<BankScreen skin={active} />}
        beforeLabel={base.bank}
        afterLabel={active.bank}
        ariaLabel={`Wipe between the ${base.bank} and ${active.bank} brand skins`}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[22rem] font-mono text-[12px]">
          <caption className="sr-only">Token values for each brand skin</caption>
          <thead>
            <tr className="text-left text-muted-foreground">
              <th scope="col" className="py-2 pr-4 font-normal">token</th>
              <th scope="col" className="py-2 pr-4 font-normal">{base.bank}</th>
              <th scope="col" className="py-2 font-normal">{active.bank}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map(([k, a, b]) => (
              <tr key={k}>
                <th scope="row" className="py-2 pr-4 text-left font-normal text-muted-foreground">{k}</th>
                <td className="py-2 pr-4 text-foreground">{a}</td>
                <td className={clsx("py-2", a !== b ? "text-foreground" : "text-muted-foreground")}>{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
