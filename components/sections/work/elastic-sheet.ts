/**
 * Elastic sheets for the work gallery: each frame's media drawn by WebGL on
 * a canvas a little larger than the frame, so it can bend past its edges.
 *
 * - Stretch: while the page scrolls, the leading edge holds and the tail
 *   lags behind, bowing at the middle and narrowing a touch, like a sheet
 *   being pulled.
 * - Flare: in the bottom band of the screen the sides bloom out, more at the
 *   foot than the head, and a soft wave runs up through the picture.
 * - Ripple: when the scroll comes to rest, one swell rolls up the sheet.
 * - Bulge: under the pointer the sheet lifts a little and catches the light.
 *
 * One loop (below) serves every sheet: it reads the scroll once a frame,
 * eases a speed from it, and draws the sheets on screen. It listens only
 * while a sheet is on screen and stops as soon as nothing is moving. Each
 * frame's place on the page is measured on resize, never during a scroll.
 */

/* ── The shared loop ─────────────────────────────────────────────────────── */

interface LoopState {
  time: number
  /** Eased scroll speed, -1..1; positive while scrolling down. */
  stretch: number
  /** The landing ripple: its front (1 at the foot, 0 at the head) and strength. */
  rippleFront: number
  rippleAmp: number
  /** Pointer in viewport px, and how present it is (eased 0..1). */
  px: number
  py: number
  pointer: number
  scrollY: number
  vw: number
  vh: number
}

interface Sheet {
  visible: boolean
  draw: (s: LoopState) => void
  /** True while the sheet needs frames of its own (a playing loop). */
  busy: () => boolean
}

const sheets = new Set<Sheet>()
const state: LoopState = {
  time: 0,
  stretch: 0,
  rippleFront: 0,
  rippleAmp: 0,
  px: -9999,
  py: -9999,
  pointer: 0,
  scrollY: 0,
  vw: 1,
  vh: 1,
}
let raf = 0
let last = 0
let lastY = 0
let peak = 0
let ripple = -1 // progress 0..1, or -1 for none
let pointerAim = 0
let pointerMoved = 0
let listening = false

const RIPPLE_MS = 760
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

function tick(now: number) {
  raf = 0
  const dt = Math.min(64, now - last || 16)
  last = now
  state.time = now / 1000
  state.vw = innerWidth
  state.vh = innerHeight

  // Scroll speed: px per ms, a fast flick is about 3. Eased so the sheet
  // gathers and lets go rather than snapping.
  const y = scrollY
  const dy = y - lastY
  lastY = y
  state.scrollY = y
  const aim = clamp(dy / dt / 3, -1, 1)
  state.stretch += (aim - state.stretch) * (1 - Math.exp(-dt / 110))
  peak = Math.max(peak * Math.exp(-dt / 900), Math.abs(state.stretch))

  // Coming to rest after a real scroll sets one ripple off.
  if (ripple < 0 && peak > 0.18 && Math.abs(state.stretch) < 0.03) {
    ripple = 0
    state.rippleAmp = Math.min(1, peak * 1.4)
    peak = 0
  }
  if (ripple >= 0) {
    ripple += dt / RIPPLE_MS
    state.rippleFront = 1.25 - ripple * 1.6
    if (ripple >= 1) {
      ripple = -1
      state.rippleAmp = 0
    }
  }

  state.pointer += (pointerAim - state.pointer) * (1 - Math.exp(-dt / 140))

  let busy = false
  for (const sheet of sheets) {
    if (!sheet.visible) continue
    sheet.draw(state)
    busy ||= sheet.busy()
  }

  const moving =
    Math.abs(state.stretch) > 0.002 ||
    ripple >= 0 ||
    Math.abs(state.pointer - pointerAim) > 0.004 ||
    now - pointerMoved < 160
  if (moving || busy) raf = requestAnimationFrame(tick)
}

function kick() {
  if (!raf) {
    if (!last) lastY = scrollY
    last = performance.now()
    raf = requestAnimationFrame(tick)
  }
}

const onScroll = () => kick()
const onPointer = (e: PointerEvent) => {
  if (e.pointerType === "touch") return
  state.px = e.clientX
  state.py = e.clientY
  pointerAim = 1
  pointerMoved = performance.now()
  kick()
}
const onLeave = () => {
  pointerAim = 0
  kick()
}

