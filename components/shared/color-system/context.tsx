"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { hexToHsl, normalizeHex, type HSL } from "@/lib/color"
import { buildSystem, FEELS, type ColorSystem, type FeelDef } from "@/lib/scale"

interface ColorCtx {
  hex: string
  text: string
  applyHex: (v: string) => void
  name: string
  setName: (v: string) => void
  feelKey: string
  setFeelKey: (v: string) => void
  feel: FeelDef
  hueShift: boolean
  setHueShift: (v: boolean) => void
  baseHsl: HSL
  system: ColorSystem
}

const Ctx = createContext<ColorCtx | null>(null)

export function useColorSystem(): ColorCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error("useColorSystem must be used within <ColorSystemProvider>")
  return v
}

export function ColorSystemProvider({ children }: { children: React.ReactNode }) {
  const [hex, setHex]           = useState("#2563eb")
  const [text, setText]         = useState("#2563eb")
  const [name, setName]         = useState("brand")
  const [feelKey, setFeelKey]   = useState("balanced")
  const [hueShift, setHueShift] = useState(true)

  // Restore from a shared link once on mount (external source → effect).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const c = p.get("c")
    if (c) { const n = normalizeHex(c); if (n) { setHex(n); setText(n) } }
    if (p.get("f")) setFeelKey(p.get("f")!)
    if (p.get("hs")) setHueShift(p.get("hs") === "1")
    if (p.get("n")) setName(p.get("n")!.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "brand")
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const applyHex = (v: string) => {
    setText(v)
    const n = normalizeHex(v)
    if (n) setHex(n)
  }

  const feel    = FEELS.find(f => f.key === feelKey) ?? FEELS[0]
  const baseHsl = useMemo(() => hexToHsl(hex), [hex])
  const system  = useMemo(() => buildSystem(hex, hueShift, feel), [hex, hueShift, feel])

  return (
    <Ctx.Provider value={{ hex, text, applyHex, name, setName, feelKey, setFeelKey, feel, hueShift, setHueShift, baseHsl, system }}>
      {children}
    </Ctx.Provider>
  )
}
