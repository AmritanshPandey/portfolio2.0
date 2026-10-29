"use client"

import { useState } from "react"
import clsx from "clsx"
import { partnerBankBanks } from "@/lib/data/partnerbank"

/**
 * The brand layer, working: one PartnerBank account card, re-skinned live by
 * a bank's token file. The chips are the token files; pointing at one (or
 * pressing it) swaps the card's variables, and only colour, corner and weight
 * change, never the layout, which is the case study's argument in one move.
 * The card is a product mockup, so it keeps the banks' own palettes and radii
 * (DESIGN.md §2). No auto-cycling: it changes only when the reader asks.
 */
export function TokenSkin() {
  const [active, setActive] = useState(0)
  const bank = partnerBankBanks[active]

  return (
    <div className="mt-4">
      <p className="ledger-label flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span>per deal →</span>
        {partnerBankBanks.map((b, i) => (
          <button
            key={b.file}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setActive(i)
            }}
            className={clsx(
              "border px-1.5 py-0.5 transition-[color,border-color] duration-200",
              i === active ? "border-accent text-accent" : "border-border text-foreground hover:border-foreground",
            )}
          >
            {b.file}
          </button>
        ))}
      </p>

      {/* The same card, three brands: only the variables change. */}
      <div
        data-keep-radius
        aria-label={`${bank.name} account card, re-skinned by ${bank.file}`}
        role="img"
        className="token-card mt-5 w-full max-w-[22rem] overflow-hidden"
        style={{
          ["--bank-primary" as string]: bank.from,
          ["--bank-deep" as string]: bank.to,
          ["--bank-radius" as string]: `${bank.radius}px`,
          ["--bank-weight" as string]: bank.weight,
        }}
      >
        <div className="token-card-head flex items-start justify-between px-4 pb-6 pt-4 text-white">
          <span className="text-[15px] tracking-[-0.01em]" style={{ fontWeight: "var(--bank-weight)" }}>
            {bank.name}
          </span>
          <span aria-hidden className="token-card-chip h-5 w-7" />
        </div>
        <div className="space-y-3 bg-[#FBFAF7] px-4 py-4 text-[#111]">
          <div className="flex items-baseline justify-between text-[12px] text-[#5C5A55]">
            <span>{bank.type}</span>
            <span className="font-mono tabular-nums">•••• {bank.num}</span>
          </div>
          <div>
            <p className="text-[11px] text-[#5C5A55]">Available balance</p>
            <p className="text-[24px] leading-tight tracking-[-0.02em] tabular-nums" style={{ fontWeight: "var(--bank-weight)" }}>
              12,480.20
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <span className="token-card-cta px-3 py-1.5 text-[12px] text-white" style={{ fontWeight: "var(--bank-weight)" }}>
              Transfer
            </span>
            <span className="token-card-ghost px-3 py-1.5 text-[12px]">Statements</span>
          </div>
        </div>
      </div>
    </div>
  )
}
