"use client"

import { useEffect, useRef } from "react"
import clsx from "clsx"
import { useAmbientMode } from "@/hooks/use-ambient-still"

/**
 * An ASCII field: a grid of Martian Mono glyphs drawn on a canvas, whose
 * picture comes from a motif (a function of position and time). Graphite
 * glyphs for the picture, ultramarine where the motif points at something,
 * and the page's paper showing through.
 *
 * - Cursor: the glyphs under the pointer lens outward and warm to the accent.
 * - Entrance: the picture resolves left to right out of scrambled glyphs the
 *   first time the field comes on screen.
 * - Several motifs: `index` picks one; changing it decodes from one picture
 *   into the next.
 * - `energyFrom`: the closest ancestor matching this selector (a work row)
 *   raises `energy` while hovered or focused, for motifs that run harder then.
 *
 * Runs only on desktop pointers (useAmbientMode), at 30fps, only while on
 * screen and the tab is visible. Elsewhere, and under reduced motion, it
 * draws one resolved frame. Glyphs are stamped from an atlas drawn once per
 * theme, so a frame is a run of drawImage calls. Decorative: aria-hidden.
 */

export interface FieldState {
  /** Width over height of the field. */
  aspect: number
  /** Pointer position, 0..1 across and down, eased. */
  px: number
  py: number
  /** 1 while the pointer is over the field, eased. */
  pull: number
  /** 1 while the host row is hovered or focused, eased. */
  energy: number
  /** One cell's width and height, in the same 0..1 units as x and y, so a
   *  motif can draw lines exactly one glyph thick. */
  cx: number
  cy: number
}

/** What a motif writes for one cell: brightness and accent, both 0..1. */
export interface CellOut {
  b: number
  a: number
  /** A specific glyph (see G) instead of one picked by brightness. */
  g?: number
}

export interface Motif {
  /** Once per frame, before the cells: advance anything shared by all cells. */
  frame?: (t: number, f: FieldState) => void
  /** One cell at (x, y), each 0..1. */
  cell: (x: number, y: number, t: number, out: CellOut, f: FieldState) => void
  /** The moment held for the still frame, in seconds. */
  still?: number
}

// Light to dense. The first glyph is the paper itself. After the ramp come
// the line glyphs a motif can ask for by name (G).
const RAMP = " .:-=+*#%@"
const LINES = "/\\|_o<^~"
const GLYPHS = RAMP + LINES
export const G = {
  dash: RAMP.indexOf("-"),
  rise: RAMP.length,
  fall: RAMP.length + 1,
  bar: RAMP.length + 2,
  floor: RAMP.length + 3,
  ring: RAMP.length + 4,
  lt: RAMP.length + 5,
  caret: RAMP.length + 6,
  tilde: RAMP.length + 7,
  dot: RAMP.indexOf("."),
  colon: RAMP.indexOf(":"),
  equals: RAMP.indexOf("="),
  plus: RAMP.indexOf("+"),
  star: RAMP.indexOf("*"),
  hash: RAMP.indexOf("#"),
  at: RAMP.indexOf("@"),
} as const
const LEVELS = 6
const FPS = 30
const REVEAL_MS = 1500
const BLEND_MS = 760

type RGB = [number, number, number]

const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)

