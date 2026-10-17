"use client"

import { useEffect, useRef, useState } from "react"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

/**
 * The hero's pixel wake. A sheet of faint ink dots on the ledger grid; moving
 * the cursor leaves a wake that prints whole cells as square ink pixels, which
 * wink out cell by cell as the wake fades. A click sends a ring of ultramarine
 * pixels across the sheet.
 *
 * Two passes per frame:
 *  1. Trail: a low-resolution texture that remembers where the cursor went.
 *     Each frame it bleeds into its neighbours, fades, and takes a new stroke
 *     along the segment the cursor travelled, wider when it moves fast.
 *  2. Sheet: one sample of the trail at each cell's centre, compared with the
 *     cell's own random threshold. Past it, the cell switches on; well past
 *     it, the pixel prints larger. Thresholds differ per cell, so the wake's
 *     edge is ragged and pixels pop in and out one at a time instead of
 *     fading as a blob.
 *
 * Desktop pointers only (HeroField decides). If WebGL is missing or the
 * context is lost, the static CSS dot grid takes over.
 */

type RGBA = readonly [number, number, number, number]
type RGB = readonly [number, number, number]

export type WakeColors = {
  /** resting dot */
  dot: RGBA
  /** wake pixel */
  wake: RGBA
  /** click ring pixel */
  ring: RGB
}

type WakeFieldProps = {
  /** CSS px between cells */
  spacing: number
  light: WakeColors
  dark: WakeColors
}

// Trail: one texel per this many CSS px.
const TRAIL_TEXEL = 6
// Seconds for the wake to fall to ~37%. A saturated cell with the lowest
// threshold outlasts it by ~1.3s; a typical one winks out in ~0.3s.
const WAKE_FADE = 0.45
// Stroke radius in field heights, before speed widens it.
const STROKE_RADIUS = 0.03
// Field heights per second that count as a full-strength stroke.
const FULL_SPEED = 1.4
// Energy a full-strength stroke deposits per frame: enough that a stroke's
// core saturates and its edges stay ragged.
const DEPOSIT = 0.6
// A jump longer than this (field heights, one frame) is a teleport, not a
// stroke: the pointer re-entered the window or the page scrolled under it.
const TELEPORT = 0.3

// Click rings.
const MAX_RINGS = 3
const RING_LIFE = 1.4 // s
const RING_SPEED = 0.95 // field heights per second
const RING_WIDTH = 0.035 // gaussian band, field heights
const RING_TAIL = 0.2 // tail length behind the front, field heights

// Cell geometry, as fractions of the cell.
const DOT_RADIUS = 0.07
const PIXEL = 0.2 // half side of a wake pixel
const PIXEL_LARGE = 0.29

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
    float r = ${glf(STROKE_RADIUS)} * (1.0 + 0.6 * u_force);
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
uniform float u_time;
uniform sampler2D u_trail;
uniform vec4 u_dot;
uniform vec4 u_wake;
uniform vec3 u_ring;
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
  float tail = behind > 0.0 ? (1.0 - smoothstep(0.0, ${glf(RING_TAIL)}, behind)) * 0.14 : 0.0;
  return (exp(-band * band) + tail) * ring.w;
}

float square(vec2 local, float side, float aa) {
  return 1.0 - smoothstep(side - aa, side + aa, max(abs(local.x), abs(local.y)));
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy / u_cell);
  vec2 local = fract(gl_FragCoord.xy / u_cell) - 0.5;
  vec2 centre = (cell + 0.5) * u_cell / u_resolution;
  float aa = 1.0 / u_cell;

  // Resting sheet: each dot has its own weight and a slow breathe.
  float seed = hash(cell);
  float weight = 0.75 + 0.5 * seed;
  float breathe = 0.88 + 0.12 * sin(u_time * (0.5 + 0.4 * seed) + seed * 6.2831);
  float vignette = smoothstep(1.2, 0.3, length(centre - 0.5));
  float restDot = 1.0 - smoothstep(${glf(DOT_RADIUS)} - aa, ${glf(DOT_RADIUS)} + aa, length(local));
  vec4 colour = vec4(u_dot.rgb, u_dot.a * weight * breathe * vignette * restDot);

  // Wake: the cell prints once the trail under its centre passes the cell's
  // own threshold, and prints larger well past it.
  float energy = texture2D(u_trail, centre).r;
  float threshold = 0.06 + 0.8 * hash(cell + 17.31);
  float on = step(threshold, energy);
  float side = mix(${glf(PIXEL)}, ${glf(PIXEL_LARGE)}, step(threshold + 0.3, energy));
  colour = mix(colour, u_wake, on * square(local, side, aa));

  // Click rings print through the same cells, in ultramarine.
  float rings = 0.0;
  for (int i = 0; i < ${MAX_RINGS}; i++) rings += ringEnergy(u_rings[i], centre);
  float ringOn = step(0.06 + 0.8 * hash(cell + 41.7), rings);
  colour = mix(colour, vec4(u_ring, 0.95), ringOn * square(local, ${glf(PIXEL)}, aa));

  gl_FragColor = colour;
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

