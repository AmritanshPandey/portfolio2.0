"use client"

import { useEffect, useRef, useState } from "react"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

/**
 * The hero's pixel wake. At rest, a fine screen of tiny ink dots packed 8px
 * apart; moving the cursor turns the cells it passes into near-touching
 * square pixels, so the sheet briefly reads as a pixel mosaic, and they step
 * back down through three ink levels to dots as the wake fades. A click sends
 * a ring of ultramarine pixels through the same grid.
 *
 * Two passes per frame:
 *  1. Trail: a low-resolution texture that remembers where the cursor went.
 *     Each frame it bleeds into its neighbours, fades, and takes a new stroke
 *     along the segment the cursor travelled, wider when it moves fast.
 *  2. Sheet: one sample of the trail at each cell's centre, compared with the
 *     cell's own random threshold. Past it the dot becomes a square pixel,
 *     its ink stepped to one of three levels by how far past it the trail
 *     is, like dithering. Thresholds differ per cell, so the wake's edge is
 *     pixel-ragged and cells turn at their own moment.
 *
 * Built to stay smooth, Safari included: it draws only while something moves
 * (a stroke, a fading wake, a ring) and sits still otherwise; it outputs
 * premultiplied colour and does its own top and bottom fade, so the browser
 * composites one plain layer. It watches its own frame rate: a browser held
 * to ~30fps (battery saver, Low Power Mode, a slow machine) hands over to the
 * static dots through onSlow.
 *
 * Desktop pointers only (HeroField decides). If WebGL is missing or the
 * context is lost, the static CSS dot grid takes over.
 */

type RGBA = readonly [number, number, number, number]

export type WakeColors = {
  /** resting dot */
  dot: RGBA
  /** wake pixel, fully grown */
  wake: RGBA
  /** click ring pixel, fully grown */
  ring: RGBA
}

type WakeFieldProps = {
  /** CSS px between cells */
  spacing: number
  light: WakeColors
  dark: WakeColors
  /** called once, when the sheet has painted its first frame */
  onPaint?: () => void
  /** called if the browser can't hold a smooth frame rate */
  onSlow?: () => void
}

// Trail: one texel per this many CSS px.
const TRAIL_TEXEL = 4
// Seconds for the wake to fall to ~37%: a stroke has settled back into dots
// in under a second.
const WAKE_FADE = 0.5
// Stroke radius in field heights, before speed widens it: a pencil line,
// a couple of cells wide.
const STROKE_RADIUS = 0.046
// Field heights per second that count as a full-strength stroke: an
// ordinary hand-speed sweep (~700px/s on a laptop) prints at full strength.
const FULL_SPEED = 0.8
// Energy a full-strength stroke deposits per frame.
const DEPOSIT = 0.7
// A jump longer than this (field heights, one frame) is a teleport, not a
// stroke: the pointer re-entered the window or the page scrolled under it.
const TELEPORT = 0.3
// Moves closer together than this (ms) blend into one smoothed speed. After
// a longer gap the speed is taken from that move alone: near zero after a
// real pause, the true speed when a busy page delivered the move late.
const BLEND_WITHIN = 80

// Click rings: eased out, so the ring leaves quickly and settles.
const MAX_RINGS = 3
const RING_LIFE = 1.1 // s
const RING_REACH = 0.42 // final radius, field heights
const RING_WIDTH = 0.028 // gaussian band, field heights
const RING_TAIL = 0.12 // tail length behind the front, field heights

// Drawing: after the last stroke or click, keep drawing this long (s) while
// the wake and rings fade, then stop until something moves.
const ACTIVE_FOR = 2.5
// Frame-rate check, in windows of PROBE_FRAMES frame intervals: two slow
// windows in a row (median slower than ~36fps, ~2.7s at 30fps) mean the
// browser is held back for good, not just having a janky moment. The first
// two windows always draw, so every visit is measured.
const PROBE_FRAMES = 40
const SLOW_FRAME_MS = 28
const SLOW_WINDOWS = 2

// The sheet's fade, matching the static grid's CSS mask: in over the first
// 14px under the rule, full to 42% of the height, gone by 82%.
const FADE_TOP_PX = 14

