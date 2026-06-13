"use client"

import { useState } from "react"
import { hexToHsl, hslToHex } from "@/lib/color"
import { at } from "@/lib/scale"
import { Panel, Seg } from "./ui"
import { useColorSystem } from "./context"

// ════════════════════════════════════════════════════════════════════════════
// 16 · TOKEN TAXONOMY  (global → alias → component, from the shared system)
// ════════════════════════════════════════════════════════════════════════════

const COMPONENT = [
  { tok: "--button-primary-bg", alias: "--color-action" },
  { tok: "--button-primary-bg-hover", alias: "--color-action-hover" },
  { tok: "--card-surface", alias: "--color-surface" },
  { tok: "--input-border", alias: "--color-border" },
  { tok: "--alert-danger-fg", alias: "--color-danger" },
]

function Tier({ n, name, val, mono = true, swatch }: { n: string; name: string; val: string; mono?: boolean; swatch?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3">
      <span className="font-mono text-[10px] text-rose-600 dark:text-rose-400 w-6 shrink-0">{n}</span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{name}</p>
        <p className={`text-[13px] text-foreground truncate ${mono ? "font-mono" : ""}`}>{val}</p>
      </div>
      {swatch && <span className="ml-auto w-7 h-7 rounded-md border border-border shrink-0" style={{ background: swatch }} />}
    </div>
  )
}