export function AsciiField({
  motifs,
  index = 0,
  cell = 9,
  energyFrom,
  className,
}: {
  motifs: Motif[]
  index?: number
  /** Cell width in CSS pixels; height is 1.55×. */
  cell?: number
  energyFrom?: string
  className?: string
}) {
  const mode = useAmbientMode("desktop")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const indexRef = useRef(index)
  const motifsRef = useRef(motifs)
  const onIndex = useRef<() => void>(() => {})

  useEffect(() => {
    motifsRef.current = motifs
  }, [motifs])

  useEffect(() => {
    indexRef.current = index
    onIndex.current()
  }, [index])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !mode) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const live = mode === "live" && !matchMedia("(prefers-reduced-motion: reduce)").matches

    const cw = cell
    const ch = Math.round(cell * 1.6)
    const family = getComputedStyle(document.body).getPropertyValue("--ff-mono").trim()
    const font = `400 ${Math.round(cell * 1.3)}px ${family ? `${family}, ` : ""}ui-monospace, Menlo, monospace`

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let ox = 0
    let oy = 0
    let dpr = 1
    let sweep = new Float32Array(0)
    let seed = new Float32Array(0)
    const state: FieldState = { aspect: 1, px: 0.5, py: 0.5, pull: 0, energy: 0, cx: 0.01, cy: 0.01 }
    const aim = { px: 0.5, py: 0.5, pull: 0, energy: 0 }
    const out: CellOut = { b: 0, a: 0 }
    const from: CellOut = { b: 0, a: 0 }

    // ── Colours and the glyph atlas ─────────────────────────────────────
    const probe = document.createElement("canvas").getContext("2d", { willReadFrequently: true })
    const toRGB = (value: string, fallback: RGB): RGB => {
      if (!probe || !value) return fallback
      probe.clearRect(0, 0, 1, 1)
      probe.fillStyle = "#000"
      probe.fillStyle = value
      probe.fillRect(0, 0, 1, 1)
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
      return [r, g, b]
    }
    let atlas: HTMLCanvasElement | null = null
    const buildAtlas = () => {
      const style = getComputedStyle(canvas)
      const base = toRGB(style.getPropertyValue("--text-muted").trim(), [92, 90, 85])
      const hot = toRGB(style.getPropertyValue("--accent").trim(), [43, 53, 232])
      const sheet = document.createElement("canvas")
      sheet.width = Math.ceil(GLYPHS.length * cw * dpr)
      sheet.height = Math.ceil(LEVELS * ch * dpr)
      const a = sheet.getContext("2d")
      if (!a) return
      a.scale(dpr, dpr)
      a.font = font
      a.textAlign = "center"
      a.textBaseline = "middle"
      for (let l = 0; l < LEVELS; l++) {
        const k = l / (LEVELS - 1)
        a.fillStyle = `rgb(${base.map((c, i) => Math.round(c + (hot[i] - c) * k)).join(" ")})`
        for (let g = 1; g < GLYPHS.length; g++) a.fillText(GLYPHS[g], g * cw + cw / 2, l * ch + ch / 2)
      }
      atlas = sheet
    }

    // ── Size ────────────────────────────────────────────────────────────
    const fit = () => {
      const box = canvas.getBoundingClientRect()
      if (!box.width || !box.height) return false
      width = box.width
      height = box.height
      dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      cols = Math.floor(width / cw)
      rows = Math.floor(height / ch)
      ox = (width - cols * cw) / 2
      oy = (height - rows * ch) / 2
      state.aspect = width / height
      state.cx = 1 / Math.max(1, cols)
      state.cy = 1 / Math.max(1, rows)
      sweep = new Float32Array(cols * rows)
      seed = new Float32Array(cols * rows)
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          seed[i] = Math.random()
          sweep[i] = 0.72 * (c / Math.max(1, cols - 1)) + 0.22 * Math.random()
        }
      buildAtlas()
      return true
    }

    // ── One frame ───────────────────────────────────────────────────────
    let t = 0
    let reveal = live ? 0 : 1
    let shownIndex = indexRef.current
    let blendFrom = -1
    let blendAt = 0

    const draw = (now: number) => {
      if (!atlas || !cols) return
      const list = motifsRef.current
      const motif = list[shownIndex] ?? list[0]
      if (!motif) return
      let k = 1
      let prev: Motif | undefined
      if (blendFrom >= 0) {
        k = Math.min(1, (now - blendAt) / BLEND_MS)
        if (k >= 1) blendFrom = -1
        else prev = list[blendFrom]
      }
      const e = easeInOut(k)
      const noise = prev ? Math.sin(k * Math.PI) : 0

      motif.frame?.(t, state)
      prev?.frame?.(t, state)

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const sw = cw * dpr
      const sh = ch * dpr
      const { aspect, px, py, pull } = state
      const top = RAMP.length - 1

      for (let r = 0; r < rows; r++) {
        const y = (r + 0.5) / rows
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const x = (c + 0.5) / cols
          const gate = reveal - sweep[i]
          if (gate < 0) continue

          // The pointer's lens: pull samples toward it, so the picture under
          // it swells, and warm what it touches.
          let lens = 0
          let sx = x
          let sy = y
          if (pull > 0.001) {
            const dx = (x - px) * aspect
            const dy = y - py
            lens = pull * Math.exp(-(dx * dx + dy * dy) / 0.022)
            sx = x - (x - px) * lens * 0.32
            sy = y - (y - py) * lens * 0.32
          }

          out.b = 0
          out.a = 0
          out.g = 0
          motif.cell(sx, sy, t, out, state)
          let b = out.b
          let a = out.a
          let pick = out.g ?? 0
          if (prev) {
            from.b = 0
            from.a = 0
            from.g = 0
            prev.cell(sx, sy, t, from, state)
            b = from.b + (b - from.b) * e
            a = from.a + (a - from.a) * e
            if (e < 0.5) pick = from.g ?? 0
          }
          if (lens) {
            b += lens * 0.34 * (0.35 + b)
            a = Math.max(a, lens * 0.9)
          }

          let g: number
          let level: number
          let alpha: number
          if (gate < 0.04 || seed[i] < noise * 0.22) {
            // Still resolving: a light scrambled glyph, in the accent.
            if (b < 0.035 && seed[i] > 0.5) continue
            g = 1 + Math.floor(((seed[i] * 97 + t * 9) % 1) * 5)
            level = LEVELS - 2
            alpha = 0.5
          } else {
            if (b < 0.035) continue
            if (b > 1) b = 1
            g = pick || Math.max(1, Math.round(b * top))
            level = Math.round(Math.min(1, a) * (LEVELS - 1))
            alpha = 0.14 + 0.86 * Math.pow(b, 0.75)
          }
          ctx.globalAlpha = alpha
          ctx.drawImage(atlas, g * sw, level * sh, sw, sh, ox + c * cw, oy + r * ch, cw, ch)
        }
      }
      ctx.globalAlpha = 1
    }

    // ── Loop ────────────────────────────────────────────────────────────
    let raf = 0
    let last = 0
    let drawn = 0
    let onScreen = false
    let revealing = false

    const still = () => {
      const motif = motifsRef.current[indexRef.current]
      shownIndex = indexRef.current
      blendFrom = -1
      t = motif?.still ?? 2
      reveal = 1
      draw(performance.now())
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.1, (now - last) / 1000)
      if (now - drawn < 1000 / FPS - 2) return
      last = now
      drawn = now
      t += dt
      const ease = 1 - Math.exp(-dt * 7)
      state.px += (aim.px - state.px) * ease
      state.py += (aim.py - state.py) * ease
      state.pull += (aim.pull - state.pull) * ease
      state.energy += (aim.energy - state.energy) * (1 - Math.exp(-dt * 4))
      if (revealing) {
        reveal = Math.min(1.1, reveal + (dt * 1000) / REVEAL_MS)
        if (reveal >= 1.1) revealing = false
      }
      draw(now)
    }
    const run = (on: boolean) => {
      if (on && !raf) {
        last = drawn = performance.now() - 1000
        raf = requestAnimationFrame(tick)
      } else if (!on && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    const decide = () => run(live && onScreen && !document.hidden)

    onIndex.current = () => {
      const next = indexRef.current
      if (next === shownIndex) return
      if (!live) return still()
      blendFrom = shownIndex
      blendAt = performance.now()
      shownIndex = next
    }

    const ready = document.fonts?.load(font).catch(() => undefined) ?? Promise.resolve()
    let disposed = false

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen && live && reveal === 0) revealing = true
      decide()
    })
    const ro = new ResizeObserver(() => {
      if (fit() && !live) still()
    })
    void ready.then(() => {
      if (disposed) return
      fit()
      if (!live) still()
      io.observe(canvas)
      ro.observe(canvas)
    })

    const theme = new MutationObserver(() => {
      buildAtlas()
      if (!live) still()
    })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    document.addEventListener("visibilitychange", decide)

    // ── Pointer and host ────────────────────────────────────────────────
    const move = (e: PointerEvent) => {
      if (!width) return
      aim.px = e.offsetX / width
      aim.py = e.offsetY / height
      aim.pull = 1
    }
    const enter = (e: PointerEvent) => {
      move(e)
      // Start the lens where the pointer came in, not from the middle.
      if (state.pull < 0.05) {
        state.px = aim.px
        state.py = aim.py
      }
    }
    const leave = () => {
      aim.pull = 0
    }
    const host = energyFrom ? canvas.closest<HTMLElement>(energyFrom) : null
    const hot = () => {
      aim.energy = 1
    }
    const cold = () => {
      aim.energy = 0
    }
    if (live) {
      canvas.addEventListener("pointerenter", enter)
      canvas.addEventListener("pointermove", move)
      canvas.addEventListener("pointerleave", leave)
      host?.addEventListener("pointerenter", hot)
      host?.addEventListener("pointerleave", cold)
      host?.addEventListener("focusin", hot)
      host?.addEventListener("focusout", cold)
    }

    return () => {
      disposed = true
      run(false)
      io.disconnect()
      ro.disconnect()
      theme.disconnect()
      onIndex.current = () => {}
      document.removeEventListener("visibilitychange", decide)
      canvas.removeEventListener("pointerenter", enter)
      canvas.removeEventListener("pointermove", move)
      canvas.removeEventListener("pointerleave", leave)
      host?.removeEventListener("pointerenter", hot)
      host?.removeEventListener("pointerleave", cold)
      host?.removeEventListener("focusin", hot)
      host?.removeEventListener("focusout", cold)
    }
  }, [mode, cell, energyFrom])

  return <canvas ref={canvasRef} aria-hidden className={clsx("block h-full w-full", className)} />
}

