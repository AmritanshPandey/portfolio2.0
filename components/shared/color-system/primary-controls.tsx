"use client"

import { normalizeHex } from "@/lib/color"
import { FEELS, PRESETS } from "@/lib/scale"
import { useColorSystem } from "./context"
import { Switch } from "./ui"

/**
 * One control surface that drives every tool + demo in the section through the
 * shared ColorSystem context. Pick a primary here and the whole page reflects it.
 */
export function PrimaryControls() {
  const { hex, text, applyHex, name, setName, feelKey, setFeelKey, hueShift, setHueShift, baseHsl } = useColorSystem()

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.03] overflow-hidden">
      <div className="px-5 md:px-6 py-3 border-b border-rose-500/20 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
          Your primary — drives every tool below
        </span>
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-5">
          <div className="flex items-center gap-3">
            <label className="relative w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0" style={{ background: hex }}>
              <input type="color" value={hex} onChange={e => applyHex(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" aria-label="Pick primary color" />
            </label>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Primary color</span>
              <input value={text} onChange={e => applyHex(e.target.value)} spellCheck={false}
                className="w-28 font-mono text-[13px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:border-rose-500/60 outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Scale name</span>
            <input value={name} onChange={e => setName(e.target.value.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase() || "brand")} spellCheck={false}
              className="w-28 font-mono text-[13px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:border-rose-500/60 outline-none" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Base HSL</span>
            <span className="font-mono text-[13px] text-foreground/70 py-1.5">
              {Math.round(baseHsl.h)}° {Math.round(baseHsl.s)}% {Math.round(baseHsl.l)}%
            </span>
          </div>

          <div className="ml-auto">
            <Switch on={hueShift} onClick={() => setHueShift(!hueShift)} label="Natural hue-shift" />
          </div>
        </div>

        {/* feel */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mr-1">Feel</span>
          {FEELS.map(f => (
            <button key={f.key} onClick={() => setFeelKey(f.key)} title={f.desc} aria-pressed={feelKey === f.key}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                feelKey === f.key ? "border-rose-500/50 bg-rose-500/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mr-1">Presets</span>
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => applyHex(p.hex)} title={p.name} aria-label={`Use ${p.name} preset`}
              className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${
                normalizeHex(text) === p.hex ? "border-foreground/60 ring-2 ring-rose-500/40" : "border-border"}`}
              style={{ background: p.hex }} />
          ))}
        </div>
      </div>
    </div>
  )
}
