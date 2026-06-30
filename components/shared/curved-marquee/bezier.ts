/**
 * Pure cubic-bezier helpers for the CurvedMarquee editor.
 *
 * A PathState is a start point plus a list of cubic segments (two control
 * points + an end anchor each). Editing splits each original cubic into N
 * sub-segments via De Casteljau subdivision so there are more handles to grab,
 * and dragging an anchor carries its neighbouring control points along so the
 * curve stays smooth. No React in here — just geometry.
 */

export type Point = { x: number; y: number }
export type Cubic = { p0: Point; p1: Point; p2: Point; p3: Point }
export type Segment = { c1: Point; c2: Point; end: Point }
export type PathState = { start: Point; segments: Segment[] }

export type HandleId =
  | { type: "start" }
  | { type: "c1"; seg: number }
  | { type: "c2"; seg: number }
  | { type: "end"; seg: number }

export const round = (n: number) => Math.round(n * 1000) / 1000
export const rp = (p: Point): Point => ({ x: round(p.x), y: round(p.y) })

export const lerp = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
})

/** De Casteljau split of a cubic at parameter t into its left/right halves. */
export function splitCubic(b: Cubic, t: number): { left: Cubic; right: Cubic } {
  const a1 = lerp(b.p0, b.p1, t)
  const a2 = lerp(b.p1, b.p2, t)
  const a3 = lerp(b.p2, b.p3, t)
  const b1 = lerp(a1, a2, t)
  const b2 = lerp(a2, a3, t)
  const mid = lerp(b1, b2, t)
  return {
    left: { p0: b.p0, p1: a1, p2: b1, p3: mid },
    right: { p0: mid, p1: b2, p2: a3, p3: b.p3 },
  }
}

/** The portion of a cubic between parameters t0 and t1, itself a cubic. */
export function subCubic(b: Cubic, t0: number, t1: number): Cubic {
  const right = splitCubic(b, t0).right
  const t = (t1 - t0) / (1 - t0)
  return splitCubic(right, t).left
}

export const handleKey = (id: HandleId) =>
  id.type === "start" ? "start" : `${id.type}-${id.seg}`

export function getPoint(state: PathState, id: HandleId): Point {
  if (id.type === "start") return state.start
  return state.segments[id.seg][id.type]
}

export function setPoint(state: PathState, id: HandleId, p: Point): PathState {
  if (id.type === "start") return { ...state, start: p }
  return {
    ...state,
    segments: state.segments.map((seg, i) =>
      i === id.seg ? { ...seg, [id.type]: p } : seg
    ),
  }
}

const shift = (p: Point, dx: number, dy: number): Point => ({
  x: p.x + dx,
  y: p.y + dy,
})

/**
 * Move an on-line anchor (start or a segment end) and carry the control
 * points that share its tangent along by the same delta, so the curve keeps
 * its shape around the handle instead of kinking.
 */
export function moveAnchor(state: PathState, id: HandleId, p: Point): PathState {
  const old = getPoint(state, id)
  const dx = p.x - old.x
  const dy = p.y - old.y
  let next = setPoint(state, id, p)
  if (id.type === "start") {
    next = setPoint(next, { type: "c1", seg: 0 }, shift(state.segments[0].c1, dx, dy))
  } else if (id.type === "end") {
    const i = id.seg
    next = setPoint(next, { type: "c2", seg: i }, shift(state.segments[i].c2, dx, dy))
    if (i < state.segments.length - 1) {
      next = setPoint(
        next,
        { type: "c1", seg: i + 1 },
        shift(state.segments[i + 1].c1, dx, dy)
      )
    }
  }
  return next
}

export function toPathD({ start, segments }: PathState): string {
  let d = `M${round(start.x)} ${round(start.y)}`
  for (const s of segments) {
    d += `C${round(s.c1.x)} ${round(s.c1.y)} ${round(s.c2.x)} ${round(s.c2.y)} ${round(s.end.x)} ${round(s.end.y)}`
  }
  return d
}

/** Map a client (screen) coordinate into the SVG's user space. */
export function clientToSvg(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  fallbackW: number,
  fallbackH: number
): Point {
  const ctm = svg.getScreenCTM()
  if (ctm) {
    const local = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    return { x: local.x, y: local.y }
  }
  const r = svg.getBoundingClientRect()
  return {
    x: ((clientX - r.left) / r.width) * fallbackW,
    y: ((clientY - r.top) / r.height) * fallbackH,
  }
}

/**
 * Build the default editable path from a list of original cubics, splitting
 * each into `splitsPerSegment` sub-segments for extra handles.
 */
export function buildDefaultPath(
  originals: Cubic[],
  splitsPerSegment: number
): PathState {
  return {
    start: rp(originals[0].p0),
    segments: originals.flatMap((cubic) => {
      const segs: Segment[] = []
      for (let i = 0; i < splitsPerSegment; i++) {
        const sub = subCubic(cubic, i / splitsPerSegment, (i + 1) / splitsPerSegment)
        segs.push({ c1: rp(sub.p1), c2: rp(sub.p2), end: rp(sub.p3) })
      }
      return segs
    }),
  }
}