/* ── Helpers for motifs ──────────────────────────────────────────────────── */

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const smooth = (e0: number, e1: number, v: number) => {
  const k = clamp01((v - e0) / (e1 - e0))
  return k * k * (3 - 2 * k)
}
/** 1 inside a band of half-width `w` around 0, fading over `soft`. */
export const band = (d: number, w: number, soft = w) => 1 - smooth(w, w + soft, Math.abs(d))

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
/** Smooth value noise, roughly 0..1. */
export function noise(x: number, y: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy
}

/** Distance from (x, y) to the segment a→b, in the same units. */
export function segment(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax
  const dy = by - ay
  const k = clamp01(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1))
  const ex = x - (ax + dx * k)
  const ey = y - (ay + dy * k)
  return Math.sqrt(ex * ex + ey * ey)
}

/** Signed distance to a box centred at (cx, cy) with half-sizes hw, hh. */
export function box(x: number, y: number, cx: number, cy: number, hw: number, hh: number) {
  const dx = Math.abs(x - cx) - hw
  const dy = Math.abs(y - cy) - hh
  const ox = Math.max(dx, 0)
  const oy = Math.max(dy, 0)
  return Math.sqrt(ox * ox + oy * oy) + Math.min(Math.max(dx, dy), 0)
}

/** A paper-grain floor so empty space still reads as a field of type: a
 *  faint dot on most cells, drifting slowly. */
