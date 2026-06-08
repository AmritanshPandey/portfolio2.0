"use client"

import { useMemo, useState } from "react"
import { IconCheck, IconCopy, IconLink } from "@tabler/icons-react"
import { contrast, readableInk, rating, BADGE_BG, oklchString } from "@/lib/color"
import { at, type Swatch } from "@/lib/scale"
import { useColorSystem } from "@/components/shared/color-system/context"
import { Switch } from "@/components/shared/color-system/ui"
import { ContrastChecker, TokenMapper, DarkModeMapper } from "@/components/shared/color-system/scale-extras"

/**
 * ColorScaleTool — the generated-scale view + validators + exports.
 *
 * The base color, feel, hue-shift, and scale name now live in the shared
 * ColorSystem context (driven by <PrimaryControls>), so this tool — and every
 * other demo in the section — reflects the same primary. Tool-local concerns
 * (full-system display, contrast badges, preview, export tabs) stay here.
 */

function ScaleRow({
  label, scaleKey, swatches, showA11y, copied, onCopy,
}: {
  label: string; scaleKey: string; swatches: Swatch[]
  showA11y: boolean; copied: string | null; onCopy: (hex: string, key: string) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/70">{label}</span>
      </div>
      <div className="grid grid-cols-6 md:grid-cols-11 rounded-xl overflow-hidden border border-border/60">
        {swatches.map(s => {
          const ink = readableInk(s.hex)
          const r = rating(contrast(s.hex, ink))
          const key = `${scaleKey}-${s.stop}`
          return (
            <button
              key={s.stop}
              onClick={() => onCopy(s.hex, key)}
              className="group relative flex flex-col text-left focus-visible:z-10"
              style={s.anchor ? { outline: "2px solid #f97316", outlineOffset: "-2px", zIndex: 1 } : undefined}
              title={`Copy ${s.hex}`}
            >
              <div className="h-16 md:h-20 flex flex-col justify-between p-1.5" style={{ background: s.hex }}>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[9px] font-semibold" style={{ color: ink, opacity: 0.85 }}>
                    {s.stop}{s.anchor ? " ★" : ""}
                  </span>
                  <span style={{ color: ink }} className="opacity-0 group-hover:opacity-80 transition-opacity">
                    {copied === key ? <IconCheck size={11} /> : <IconCopy size={11} />}
                  </span>
                </div>
                {showA11y && (
                  <span className="self-start font-mono text-[8px] font-semibold px-1 py-px rounded text-white" style={{ background: BADGE_BG[r.kind] }}>
                    {r.label}
                  </span>
                )}
              </div>
              <div className="px-1.5 py-1.5 bg-card border-t border-border/60">
                <span className="font-mono text-[8px] text-muted-foreground block truncate">
                  {copied === key ? "copied" : s.hex.replace("#", "")}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Preview({ P, N, sem }: { P: Swatch[]; N: Swatch[]; sem: Record<string, Swatch[]> }) {
  const SEM = [["success", "Success"], ["warning", "Warning"], ["error", "Error"], ["info", "Info"]] as const
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: at(N, 200), background: at(N, 50) }}>
      <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: `1px solid ${at(N, 200)}` }}>
        <span className="text-[12px] font-semibold px-2.5 py-1 rounded-md" style={{ background: at(P, 100), color: at(P, 700) }}>Home</span>
        <span className="text-[12px] px-2.5 py-1" style={{ color: at(N, 500) }}>Docs</span>
        <span className="text-[12px] px-2.5 py-1" style={{ color: at(N, 500) }}>Pricing</span>
        <span className="ml-auto text-[12px] font-medium" style={{ color: at(P, 600) }}>Sign in →</span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2.5">
          <button className="text-[13px] font-medium px-4 py-2 rounded-lg" style={{ background: at(P, 500), color: readableInk(at(P, 500)) }}>Primary action</button>
          <button className="text-[13px] font-medium px-4 py-2 rounded-lg" style={{ border: `1px solid ${at(P, 500)}`, color: at(P, 600) }}>Secondary</button>
        </div>
        <div className="rounded-lg p-4" style={{ background: "#ffffff", border: `1px solid ${at(N, 200)}` }}>
          <p className="text-[14px] font-semibold mb-1" style={{ color: at(N, 900) }}>Card title</p>
          <p className="text-[12px] leading-relaxed mb-2" style={{ color: at(N, 500) }}>
            Secondary text on a card surface, drawn from the neutral scale. The link below uses the primary hue.
          </p>
          <span className="text-[12px] font-medium" style={{ color: at(P, 600) }}>Learn more →</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SEM.map(([k, label]) => (
            <span key={k} className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: at(sem[k], 100), color: at(sem[k], 700) }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: at(sem[k], 500) }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const FORMATS = ["CSS", "Tailwind", "SCSS", "JSON", "OKLCH"] as const
type Format = (typeof FORMATS)[number]

export function ColorScaleTool() {
  const { hex, name, feelKey, hueShift, system: sys } = useColorSystem()

  const [showSystem, setShowSystem] = useState(false)
  const [showA11y, setShowA11y]     = useState(false)
  const [preview, setPreview]       = useState(false)
  const [tab, setTab]               = useState<"contrast" | "tokens" | "dark">("contrast")
  const [copied, setCopied]         = useState<string | null>(null)

  const exportScales = useMemo(() => {
    if (!showSystem) return [{ name, swatches: sys.primary }]
    return [
      { name, swatches: sys.primary },
      { name: "neutral", swatches: sys.neutral },
      ...sys.semantics.map(s => ({ name: s.key, swatches: s.swatches })),
    ]
  }, [showSystem, name, sys])

  function copy(value: string, key: string) {
    navigator.clipboard?.writeText(value)
    setCopied(key)
    window.setTimeout(() => setCopied(c => (c === key ? null : c)), 1300)
  }

  function buildExport(fmt: Format): string {
    const scales = exportScales
    if (fmt === "JSON") {
      const obj: Record<string, Record<string, string>> = {}
      scales.forEach(sc => { obj[sc.name] = Object.fromEntries(sc.swatches.map(s => [s.stop, s.hex])) })
      return JSON.stringify(obj, null, 2)
    }
    if (fmt === "SCSS") {
      return scales.flatMap(sc => sc.swatches.map(s => `$${sc.name}-${s.stop}: ${s.hex};`)).join("\n")
    }
    if (fmt === "Tailwind") {
      return "{\n" + scales.map(sc =>
        `  ${sc.name}: {\n` + sc.swatches.map(s => `    ${s.stop}: '${s.hex}',`).join("\n") + "\n  },"
      ).join("\n") + "\n}"
    }
    const val = (h: string) => (fmt === "OKLCH" ? oklchString(h) : h)
    return ":root {\n" +
      scales.flatMap(sc => sc.swatches.map(s => `  --color-${sc.name}-${s.stop}: ${val(s.hex)};`)).join("\n") +
      "\n}"
  }

  function shareLink(): string {
    const p = new URLSearchParams({
      c: hex.slice(1), f: feelKey, hs: hueShift ? "1" : "0", n: name,
    })
    const { origin, pathname } = window.location
    return `${origin}${pathname}?${p.toString()}#swatch-scale`
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">

      {/* ── tool-local toggles ── */}
      <div className="p-5 md:p-6 border-b border-border/60 flex items-center gap-x-6 gap-y-3 flex-wrap">
        <Switch on={showSystem} onClick={() => setShowSystem(v => !v)} label="Full system" />
        <Switch on={showA11y}   onClick={() => setShowA11y(v => !v)}   label="Contrast badges" />
        <Switch on={preview}    onClick={() => setPreview(v => !v)}    label="Live preview" />
      </div>

      {/* ── scales ── */}
      <div className="p-5 md:p-6 flex flex-col gap-5">
        <ScaleRow label={name} scaleKey={name} swatches={sys.primary} showA11y={showA11y} copied={copied} onCopy={copy} />
        {showSystem && (
          <>
            <ScaleRow label="neutral" scaleKey="neutral" swatches={sys.neutral} showA11y={showA11y} copied={copied} onCopy={copy} />
            {sys.semantics.map(s => (
              <ScaleRow key={s.key} label={s.key} scaleKey={s.key} swatches={s.swatches} showA11y={showA11y} copied={copied} onCopy={copy} />
            ))}
          </>
        )}
        <p className="text-[11px] text-muted-foreground font-mono tracking-[0.04em] text-center">
          Click any stop to copy its hex · ★ marks the stop nearest your base color
          {showA11y && " · badge = WCAG rating vs. its readable text color"}
        </p>
      </div>

      {/* ── what next: validate / map / dark ── */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-border/40 pt-5">
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mr-1">Use this scale</span>
          {([
            ["contrast", "Contrast checker"],
            ["tokens", "Token map"],
            ["dark", "Dark mode"],
          ] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                tab === k ? "border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
              {label}
            </button>
          ))}
        </div>
        {tab === "contrast" && <ContrastChecker scale={sys.primary} />}
        {tab === "tokens"   && <TokenMapper scale={sys.primary} name={name} />}
        {tab === "dark"     && <DarkModeMapper accent={sys.primary} neutral={sys.neutral} />}
      </div>

      {/* ── preview ── */}
      {preview && (
        <div className="px-5 md:px-6 pb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-3">Live preview</p>
          <Preview P={sys.primary} N={sys.neutral} sem={sys.semMap} />
        </div>
      )}

      {/* ── exports ── */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-border/40 pt-5 flex flex-wrap items-center gap-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mr-1">
          Copy as{showSystem ? " (full system)" : ""}
        </span>
        {FORMATS.map(fmt => (
          <button key={fmt} onClick={() => copy(buildExport(fmt), `fmt-${fmt}`)}
            className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-lg border border-border hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            {copied === `fmt-${fmt}` ? <IconCheck size={13} /> : <IconCopy size={13} />}
            {fmt}
          </button>
        ))}
        <button onClick={() => copy(shareLink(), "link")}
          className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-lg border border-border hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-orange-400 transition-colors ml-auto">
          {copied === "link" ? <IconCheck size={13} /> : <IconLink size={13} />}
          {copied === "link" ? "Link copied" : "Share link"}
        </button>
      </div>
    </div>
  )
}