// Cell geometry, as fractions of the cell. On the 8px grid the resting dot is
// ~1.8px across and a pixel is 7px square with a 1px gap, both landing on
// whole device pixels on a 2x screen, so they stay crisp.
const DOT_RADIUS = 0.11
const PIXEL = 0.4375 // half side
// A lit cell's ink steps through LEVELS levels as the energy past its
// threshold rises through GROW.
const GROW = 0.3
const LEVELS = 3

const glf = (n: number) => {
  const s = String(n)
  return s.includes(".") || s.includes("e") ? s : `${s}.0`
}

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const TRAIL_FRAG = `
precision highp float;
uniform sampler2D u_prev;
uniform vec2 u_texel;   // 1 / trail size
uniform float u_keep;   // fade factor for this frame
uniform vec2 u_from;    // stroke start, field uv (y up)
uniform vec2 u_to;      // stroke end
uniform float u_force;  // 0..1, from pointer speed
uniform float u_aspect; // field width / height

void main() {
  vec2 uv = gl_FragCoord.xy * u_texel;
  float here = texture2D(u_prev, uv).r;
  float around = 0.25 * (
      texture2D(u_prev, uv + vec2(u_texel.x, 0.0)).r
    + texture2D(u_prev, uv - vec2(u_texel.x, 0.0)).r
    + texture2D(u_prev, uv + vec2(0.0, u_texel.y)).r
    + texture2D(u_prev, uv - vec2(0.0, u_texel.y)).r);
  // Bleed, then fade. The small floor lets 8-bit values actually reach zero.
  float energy = max(mix(here, around, 0.5) * u_keep - 0.004, 0.0);

  if (u_force > 0.0) {
    // Distance to the segment the cursor travelled this frame, so a fast
    // stroke draws a continuous line instead of a row of stamps.
    vec2 k = vec2(u_aspect, 1.0);
    vec2 a = u_from * k;
    vec2 ab = u_to * k - a;
    vec2 ap = uv * k - a;
    float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
    float d = length(ap - ab * t);
    float r = ${glf(STROKE_RADIUS)} * (1.0 + 0.4 * u_force);
    energy += u_force * ${glf(DEPOSIT)} * exp(-(d * d) / (r * r));
  }
  gl_FragColor = vec4(min(energy, 1.0), 0.0, 0.0, 1.0);
}
`

const SHEET_FRAG = `
precision highp float;
uniform vec2 u_resolution; // device px
uniform float u_cell;      // cell size, device px
uniform float u_aspect;
uniform float u_fadeTop;   // top fade length, device px
uniform sampler2D u_trail;
uniform vec4 u_dot;
uniform vec4 u_wake;
uniform vec4 u_ring;
uniform vec4 u_rings[${MAX_RINGS}]; // xy centre (field uv), z radius, w strength

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float ringEnergy(vec4 ring, vec2 p) {
  if (ring.w <= 0.0) return 0.0;
  float r = length((p - ring.xy) * vec2(u_aspect, 1.0));
  float band = (r - ring.z) / ${glf(RING_WIDTH)};
  float behind = ring.z - r;
  // A short tail that travels with the front, so lit cells wink off as it
  // passes rather than freezing inside the ring.
  float tail = behind > 0.0 ? (1.0 - smoothstep(0.0, ${glf(RING_TAIL)}, behind)) * 0.1 : 0.0;
  return (exp(-band * band) + tail) * ring.w;
}

float dotMark(vec2 local, float aa) {
  return 1.0 - smoothstep(${glf(DOT_RADIUS)} - aa, ${glf(DOT_RADIUS)} + aa, length(local));
}

float pixelMark(vec2 local, float aa) {
  vec2 q = abs(local);
  return 1.0 - smoothstep(${glf(PIXEL)} - aa, ${glf(PIXEL)} + aa, max(q.x, q.y));
}

// A cell's ink level once its energy passes its threshold: 1/3, 2/3 or 1,
// stepping up as the energy climbs through GROW; 0 below the threshold.
float level(float energy, float threshold) {
  float past = energy - threshold;
  if (past <= 0.0) return 0.0;
  return max(1.0, ceil(clamp(past / ${glf(GROW)}, 0.0, 1.0) * ${glf(LEVELS)})) / ${glf(LEVELS)};
}

void main() {
  // The lattice runs from the top-left, exactly like the CSS dot grid, so the
  // two coincide if both are ever on screen instead of doubling up.
  vec2 p = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
  vec2 cell = floor(p / u_cell);
  vec2 local = fract(p / u_cell) - 0.5;
  vec2 centre = (cell + 0.5) * u_cell / u_resolution;
  centre.y = 1.0 - centre.y; // back to field uv, y up
  float aa = 0.6 / u_cell; // a crisp edge, ~0.6 device px

  // Resting sheet: one even tone, softly vignetted.
  float vignette = smoothstep(1.2, 0.3, length(centre - 0.5));
  vec4 colour = vec4(u_dot.rgb, u_dot.a * vignette * dotMark(local, aa));

  // Wake: past the cell's own threshold the dot becomes a pixel, its ink
  // stepped by how far past it the trail is.
  float energy = texture2D(u_trail, centre).r;
  float lit = level(energy, 0.08 + 0.75 * hash(cell + 17.31));
  if (lit > 0.0) colour = vec4(u_wake.rgb, u_wake.a * lit * pixelMark(local, aa));

  // Click rings light the same pixels, in ultramarine.
  float rings = 0.0;
  for (int i = 0; i < ${MAX_RINGS}; i++) rings += ringEnergy(u_rings[i], centre);
  float ringLit = level(rings, 0.16 + 0.7 * hash(cell + 41.7));
  if (ringLit > 0.0) colour = vec4(u_ring.rgb, u_ring.a * ringLit * pixelMark(local, aa));

  float fromTop = u_resolution.y - gl_FragCoord.y;
  colour.a *= clamp(fromTop / u_fadeTop, 0.0, 1.0) * clamp((0.82 - fromTop / u_resolution.y) / 0.4, 0.0, 1.0);
  gl_FragColor = vec4(colour.rgb * colour.a, colour.a); // premultiplied
}
`

