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

// The pointer lifts the water under it (in crest heights, falling off over
// these reaches, px), and a quick stroke sends a ring out across the lines.
// Water the pointer raises past STIR glints on any line, near or far.
const LIFT = 1.1
const LIFT_X = 80
const LIFT_Y = 34
const STIR = 0.45
const RING_SPEED = 240
const RING_WIDTH = 20
const RING_LIFE = 1.8
const RINGS = 10
// Rings spread across the lines more slowly than along them, as on water
// seen at a slant.
const RING_SLANT = 2

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
 *
 * Given the pointer (see `pointer`), the water rises under it and glints, and
 * quick strokes leave rings that spread and fade; the stir is added to the
 * swell, so crests hide and glint exactly as the sea's own do.
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
  let ss = new Float32Array(0)

  // The pointer: where it is (eased towards it), how present it is (fading
  // in and out), and the rings its strokes have sent out. Times in seconds.
  let target: { x: number; y: number } | null = null
  let px = 0
  let py = 0
  let presence = 0
  let lastFrame = 0
  const rings: { x: number; y: number; t: number; s: number }[] = []
  let emit = { x: 0, y: 0, t: 0 }

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
      ss = new Float32Array(cols)
      paint()
    },
    /** The pointer over the sea, in px from the band's top left; null once it leaves. */
    pointer(x: number | null, y = 0) {
      const now = performance.now() / 1000
      if (x === null) {
        target = null
        return
      }
      // Arriving from nowhere: start the lift where the pointer is.
      if (presence < 0.05) {
        px = x
        py = y
        emit = { x, y, t: now }
      }
      target = { x, y }
      const moved = Math.hypot(x - emit.x, y - emit.y)
      if (moved > 14 && now - emit.t > 0.08) {
        const speed = moved / (now - emit.t)
        rings.push({ x, y, t: now, s: Math.min(1, speed / 900) * 0.8 })
        if (rings.length > RINGS) rings.shift()
        emit = { x, y, t: now }
      }
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
      // Ease the lift after the pointer and fade it in or out.
      const now = performance.now() / 1000
      const dt = lastFrame ? Math.min(0.1, now - lastFrame) : 0
      lastFrame = now
      if (target) {
        const follow = 1 - Math.exp(-dt * 9)
        px += (target.x - px) * follow
        py += (target.y - py) * follow
      }
      presence += ((target ? 1 : 0) - presence) * (1 - Math.exp(-dt * 5))
      while (rings.length && now - rings[0].t > RING_LIFE) rings.shift()
      const stirred = presence > 0.01 || rings.length > 0

      ctx.clearRect(0, 0, width, height)
      for (const line of lines) {
        const { depth, y, amp, size, seed } = line
        // How much of the lift reaches this line.
        const reach = stirred ? presence * LIFT * Math.exp(-((y - py) ** 2) / (2 * LIFT_Y ** 2)) : 0
        for (let c = 0; c < cols; c++) {
          const x = c * pitch
          let stir = 0
          if (stirred) {
            const dx = x - px
            if (reach > 0.002 && dx > -3 * LIFT_X && dx < 3 * LIFT_X) {
              stir += reach * Math.exp(-(dx * dx) / (2 * LIFT_X ** 2))
            }
            for (const ring of rings) {
              const age = now - ring.t
              const off = Math.hypot(x - ring.x, (y - ring.y) * RING_SLANT) - age * RING_SPEED
              if (off > -3 * RING_WIDTH && off < 3 * RING_WIDTH) {
                stir += ring.s * Math.exp(-(off * off) / (2 * RING_WIDTH ** 2)) * (1 - age / RING_LIFE) ** 2
              }
            }
          }
          ss[c] = stir
          hs[c] = swellHeight(x, depth, time, seed) + stir
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
          const lit = (depth >= 0.6 && hs[c] > GLINT) || ss[c] > STIR
          ctx.globalAlpha = lit ? strength : strength * (0.62 + 0.38 * Math.min(1, hs[c]))
          blit(ctx, lit ? crest + 1 : crest, c * pitch, ys[c])
        }
      }
      ctx.globalAlpha = 1
    },
  }
}