export const grain = (x: number, y: number, t: number) => (noise(x * 11 + t * 0.12, y * 11) > 0.32 ? 0.06 : 0)

/** The line glyph for a stroke heading along (dx, dy), read on screen (y
 *  grows downward): - / \ or |. Pass the field's aspect when dx is in
 *  field units (0..1 across), 1 when it is already in screen proportion. */
export function stroke(dx: number, dy: number, aspect = 1) {
  const s = dy / (dx || 1e-6) / aspect
  const a = Math.abs(s)
  if (a < 0.35) return G.dash
  if (a > 2.6) return G.bar
  return s < 0 ? G.rise : G.fall
}

/** The glyph for a box's outline at (x, y) (corners +, sides | and -), or 0
 *  off the outline. One cell thick. */
export function outline(x: number, y: number, cx: number, cy: number, hw: number, hh: number, f: FieldState) {
  const inX = x > cx - hw && x < cx + hw
  const inY = y > cy - hh && y < cy + hh
  const onX = onCell(x, cx - hw, f.cx) || onCell(x, cx + hw, f.cx)
  const onY = onCell(y, cy - hh, f.cy) || onCell(y, cy + hh, f.cy)
  if (onX && onY) return G.plus
  if (onY && inX) return G.dash
  if (onX && inY) return G.bar
  return 0
}

/** Whether `v` and `at` fall in the same cell (of size `c`): a mark exactly
 *  one glyph wide, wherever the cell edges land. */
export const onCell = (v: number, at: number, c: number) => Math.floor(v / c) === Math.floor(at / c)

/** Whether (x, y) lies on a curve passing `cy` at this x with slope `slope`
 *  (dy/dx in field units): one cell thick, thicker where it is steep so a
 *  steep stretch doesn't break into dots. */
export const onCurve = (y: number, cy: number, slope: number, f: FieldState) =>
  onCell(y, cy, f.cy) || Math.abs(y - cy) < Math.abs(slope) * f.cx * 0.42