/** Listen only while some sheet is on screen. */
function listen() {
  const on = [...sheets].some((s) => s.visible)
  if (on === listening) return
  listening = on
  if (on) {
    lastY = scrollY
    addEventListener("scroll", onScroll, { passive: true })
    addEventListener("pointermove", onPointer, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    kick()
  } else {
    removeEventListener("scroll", onScroll)
    removeEventListener("pointermove", onPointer)
    document.documentElement.removeEventListener("pointerleave", onLeave)
  }
}

/* ── Shaders ─────────────────────────────────────────────────────────────── */

const VERT = `#version 300 es
in vec2 aUv;
uniform vec2 uBox;      // the frame, CSS px
uniform vec2 uPad;      // canvas overhang on each side, CSS px
uniform vec2 uCanvas;   // canvas size, CSS px
uniform float uTop;     // frame top in the viewport, CSS px
uniform float uViewH;
uniform float uStretch;
uniform float uTime;
uniform float uRippleFront;
uniform float uRippleAmp;
uniform vec2 uCursor;   // frame-local CSS px
uniform float uPointer;
out vec2 vUv;
out vec2 vLocal;
out float vShade;

void main() {
  vec2 uv = aUv;
  vUv = uv;
  float w = uBox.x;
  float h = uBox.y;
  vec2 c = uBox * 0.5;
  vec2 p = uv * uBox;
  vLocal = p;
  float shade = 0.0;

  // Bulge: the sheet lifts under the pointer, like a lens, lit from it.
  vec2 d = p - uCursor;
  float r = min(w, h) * 0.42;
  float g = exp(-dot(d, d) / (r * r)) * uPointer;
  p += d * g * 0.08;
  shade += g * 0.14 * (-(d.x * 0.6 + d.y * 0.8) / r) + g * 0.04;

  // Ripple: one swell travelling up the sheet; the rows it passes widen and
  // lift, its front catches the light and its back falls into shade.
  if (uRippleAmp > 0.0) {
    float k = (uv.y - uRippleFront) / 0.15;
    float b = exp(-k * k) * uRippleAmp;
    p.x = c.x + (p.x - c.x) * (1.0 + 0.04 * b);
    p.y -= b * h * 0.035;
    shade += -k * exp(-k * k) * uRippleAmp * 0.3;
  }

  // Stretch: the leading edge holds, the tail lags, bowing at the middle
  // and narrowing a little toward the end.
  float s = abs(uStretch);
  float dir = uStretch < 0.0 ? -1.0 : 1.0;
  float trail = uStretch < 0.0 ? 1.0 - uv.y : uv.y;
  p.y += dir * s * h * 0.16 * trail * (1.0 + 0.5 * sin(uv.x * 3.14159265));
  p.x += (0.5 - uv.x) * w * 0.08 * s * trail * trail;

  // Flare: in the bottom band of the screen the sides bloom out, more at the
  // foot than the head (a bell, not a wedge), and a wave runs up the sheet.
  float fy = (uTop + p.y) / uViewH;
  float z = clamp((fy - 0.74) / 0.26, 0.0, 1.0);
  float zone = pow(z * z * (3.0 - 2.0 * z), 1.5);
  float strength = 0.35 + 0.65 * s;
  p.x = c.x + (p.x - c.x) * (1.0 + 0.13 * zone * strength);
  float phase = uv.y * 10.0 + uTime * 2.4 - fy * 7.0;
  p.y += sin(phase) * zone * strength * h * 0.012;
  shade += cos(phase) * zone * strength * 0.07;

  vShade = shade;
  vec2 q = p + uPad;
  gl_Position = vec4(q.x / uCanvas.x * 2.0 - 1.0, 1.0 - q.y / uCanvas.y * 2.0, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uCover;
uniform vec2 uBox;
uniform float uRadius;
in vec2 vUv;
in vec2 vLocal;
in float vShade;
out vec4 outColor;

void main() {
  // The frame's 4px corner, antialiased, in its own unbent coordinates.
  vec2 q = abs(vLocal - uBox * 0.5) - (uBox * 0.5 - uRadius);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float a = clamp(0.5 - d, 0.0, 1.0);
  vec4 col = texture(uTex, (vUv - 0.5) * uCover + 0.5);
  col.rgb *= 1.0 + vShade;
  outColor = vec4(col.rgb * a, a);
}
`

/* ── One sheet ───────────────────────────────────────────────────────────── */

const GRID = 32
const PAD_X = 0.14
const PAD_Y = 0.24

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn("elastic-sheet:", gl.getShaderInfoLog(sh))
    return null
  }
  return sh
}

/**
 * Turn a frame into an elastic sheet. Returns a function that hands the
 * frame back to its DOM media and frees everything.
 */