export function WakeField({ spacing, light, dark }: WakeFieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
      premultipliedAlpha: false,
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
    const us = uniforms(sheetProgram, ["u_resolution", "u_cell", "u_aspect", "u_time", "u_trail", "u_dot", "u_wake", "u_ring", "u_rings"])

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

    // Pointer, in field uv (y up). `from` is where last frame's stroke ended.
    let pointer: { x: number; y: number } | null = null
    let from: { x: number; y: number } | null = null
    let force = 0
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
      pointer = p.inside ? { x: p.x, y: p.y } : null
      kick()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const p = toField(e.clientX, e.clientY)
      if (!p.inside) return
      rings.push({ x: p.x, y: p.y, start: performance.now() })
      if (rings.length > MAX_RINGS) rings.shift()
      kick()
    }
    // Leaving the window, or the page scrolling under a still pointer, ends
    // the stroke; the next move starts a fresh one instead of drawing a line.
    const onLeave = () => {
      pointer = null
      from = null
    }

    let raf = 0
    let visible = true
    let last = 0
    let first = true
    const ringData = new Float32Array(MAX_RINGS * 4)

    const frame = (now: number) => {
      raf = 0
      const dt = last ? Math.min(Math.max((now - last) / 1000, 1 / 240), 1 / 20) : 1 / 60
      last = now

      // Stroke for this frame: from where the last one ended to the pointer.
      let strokeFrom = from
      const strokeTo = pointer
      let target = 0
      if (strokeTo && strokeFrom) {
        const dist = Math.hypot((strokeTo.x - strokeFrom.x) * (cssW / cssH), strokeTo.y - strokeFrom.y)
        if (dist > TELEPORT) strokeFrom = strokeTo
        else target = Math.min(1, dist / dt / FULL_SPEED)
      }
      // Eases in as the stroke speeds up, but stops the moment the cursor
      // does: winding down in place would pool ink into a block at the stop.
      force = target > force ? force + (target - force) * (1 - Math.exp(-dt * 24)) : target
      from = strokeTo

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
      gl.uniform1f(ut.u_force, strokeTo && force > 0.01 ? force : 0)
      gl.uniform1f(ut.u_aspect, cssW / cssH)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      read = 1 - read

      // Rings: radius and strength integrated here, the shader draws fronts.
      while (rings.length && (now - rings[0].start) / 1000 > RING_LIFE) rings.shift()
      ringData.fill(0)
      rings.forEach((ring, i) => {
        const age = (now - ring.start) / 1000
        ringData.set([ring.x, ring.y, age * RING_SPEED, 1.25 * Math.pow(1 - age / RING_LIFE, 1.4)], i * 4)
      })

      // Pass 2: the sheet.
      gl.useProgram(sheetProgram)
      bindQuad(sheetProgram)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, width, height)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.bindTexture(gl.TEXTURE_2D, trail[read].tex)
      gl.uniform1i(us.u_trail, 0)
      gl.uniform2f(us.u_resolution, width, height)
      gl.uniform1f(us.u_cell, spacing * dpr)
      gl.uniform1f(us.u_aspect, cssW / cssH)
      gl.uniform1f(us.u_time, (now / 1000) % 3600)
      gl.uniform4f(us.u_dot, ...colors.dot)
      gl.uniform4f(us.u_wake, ...colors.wake)
      gl.uniform3f(us.u_ring, ...colors.ring)
      gl.uniform4fv(us.u_rings, ringData)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      if (first) {
        first = false
        setPainted(true)
      }
      // The resting dots breathe, so keep drawing while the sheet is on
      // screen; observers below pause it when it scrolls away or the tab hides.
      if (visible) raf = requestAnimationFrame(frame)
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