function compile(gl: WebGLRenderingContext, vertSrc: string, fragSrc: string) {
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)
    if (!s) return null
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s
    gl.deleteShader(s)
    return null
  }
  const vert = shader(gl.VERTEX_SHADER, vertSrc)
  const frag = shader(gl.FRAGMENT_SHADER, fragSrc)
  const program = gl.createProgram()
  if (!vert || !frag || !program) return null
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  gl.deleteShader(vert)
  gl.deleteShader(frag)
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program
  gl.deleteProgram(program)
  return null
}

type Ring = { x: number; y: number; start: number }

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[xs.length >> 1]

export function WakeField({ spacing, light, dark, onPaint, onSlow }: WakeFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onPaintRef = useRef(onPaint)
  const onSlowRef = useRef(onSlow)
  useEffect(() => {
    onPaintRef.current = onPaint
    onSlowRef.current = onSlow
  })
  const [painted, setPainted] = useState(false)
  const [failed, setFailed] = useState(false)

  const { isHigh, isBalanced } = usePerformanceMode()
  const maxDpr = isHigh ? 2 : isBalanced ? 1.5 : 1
  const colorKey = JSON.stringify([light, dark])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    })
    const trailProgram = gl && compile(gl, VERT, TRAIL_FRAG)
    const sheetProgram = gl && compile(gl, VERT, SHEET_FRAG)
    if (!gl || !trailProgram || !sheetProgram) {
      // No WebGL: hand over to the static dots (deferred, not set mid-effect).
      queueMicrotask(() => setFailed(true))
      return
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const bindQuad = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, "a_pos")
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    }
    const uniforms = (program: WebGLProgram, names: string[]) =>
      Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(program, n)]))
    const ut = uniforms(trailProgram, ["u_prev", "u_texel", "u_keep", "u_from", "u_to", "u_force", "u_aspect"])
    const us = uniforms(sheetProgram, ["u_resolution", "u_cell", "u_aspect", "u_fadeTop", "u_trail", "u_dot", "u_wake", "u_ring", "u_rings"])

    // Two trail textures, ping-ponged: read last frame, write this one.
    const trail = [0, 1].map(() => ({ tex: gl.createTexture(), fbo: gl.createFramebuffer() }))
    let trailW = 0
    let trailH = 0
    let read = 0

    let width = 0
    let height = 0
    let cssW = 1
    let cssH = 1
    let dpr = 1

    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      cssW = Math.max(1, rect.width)
      cssH = Math.max(1, rect.height)
      width = Math.round(cssW * dpr)
      height = Math.round(cssH * dpr)
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
      const tw = Math.max(1, Math.ceil(cssW / TRAIL_TEXEL))
      const th = Math.max(1, Math.ceil(cssH / TRAIL_TEXEL))
      if (tw === trailW && th === trailH) return true
      trailW = tw
      trailH = th
      for (const t of trail) {
        gl.bindTexture(gl.TEXTURE_2D, t.tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0)
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return false
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      return true
    }
    if (!resize()) {
      queueMicrotask(() => setFailed(true))
      return
    }

    const isDark = () => document.documentElement.classList.contains("dark")
    let colors = isDark() ? dark : light

    // Pointer, in field uv (y up). `from` is where the last stroke ended.
    // Speed is measured from the pointer events themselves, so it holds up
    // when moves arrive less often than frames (a trackpad on a 120Hz screen).
    let pointer: { x: number; y: number } | null = null
    let from: { x: number; y: number } | null = null
    let lastMove: { x: number; y: number; t: number } | null = null
    let speed = 0 // field heights per second, smoothed
    const rings: Ring[] = []

    const toField = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: (clientX - rect.left) / Math.max(1, rect.width),
        y: 1 - (clientY - rect.top) / Math.max(1, rect.height),
        inside: clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom,
      }
    }
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const p = toField(e.clientX, e.clientY)
      if (!p.inside) {
        onLeave()
        return
      }
      if (lastMove) {
        const gap = e.timeStamp - lastMove.t
        const dist = Math.hypot((p.x - lastMove.x) * (cssW / cssH), p.y - lastMove.y)
        const instant = dist / (Math.max(gap, 4) / 1000)
        speed = gap < BLEND_WITHIN ? speed + (instant - speed) * 0.5 : instant
      }
      lastMove = { x: p.x, y: p.y, t: e.timeStamp }
      pointer = { x: p.x, y: p.y }
      kick()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const p = toField(e.clientX, e.clientY)
      if (!p.inside) return
      rings.push({ x: p.x, y: p.y, start: performance.now() })
      if (rings.length > MAX_RINGS) rings.shift()
      activeUntil = performance.now() + ACTIVE_FOR * 1000
      kick()
    }
    // Leaving the window, or the page scrolling under a still pointer, ends
    // the stroke; the next move starts a fresh one instead of drawing a line.
    const onLeave = () => {
      pointer = null
      from = null
      lastMove = null
      speed = 0
    }

    let raf = 0
    let visible = true
    let last = 0
    let first = true
    let activeUntil = 0
    let probe = PROBE_FRAMES * SLOW_WINDOWS + 1 // n + 1 frames give n intervals
    const intervals: number[] = []
    let slowWindows = 0
    const ringData = new Float32Array(MAX_RINGS * 4)

    const frame = (now: number) => {
      raf = 0
      // Only consecutive frames count: `last` is cleared whenever drawing
      // pauses, so a pause is never mistaken for a slow frame.
      if (last) {
        intervals.push(now - last)
        if (intervals.length === PROBE_FRAMES) {
          slowWindows = median(intervals) > SLOW_FRAME_MS ? slowWindows + 1 : 0
          intervals.length = 0
          if (slowWindows >= SLOW_WINDOWS) {
            onSlowRef.current?.()
            return
          }
        }
      }
      const dt = last ? Math.min(Math.max((now - last) / 1000, 1 / 240), 1 / 20) : 1 / 60
      last = now

      // Stroke for this frame: from where the last one ended to the pointer,
      // at the speed the pointer events report. Only frames where the pointer
      // has moved deposit, so stopping never pools ink, and a frame that runs
      // late still draws the whole segment it missed.
      let strokeFrom = from
      const strokeTo = pointer
      let deposit = 0
      if (strokeTo && strokeFrom && (strokeTo.x !== strokeFrom.x || strokeTo.y !== strokeFrom.y)) {
        const dist = Math.hypot((strokeTo.x - strokeFrom.x) * (cssW / cssH), strokeTo.y - strokeFrom.y)
        if (dist > TELEPORT) strokeFrom = strokeTo
        else deposit = Math.min(1, speed / FULL_SPEED)
      }
      from = strokeTo
      if (deposit > 0) activeUntil = now + ACTIVE_FOR * 1000

      // Pass 1: trail.
      gl.useProgram(trailProgram)
      bindQuad(trailProgram)
      gl.bindFramebuffer(gl.FRAMEBUFFER, trail[1 - read].fbo)
      gl.viewport(0, 0, trailW, trailH)
      gl.disable(gl.BLEND)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, trail[read].tex)
      gl.uniform1i(ut.u_prev, 0)
      gl.uniform2f(ut.u_texel, 1 / trailW, 1 / trailH)
      gl.uniform1f(ut.u_keep, Math.exp(-dt / WAKE_FADE))
      const a = strokeFrom ?? strokeTo ?? { x: -1, y: -1 }
      const b = strokeTo ?? a
      gl.uniform2f(ut.u_from, a.x, a.y)
      gl.uniform2f(ut.u_to, b.x, b.y)
      gl.uniform1f(ut.u_force, deposit > 0.01 ? deposit : 0)
      gl.uniform1f(ut.u_aspect, cssW / cssH)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      read = 1 - read

      // Rings: radius and strength integrated here, the shader draws fronts.
      while (rings.length && (now - rings[0].start) / 1000 > RING_LIFE) rings.shift()
      ringData.fill(0)
      rings.forEach((ring, i) => {
        const age = (now - ring.start) / 1000
        const p = age / RING_LIFE
        ringData.set([ring.x, ring.y, RING_REACH * (1 - Math.pow(1 - p, 3)), 1.2 * Math.pow(1 - p, 1.5)], i * 4)
      })

      // Pass 2: the sheet.
      gl.useProgram(sheetProgram)
      bindQuad(sheetProgram)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, width, height)
      // One full-screen draw of premultiplied colour: no clear or blend needed.
      gl.bindTexture(gl.TEXTURE_2D, trail[read].tex)
      gl.uniform1i(us.u_trail, 0)
      gl.uniform2f(us.u_resolution, width, height)
      gl.uniform1f(us.u_cell, spacing * dpr)
      gl.uniform1f(us.u_aspect, cssW / cssH)
      gl.uniform1f(us.u_fadeTop, FADE_TOP_PX * dpr)
      gl.uniform4f(us.u_dot, ...colors.dot)
      gl.uniform4f(us.u_wake, ...colors.wake)
      gl.uniform4f(us.u_ring, ...colors.ring)
      gl.uniform4fv(us.u_rings, ringData)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      if (first) {
        first = false
        setPainted(true)
        onPaintRef.current?.()
      }
      // Keep drawing through the frame-rate check and while anything is
      // fading; then stop, and the last frame stays on screen until the next
      // move. Observers below also pause it off screen or in a hidden tab.
      if (probe > 0) probe--
      if (visible && (probe > 0 || now < activeUntil)) raf = requestAnimationFrame(frame)
      else last = 0
    }

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame)
    }

    let resizeRaf = 0
    const ro = new ResizeObserver(() => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        if (!resize()) setFailed(true)
        kick()
      })
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible"
      if (visible) {
        last = 0
        kick()
      }
    })
    io.observe(wrap)
    const onVisibility = () => {
      visible = document.visibilityState === "visible"
      if (visible) {
        last = 0
        kick()
      }
    }

    const mo = new MutationObserver(() => {
      colors = isDark() ? dark : light
      kick()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const onContextLost = (e: Event) => {
      e.preventDefault()
      visible = false
      setFailed(true)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerdown", onPointerDown, { passive: true })
    window.addEventListener("blur", onLeave)
    window.addEventListener("scroll", onLeave, { passive: true })
    document.addEventListener("pointerleave", onLeave)
    document.addEventListener("visibilitychange", onVisibility)
    canvas.addEventListener("webglcontextlost", onContextLost)
    kick()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("blur", onLeave)
      window.removeEventListener("scroll", onLeave)
      document.removeEventListener("pointerleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      for (const t of trail) {
        gl.deleteTexture(t.tex)
        gl.deleteFramebuffer(t.fbo)
      }
      gl.deleteBuffer(buffer)
      gl.deleteProgram(trailProgram)
      gl.deleteProgram(sheetProgram)
    }
    // colorKey stands in for the colour objects, which are new on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDpr, spacing, colorKey])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {failed ? (
        <div className="hero-dots-fallback absolute inset-0" />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full transition-opacity duration-500 ease-out"
          style={{ opacity: painted ? 1 : 0 }}
        />
      )}
    </div>
  )
}