export function mountSheet({
  box,
  canvas,
  source,
}: {
  box: HTMLElement
  canvas: HTMLCanvasElement
  source: HTMLImageElement | HTMLVideoElement
}): () => void {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: true })
  if (!gl) return () => {}
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  const program = gl.createProgram()
  if (!vs || !fs || !program) return () => {}
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {}
  gl.useProgram(program)

  // The grid: GRID×GRID quads over the frame.
  const uvs = new Float32Array((GRID + 1) * (GRID + 1) * 2)
  for (let j = 0, n = 0; j <= GRID; j++)
    for (let i = 0; i <= GRID; i++) {
      uvs[n++] = i / GRID
      uvs[n++] = j / GRID
    }
  const idx = new Uint16Array(GRID * GRID * 6)
  for (let j = 0, n = 0; j < GRID; j++)
    for (let i = 0; i < GRID; i++) {
      const a = j * (GRID + 1) + i
      const b = a + GRID + 1
      idx.set([a, b, a + 1, a + 1, b, b + 1], n)
      n += 6
    }
  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  const vbo = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW)
  const aUv = gl.getAttribLocation(program, "aUv")
  gl.enableVertexAttribArray(aUv)
  gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0)
  const ibo = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW)

  const u = (name: string) => gl.getUniformLocation(program, name)
  const U = {
    box: u("uBox"),
    pad: u("uPad"),
    canvas: u("uCanvas"),
    top: u("uTop"),
    viewH: u("uViewH"),
    stretch: u("uStretch"),
    time: u("uTime"),
    rippleFront: u("uRippleFront"),
    rippleAmp: u("uRippleAmp"),
    cursor: u("uCursor"),
    pointer: u("uPointer"),
    cover: u("uCover"),
    radius: u("uRadius"),
  }

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const isVideo = source instanceof HTMLVideoElement
  let texW = 0
  let texH = 0
  const upload = () => {
    const w = isVideo ? (source as HTMLVideoElement).videoWidth : (source as HTMLImageElement).naturalWidth
    const h = isVideo ? (source as HTMLVideoElement).videoHeight : (source as HTMLImageElement).naturalHeight
    if (!w || !h) return false
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
    texW = w
    texH = h
    return true
  }

  // Where the frame sits on the page, and the canvas around it. Measured on
  // resize only.
  let docTop = 0
  let docLeft = 0
  let bw = 1
  let bh = 1
  let padX = 0
  let padY = 0
  let cw = 1
  let ch = 1
  const measure = () => {
    const r = box.getBoundingClientRect()
    docTop = r.top + scrollY
    docLeft = r.left + scrollX
    bw = r.width
    bh = r.height
    padX = Math.round(bw * PAD_X)
    padY = Math.round(bh * PAD_Y)
    cw = bw + padX * 2
    ch = bh + padY * 2
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.style.left = `${-padX}px`
    canvas.style.top = `${-padY}px`
    canvas.style.width = `${cw}px`
    canvas.style.height = `${ch}px`
    canvas.width = Math.round(cw * dpr)
    canvas.height = Math.round(ch * dpr)
    gl.viewport(0, 0, canvas.width, canvas.height)
    sheet.draw(state)
  }

  let ready = false
  const sheet: Sheet = {
    visible: false,
    busy: () => isVideo && !(source as HTMLVideoElement).paused,
    draw: (s) => {
      if (!ready) {
        if (!upload()) return
        ready = true
        // The canvas now carries the picture; the DOM media steps back.
        box.dataset.gl = ""
      } else if (isVideo && !(source as HTMLVideoElement).paused) {
        upload()
      }
      const top = docTop - s.scrollY
      const left = docLeft - scrollX
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(U.box, bw, bh)
      gl.uniform2f(U.pad, padX, padY)
      gl.uniform2f(U.canvas, cw, ch)
      gl.uniform1f(U.top, top)
      gl.uniform1f(U.viewH, s.vh)
      gl.uniform1f(U.stretch, s.stretch)
      gl.uniform1f(U.time, s.time)
      gl.uniform1f(U.rippleFront, s.rippleFront)
      gl.uniform1f(U.rippleAmp, s.rippleAmp)
      gl.uniform2f(U.cursor, s.px - left, s.py - top)
      gl.uniform1f(U.pointer, s.pointer)
      gl.uniform1f(U.radius, 4)
      // object-fit: cover
      const ta = texW / texH
      const ba = bw / bh
      gl.uniform2f(U.cover, ta > ba ? ba / ta : 1, ta > ba ? 1 : ta / ba)
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0)
    },
  }

  const ro = new ResizeObserver(measure)
  ro.observe(box)
  addEventListener("resize", measure)
  const io = new IntersectionObserver(
    ([entry]) => {
      sheet.visible = entry.isIntersecting
      listen()
      if (sheet.visible) kick()
    },
    { rootMargin: "25% 0px" },
  )
  io.observe(box)
  sheets.add(sheet)

  // Draw as soon as the picture is there.
  const onLoad = () => {
    sheet.draw(state)
    kick()
  }
  source.addEventListener(isVideo ? "loadeddata" : "load", onLoad)
  if (isVideo) source.addEventListener("play", kick)

  return () => {
    sheets.delete(sheet)
    listen()
    io.disconnect()
    ro.disconnect()
    removeEventListener("resize", measure)
    source.removeEventListener(isVideo ? "loadeddata" : "load", onLoad)
    if (isVideo) source.removeEventListener("play", kick)
    delete box.dataset.gl
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.deleteTexture(tex)
    gl.deleteBuffer(vbo)
    gl.deleteBuffer(ibo)
    gl.deleteVertexArray(vao)
    gl.deleteProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
  }
}
