"use client"

import { useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

/**
 * ExpandingSwatches — the brand bento's signature reactive piece.
 *
 * A horizontal row of colour strips. Hovering (or keyboard-focusing) a strip
 * widens it and reveals a "Copy" pill that writes the hex to the clipboard;
 * the pill's icon flips to a check for ~1.3s. The width change is gated behind
 * `motion-safe:` so reduced-motion users get an instant swap (the pill and copy
 * still work). Each strip is a real <button> so it's reachable by keyboard.
 */

export interface SwatchItem {
  hex: string
  name: string
}

/** Emerald accent ramp + a true-gray neutral set — the portfolio's own tokens. */
const DEFAULT_SWATCHES: SwatchItem[] = [
  { hex: "#d6d3d1", name: "Mist" },
  { hex: "#064e3b", name: "Emerald 900" },
  { hex: "#047857", name: "Emerald 700" },
  { hex: "#059669", name: "Emerald 600" },
  { hex: "#34d399", name: "Emerald 400" },
]

/** Relative luminance → pick black or white text for legibility on the swatch. */
function readableInk(hex: string): "#fff" | "#111" {
  const n = hex.replace("#", "")
  const r = parseInt(n.slice(0, 2), 16) / 255
  const g = parseInt(n.slice(2, 4), 16) / 255
  const b = parseInt(n.slice(4, 6), 16) / 255
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum > 0.6 ? "#111" : "#fff"
}

export function ExpandingSwatches({
  swatches = DEFAULT_SWATCHES,
  className,
}: {
  swatches?: SwatchItem[]
  className?: string
}) {
  const [copied, setCopied] = useState<string | null>(null)

  function copy(hex: string) {
    navigator.clipboard?.writeText(hex)
    setCopied(hex)
    window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1300)
  }

  return (
    <div className={cn("flex h-full w-full gap-2", className)}>
      {swatches.map((s) => {
        const ink = readableInk(s.hex)
        const isCopied = copied === s.hex
        return (
          <button
            key={s.hex}
            type="button"
            onClick={() => copy(s.hex)}
            title={`Copy ${s.hex}`}
            aria-label={`${s.name} ${s.hex}. Copy hex.`}
            style={{ background: s.hex }}
            className={cn(
              "group/strip relative isolate flex-1 overflow-hidden rounded-lg",
              "outline-none ring-1 ring-inset ring-black/10 dark:ring-white/15",
              "motion-safe:transition-[flex-grow] motion-safe:duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "hover:grow-[3] focus-visible:grow-[3]",
              "focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {/* Copy pill — appears only when this strip is the active/expanded one */}
            <span
              className={cn(
                "pointer-events-none absolute left-2 top-2 flex items-center gap-1.5",
                "rounded-full bg-neutral-900/90 px-2.5 py-1 text-white",
                "text-[11px] font-medium tracking-tight",
                "opacity-0 translate-y-0.5 transition-all duration-300 ease-out",
                "group-hover/strip:opacity-100 group-hover/strip:translate-y-0",
                "group-focus-visible/strip:opacity-100 group-focus-visible/strip:translate-y-0"
              )}
            >
              {isCopied ? <IconCheck size={12} /> : <IconCopy size={12} />}
              {isCopied ? "Copied" : "Copy"}
            </span>

            {/* Name + hex, revealed at the bottom of the expanded strip */}
            <span
              style={{ color: ink }}
              className={cn(
                "pointer-events-none absolute inset-x-2 bottom-2 flex flex-col gap-0.5 text-left",
                "opacity-0 transition-opacity duration-300 delay-75",
                "group-hover/strip:opacity-90 group-focus-visible/strip:opacity-90"
              )}
            >
              <span className="truncate text-[11px] font-semibold leading-none">{s.name}</span>
              <span className="font-mono text-[10px] uppercase leading-none opacity-80">
                {s.hex}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