export function TokenTaxonomy() {
  const { system, name } = useColorSystem()
  const P = system.primary, N = system.neutral, E = system.semMap.error
  const [sel, setSel] = useState(COMPONENT[0].tok)

  const GLOBAL: Record<string, string> = {
    [`${name}-600`]: at(P, 600), [`${name}-500`]: at(P, 500),
    "neutral-50": at(N, 50), "neutral-200": at(N, 200), "neutral-900": at(N, 900),
    "error-600": at(E, 600),
  }
  const ALIAS: Record<string, string> = {
    "--color-action": `${name}-600`, "--color-action-hover": `${name}-500`,
    "--color-surface": "neutral-50", "--color-border": "neutral-200",
    "--color-text": "neutral-900", "--color-danger": "error-600",
  }

  const comp = COMPONENT.find(c => c.tok === sel)!
  const globalName = ALIAS[comp.alias]
  const hex = GLOBAL[globalName]

  return (
    <Panel>
      <div className="grid md:grid-cols-[200px_1fr]">
        <div className="p-4 border-b md:border-b-0 md:border-r border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-3">Component tokens</p>
          <div className="flex flex-col gap-1.5">
            {COMPONENT.map(c => (
              <button key={c.tok} onClick={() => setSel(c.tok)}
                className={`text-left font-mono text-[11px] px-2.5 py-1.5 rounded-md transition-colors ${
                  sel === c.tok ? "bg-rose-500/10 text-accent" : "text-foreground/70 hover:bg-foreground/[0.04]"}`}>
                {c.tok}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 flex flex-col gap-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Resolution chain</p>
          <Tier n="03" name="Component token" val={comp.tok} />
          <span className="text-muted-foreground text-center text-[11px] -my-1">↓ references</span>
          <Tier n="02" name="Alias token (semantic role)" val={comp.alias} />
          <span className="text-muted-foreground text-center text-[11px] -my-1">↓ references</span>
          <Tier n="01" name="Global token (raw scale)" val={globalName} />
          <span className="text-muted-foreground text-center text-[11px] -my-1">↓ resolves to</span>
          <Tier n="—" name="Value" val={hex} swatch={hex} />
          <p className="text-[12px] text-muted-foreground leading-relaxed mt-2">
            Most components should consume <strong className="text-foreground/80 font-medium">alias</strong> tokens directly. A component token (tier 3) is
            only warranted when a component must deliberately diverge — e.g. a brand button that stays one color across every theme. Add them sparingly; each one is a place the system can drift.
          </p>
        </div>
      </div>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 17 · WHEN TO BREAK THE SYSTEM
// ════════════════════════════════════════════════════════════════════════════

const CONTEXTS = [
  { key: "marketing", label: "Marketing", grad: "linear-gradient(135deg,#f43f5e,#db2777,#7c3aed)",
    rule: "Expressive gradients and off-palette hues are encouraged — but body copy, CTAs, and form fields still use system tokens, and text must pass contrast." },
  { key: "empty", label: "Empty state", grad: "linear-gradient(135deg,#22d3ee,#3b82f6)",
    rule: "Illustration palettes may live outside the system. The surrounding UI — buttons, text, the primary action — stays on tokens." },
  { key: "onboarding", label: "Onboarding", grad: "linear-gradient(135deg,#34d399,#10b981,#0d9488)",
    rule: "Celebratory, narrative color is fine to differentiate steps. It must not leak into the product chrome users see every day after." },
  { key: "loading", label: "Loading", grad: "linear-gradient(100deg,#e2e8f0,#f8fafc,#e2e8f0)",
    rule: "Skeletons and shimmers use neutral tokens only — never the brand hue, which would imply content that isn't there yet." },
]

export function BreakTheSystem() {
  const [key, setKey] = useState("marketing")
  const ctx = CONTEXTS.find(c => c.key === key)!

  return (
    <Panel>
      <div className="p-4 border-b border-border/60">
        <Seg label="Context" value={key} onChange={setKey} options={CONTEXTS.map(c => ({ key: c.key, label: c.label }))} />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="p-6">
          <div className="h-44 rounded-xl border border-border/60 relative overflow-hidden flex items-end p-5" style={{ background: ctx.grad }}>
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "16px 16px", opacity: 0.15 }} />
            <span className="relative font-bold text-white text-lg drop-shadow">{ctx.label}</span>
          </div>
        </div>
        <div className="p-6 md:border-l border-t md:border-t-0 border-border/60 flex flex-col justify-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400 mb-2">The policy</p>
          <p className="text-[14px] text-foreground/80 leading-relaxed">{ctx.rule}</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed mt-4">
            “Break the system” isn&apos;t a free pass — it&apos;s a documented exception with a boundary. Naming where off-system color is allowed is what stops every screen from becoming an exception.
          </p>
        </div>
      </div>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 18 · COLOR VERSIONING  (v1 = your primary, v2 = the same hue shifted +30°)
// ════════════════════════════════════════════════════════════════════════════

export function ColorVersioning() {
  const { system, name } = useColorSystem()
  const P = system.primary
  const [ver, setVer] = useState("v1")

  const shift = (hex: string, deg: number) => { const h = hexToHsl(hex); return hslToHex({ h: h.h + deg, s: h.s, l: h.l }) }
  const VERSIONS: Record<string, { label: string; base: string; hover: string; tint: string }> = {
    v1: { label: `${name}-600`, base: at(P, 600), hover: at(P, 500), tint: at(P, 50) },
    v2: { label: `${name}-alt-600`, base: shift(at(P, 600), 32), hover: shift(at(P, 500), 32), tint: shift(at(P, 50), 32) },
  }
  const c = VERSIONS[ver]

  return (
    <Panel>
      <div className="p-4 border-b border-border/60">
        <Seg label="Brand version" value={ver} onChange={setVer}
          options={[{ key: "v1", label: "v1 — current" }, { key: "v2", label: "v2 — hue +30°" }]} />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="p-6 flex flex-col gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Components (unchanged)</p>
          <button className="text-[13px] font-medium px-4 py-2 rounded-lg text-white self-start transition-colors duration-300" style={{ background: c.base }}>Primary CTA</button>
          <span className="text-[13px] font-medium self-start transition-colors duration-300" style={{ color: c.base }}>Inline link →</span>
          <span className="text-[12px] font-medium px-2.5 py-1 rounded-md self-start transition-colors duration-300" style={{ background: c.tint, color: c.base }}>Active nav item</span>
          <div className="h-1.5 w-40 rounded-full overflow-hidden bg-foreground/10"><div className="h-full w-2/3 transition-colors duration-300" style={{ background: c.base }} /></div>
        </div>

        <div className="p-6 md:border-l border-t md:border-t-0 border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-3">The only edit</p>
          <pre className="font-mono text-[11px] leading-relaxed bg-foreground/[0.04] border border-border rounded-lg p-3 overflow-x-auto">
<span className="text-muted-foreground">{`/* tokens.css */`}</span>{"\n"}
<span className="text-foreground/80">--color-action: </span>
<span className="text-accent">{c.label}</span>
<span className="text-foreground/80">;</span></pre>
          <p className="text-[12px] text-muted-foreground leading-relaxed mt-4">
            Every component references the <code className="font-mono text-[11px]">--color-action</code> alias, never the raw stop.
            Re-pointing that one line migrates the entire product — 200 components move without a single component edit. That indirection is the whole point of the alias tier.
          </p>
        </div>
      </div>
    </Panel>
  )
}
