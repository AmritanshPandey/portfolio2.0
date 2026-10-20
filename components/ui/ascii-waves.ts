import { seaLines, swellHeight, type SeaLine } from "@/lib/ascii-sea"

// A crest of tildes, and the face under it: rows of full stops, sparser and
// fainter the further they fall below the crest.
const CREST = "~"
const FACE = [
  { every: 1, alpha: 0.42 },
  { every: 2, alpha: 0.26 },
  { every: 2, alpha: 0.12 },
]
// A full stop in the mono is a square about this share of the font size.
const STOP = 0.14
// Front crests this high catch the accent: a glint, a few glyphs at a time.
const GLINT = 0.8

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Draws the footer's sea for <AsciiFlowBackground shape="waves">. Swell lines
 * are drawn horizon first; each one hides what lies behind and below its
 * crest, then lays down its face and its crest at the height of the water
 * under every column (geometry in lib/ascii-sea.ts).
 *
 * Crest glyphs come from a small atlas, one per size and colour, repainted
 * only when the size, colours or font change, so a crest is an image copy
 * rather than text layout. The face's full stops are drawn as their squares,
 * one path per row. A frame costs about 1ms at phone width, 3ms on a wide
 * desktop.
 */
export function createWaves(pitch: number, frontSize: number) {
  let width = 0
  let height = 0
  let dpr = 1
  let family = "ui-monospace, monospace"
  let base = "rgb(92, 90, 85)"
  let accent = "rgb(43, 53, 232)"

  let lines: SeaLine[] = []
  let cols = 0
  let ys = new Float32Array(0)
  let hs = new Float32Array(0)

  const atlas = typeof document === "undefined" ? null : document.createElement("canvas")
  // Atlas slot of each crest size: plain at 2i, glinting at 2i + 1.
  const slots = new Map<number, number>()
  let slot = 0

  const paint = () => {
    const actx = atlas?.getContext("2d")
    if (!atlas || !actx) return
    const sizes = [...new Set(lines.map((line) => line.size))]
    slot = Math.ceil(frontSize * 1.6 * dpr)
    atlas.width = Math.max(1, slot * sizes.length * 2)
    atlas.height = slot
    actx.textAlign = "center"
    actx.textBaseline = "middle"
    slots.clear()
    sizes.forEach((size, i) => {
      actx.font = `${size * dpr}px ${family}`
      actx.fillStyle = base
      actx.fillText(CREST, (2 * i + 0.5) * slot, slot / 2)
      actx.fillStyle = accent
      actx.fillText(CREST, (2 * i + 1.5) * slot, slot / 2)
      slots.set(size, 2 * i)
    })
  }

  const blit = (ctx: CanvasRenderingContext2D, i: number, x: number, y: number) => {
    const s = slot / dpr
    ctx.drawImage(atlas!, i * slot, 0, slot, slot, x - s / 2, y - s / 2, s, s)
  }

  return {
    resize(w: number, h: number, ratio: number) {
      width = w
      height = h
      dpr = ratio
      lines = seaLines(w, h, frontSize)
      cols = Math.ceil(w / pitch) + 1
      ys = new Float32Array(cols)
      hs = new Float32Array(cols)
      paint()
    },
    setColors(baseColor: string, accentColor: string) {
      base = baseColor
      accent = accentColor
      paint()
    },
    setFont(fontFamily: string) {
      family = fontFamily
      paint()
    },
    /** Repaint the atlas, e.g. once a web font has arrived. */
    repaint: paint,

    draw(ctx: CanvasRenderingContext2D, time: number, opacity: number) {
      ctx.clearRect(0, 0, width, height)
      for (const line of lines) {
        const { depth, y, amp, size, seed } = line
        for (let c = 0; c < cols; c++) {
          hs[c] = swellHeight(c * pitch, depth, time, seed)
          ys[c] = y - amp * hs[c]
        }

        // This swell hides whatever lies behind and below its crest.
        ctx.globalCompositeOperation = "destination-out"
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.moveTo(-pitch, height)
        for (let c = 0; c < cols; c++) ctx.lineTo(c * pitch, ys[c] - size * 0.55)
        ctx.lineTo(cols * pitch, height)
        ctx.closePath()
        ctx.fill()
        ctx.globalCompositeOperation = "source-over"

        // Far lines are fainter; troughs a little fainter than crests.
        const strength = opacity * lerp(0.4, 0.95, depth)
        const gap = lerp(7, 11, depth)
        const stop = Math.max(1, (size - 2) * STOP)
        ctx.fillStyle = base
        FACE.forEach(({ every, alpha }, r) => {
          ctx.globalAlpha = strength * alpha
          ctx.beginPath()
          for (let c = r % every; c < cols; c += every) {
            ctx.rect(c * pitch - stop / 2, ys[c] + (r + 1) * gap, stop, stop)
          }
          ctx.fill()
        })
        const crest = slots.get(size)
        if (crest === undefined) continue
        for (let c = 0; c < cols; c++) {
          const lit = depth >= 0.6 && hs[c] > GLINT
          ctx.globalAlpha = lit ? strength : strength * (0.62 + 0.38 * hs[c])
          blit(ctx, lit ? crest + 1 : crest, c * pitch, ys[c])
        }
      }
      ctx.globalAlpha = 1
    },
  }
}
