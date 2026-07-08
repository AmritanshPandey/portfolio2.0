"use client"

import { useEffect, useRef, useState } from "react"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

/**
 * Procedural dot field rendered with a raw WebGL fragment shader, driven
 * entirely in **normalized UV space** (`gl_FragCoord.xy / u_resolution.xy`).
 *
 * The cursor drags the dots along with its motion, like water: the UV field is
 * advected by the pointer's (eased) velocity, so dots get pulled in the travel
 * direction and relax back to rest the moment it stops. Movement is interpolated
 * (lerped) with a touch of inertia for fluid, polished, restrained motion.
 *
 * Decorative only (pointer-events-none). Progressive enhancement: a matching
 * static CSS dot grid is rendered as a fallback and stays visible when WebGL is
 * unavailable or under reduced motion. The canvas only paints (and the fallback
 * is hidden) once WebGL is confirmed active.
 *
 * Input: fine pointers only — mouse, trackpad, pen. Touch-primary devices
 * (phones / tablets) should not display the interactive grid by default; the
 * parent container can hide the `ShaderGrid` on small viewports to avoid the
 * oversized, emerald-tinted interaction that appears under a finger. When the
 * component is mounted it still falls back to a static CSS grid if WebGL is
 * unavailable or reduced-motion is requested. Retina-safe — the canvas scales
 * with DPR while the shader math stays resolution-independent.
 */

type RGBA = readonly [number, number, number, number] // 0..1
type RGB = readonly [number, number, number] // 0..1

interface ShaderGridProps {
  className?: string
  fallbackClassName?: string
  /** CSS px between dots — drives the grid density (resolution-independent) */
  spacing?: number
  /** dot radius as a fraction of the cell (0..0.5) — keep tiny */
  dotSize?: number
  /** influence radius around the cursor in normalized UV (aspect-corrected) */
  radius?: number
  /** how strongly dots are dragged along the cursor's motion (water gain) */
  drag?: number
  /** max drag displacement in normalized UV — keeps it subtle / polished */
  maxDrag?: number
  /** base dot color in light mode */
  lightColor?: RGBA
  /** base dot color in dark mode */
  darkColor?: RGBA
  /** soft tint that bleeds in near the cursor */
  tintColor?: RGB
  /** Opacity used only for the static fallback grid. */
  fallbackOpacity?: number
  /**
   * Autonomous twinkle strength, independent of the cursor. 1 = a restrained
   * breathe. Raise it (e.g. 3–4) for a card-sized field that visibly pulses on
   * its own.
   */
  shimmer?: number
  /**
   * Cursor reactivity. `true` (default) wires the pointer drag / hover glow /
   * click ripples. Set `false` for a calm, autonomous shimmer-only field that
   * ignores the cursor entirely (the breathe/twinkle keeps running).
   */
  interactive?: boolean
}

// Brand emerald (#10b981) — warm tint that bleeds in near the cursor.
const DEFAULT_TINT: RGB = [0.063, 0.725, 0.506]

/* ── Interaction tuning ───────────────────────────────────────────────────
   The four motion layers of the "magnetic liquid" surface. All values live in
   normalized, aspect-corrected UV space; the *_RADIUS values are multiples of
   the `radius` prop so every behaviour scales with the field and the subtle
   hero stays subtle. Tuned toward an expressive — but still tasteful — feel. */

// 1 · Hover — gravity well. The pointer attracts nearby dots: they are pulled
//    inward with a squared falloff (strongest at the centre), the pull bounded
//    so the field gathers toward the cursor without collapsing into a cluster.
const MAGNET_RADIUS = 1.9 // × u_radius — reach of the gravity well
const MAGNET_ATTRACTION_STRENGTH = 0.9 // inward pull gain
const MAX_DOT_DISPLACEMENT = 0.016 // hard clamp on hover displacement (UV)
const HOVER_BASE = 0.034 // absolute UV scale the strength multiplies
const MAGNET_GLOW_RADIUS = 2.7 // × u_radius — soft colour-only halo around the well

// 2 · Drag — directional liquid wake (stronger behind, slight compression ahead)
const WAKE_RADIUS = 2.2 // × u_radius
const WAKE_STRENGTH = 0.05 // overall wake displacement gain
const FORWARD_COMPRESSION = 0.5 // slight compression of dots ahead of travel
const TRAIL_STRETCH = 1.0 // dots trail behind the pointer (the wake)

// 3 · Settling after movement stops (JS-driven damped oscillation)
const SETTLE_RADIUS = 2.0 // × u_radius — local area that springs back
const SETTLE_STRENGTH = 0.5 // gain on the captured stop energy
const SETTLE_FREQUENCY = 6.0 // Hz — ~1–2 visible oscillations
const SETTLE_DECAY = 0.09 // s — exp time-constant (settles in ~250–450ms)
const SETTLE_MIN_SPEED = 0.004 // speed below which movement counts as "stopped"
const SETTLE_MAX_ENERGY = 0.06 // clamp on captured energy → bounded overshoot

// 4 · Click — layered double ripple (shared centre + age)
const PRIMARY_RIPPLE_SPEED = 1.5 // ring radius / s — fast
const PRIMARY_RIPPLE_DURATION = 0.7 // s — short, bright
const PRIMARY_RIPPLE_BAND = 18.0 // higher = thinner ring
const PRIMARY_RIPPLE_PUSH = 0.012 // outward displacement gain
const PRIMARY_RIPPLE_BRIGHT = 2.2 // brightness gain (the brightest moment)
const SECONDARY_RIPPLE_SPEED = 0.7 // slower
const SECONDARY_RIPPLE_DURATION = 1.5 // s — soft, lingering
const SECONDARY_RIPPLE_BAND = 7.0 // lower = wider / softer
const SECONDARY_RIPPLE_PUSH = 0.028 // more displacement than the primary
const SECONDARY_RIPPLE_BRIGHT = 0.8 // less brightness than the primary
const RIPPLE_LIFE = 1.8 // s — u_ripple.w stays live until the secondary fades

// Format a JS number as a GLSL float literal (always with a decimal point) so a
// single set of constants can be inlined into the shader source.
const glf = (n: number) => {
  const s = String(n)
  return s.includes(".") || s.includes("e") ? s : `${s}.0`
}

const VERT_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  u_resolution; // device px
uniform vec2  u_mouse;      // normalized UV (0..1), y-up to match gl_FragCoord
uniform float u_intensity;  // 0..1 master ease (hover in / out)
uniform float u_density;    // dots per unit height
uniform float u_dotSize;    // dot radius in cell fraction
uniform float u_radius;     // influence radius (aspect-corrected UV)
uniform vec2  u_velocity;   // cursor drag vector (normalized UV / frame, gained)
uniform vec4  u_baseColor;  // base dot rgba
uniform vec3  u_tintColor;  // tint near cursor
uniform float u_time;       // seconds — drives the ambient shimmer
uniform float u_shimmer;    // autonomous twinkle strength (1 = restrained)
uniform vec4  u_ripple;     // xy: click centre (0..1, y-up) · z: age s · w: 1 while live
uniform vec2  u_heading;    // persistent normalized cursor direction (UV)
uniform float u_speed;      // eased cursor speed magnitude (UV / frame)
uniform vec4  u_settle;     // xy: settle centre (0..1) · zw: damped settle offset (UV)

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  // ── Normalized UV space ────────────────────────────────────────────────
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Aspect-correct so cells stay square and the field stays circular.
  float aspect = u_resolution.x / u_resolution.y;
  vec2 auv    = vec2(uv.x * aspect, uv.y);
  vec2 amouse = vec2(u_mouse.x * aspect, u_mouse.y);

  // Aspect-space cursor heading (unit) — shared by the magnet bias + the wake.
  vec2  hv    = vec2(u_heading.x * aspect, u_heading.y);
  float hlen  = length(hv);
  vec2  headA = hlen > 0.0001 ? hv / hlen : vec2(0.0);

  // Base watery advection — drag the field upstream of the pointer's motion.
  vec2  vel   = vec2(u_velocity.x * aspect, u_velocity.y);
  vec2  dir   = auv - amouse;
  float dist  = length(dir);
  vec2  dirN  = dist > 0.0001 ? dir / dist : vec2(0.0);
  float force = smoothstep(u_radius, 0.0, dist) * u_intensity;
  float align = dot(dirN, headA); // -1 behind … +1 ahead of the travel axis

  // ── 1 · Hover gravity well — dots are pulled toward the cursor ──────────
  //    (+dirN samples the field further from the cursor, which renders that
  //    dot displaced inward toward the pointer.) Squared falloff keeps the
  //    centre strongest; the pull is clamped so the field gathers without
  //    collapsing into a single cluster.
  float well = smoothstep(u_radius * ${glf(MAGNET_RADIUS)}, 0.0, dist);
  well       *= well;
  vec2  hover = dirN * (${glf(HOVER_BASE)} * ${glf(MAGNET_ATTRACTION_STRENGTH)}) * well * u_intensity;

  float hoverLen = length(hover);
  if (hoverLen > ${glf(MAX_DOT_DISPLACEMENT)}) {
    hover *= ${glf(MAX_DOT_DISPLACEMENT)} / hoverLen;
  }

  // ── 2 · Directional liquid wake — slight compression ahead, trail behind ─
  //    Aligned with the cursor velocity; fades the instant u_speed drops.
  float wakeFall = smoothstep(u_radius * ${glf(WAKE_RADIUS)}, 0.0, dist);
  float wakeAmt  = ${glf(FORWARD_COMPRESSION)} * max(align, 0.0)
                 - ${glf(TRAIL_STRETCH)} * max(-align, 0.0);
  vec2  wake     = headA * wakeFall * u_speed * wakeAmt * ${glf(WAKE_STRENGTH)};

  // ── 3 · Settling — local damped overshoot once the cursor stops ─────────
  //    The damped sinusoid is computed in JS; here we just place it locally.
  vec2  sc         = vec2(u_settle.x * aspect, u_settle.y);
  float settleFall = smoothstep(u_radius * ${glf(SETTLE_RADIUS)}, 0.0, length(auv - sc));
  vec2  settle     = vec2(u_settle.z * aspect, u_settle.w) * settleFall;

  // ── 4 · Click — layered double ripple from one shared centre + age ──────
  //    exp(-x²) is written out by hand: pow() is undefined for negative bases
  //    in GLSL ES, and (rdist - ring) swings negative inside each ring.
  vec2  rc    = vec2(u_ripple.x * aspect, u_ripple.y);
  vec2  rdir  = auv - rc;
  float rdist = length(rdir);
  vec2  rdirN = rdist > 0.0001 ? rdir / rdist : vec2(0.0);
  float age   = u_ripple.z;
  float live  = u_ripple.w;

  // Primary: a thin, bright, fast ring with a short life.
  float r1 = age * ${glf(PRIMARY_RIPPLE_SPEED)};
  float b1 = (rdist - r1) * ${glf(PRIMARY_RIPPLE_BAND)};
  float w1 = exp(-b1 * b1) * exp(-age / ${glf(PRIMARY_RIPPLE_DURATION)}) * live;

  // Secondary: a wider, softer, slower wave that pushes more than it glows.
  float r2 = age * ${glf(SECONDARY_RIPPLE_SPEED)};
  float b2 = (rdist - r2) * ${glf(SECONDARY_RIPPLE_BAND)};
  float w2 = exp(-b2 * b2) * exp(-age / ${glf(SECONDARY_RIPPLE_DURATION)}) * live;

  vec2  ripple = rdirN * (w1 * ${glf(PRIMARY_RIPPLE_PUSH)} + w2 * ${glf(SECONDARY_RIPPLE_PUSH)});

  // Advection upstream · hover gravity-well pull · wake along travel · settle
  // local overshoot · ripples push outward. No displacement at rest → calm.
  vec2  warped = auv - vel * force + hover + wake + settle - ripple;

  // ── Procedural dot grid (no textures) ──────────────────────────────────
  vec2  cellId = floor(warped * u_density);
  vec2  cell   = fract(warped * u_density) - 0.5;
  float d      = length(cell);

  // Resolution-aware antialiasing: ~1px soft edge regardless of DPR.
  float aa   = u_density / u_resolution.y;
  float disc = 1.0 - smoothstep(u_dotSize - aa, u_dotSize + aa, d);

  // ── A living field: per-dot character + autonomous twinkle ─────────────
  //    Some dots sit brighter than others, and each cell has its own phase
  //    and tempo. Higher shimmer values create visible bright peaks instead
  //    of merely dimming the base grid.
  float seed      = hash(cellId);
  float character = 0.72 + 0.55 * seed;
  float shimmerK  = clamp(u_shimmer, 0.0, 6.0);
  float wave      = 0.5 + 0.5 * sin(u_time * (0.62 + 0.28 * shimmerK + seed * 0.42) + seed * 6.2831);
  float sparkle   = pow(wave, 4.0);
  float breathe   = mix(1.0, 0.72 + 0.48 * wave + 0.56 * sparkle, clamp(shimmerK / 4.0, 0.0, 1.0));

  // ── Color + subtle falloff / vignette for depth ────────────────────────
  float vignette = smoothstep(1.15, 0.35, length(uv - 0.5));

  // A soft emerald halo (colour only, no displacement), centred on the pointer
  // so the gravity well reads as a bright pocket where the dots gather.
  float glow = smoothstep(u_radius * ${glf(MAGNET_GLOW_RADIUS)}, 0.0, dist) * u_intensity;

  // The cursor is an emerald energy pocket. The hue goes (near) fully emerald
  // within it so it reads as emerald in BOTH themes — in light mode the base
  // dots are black, so a weak mix would just look dark, not emerald. Emerald
  // rises with proximity, cursor speed, and the ripple wavefronts.
  float warm = clamp(force * 0.9
                   + glow * 0.6
                   + u_speed * 7.0 * glow
                   + w1 * ${glf(PRIMARY_RIPPLE_BRIGHT)}
                   + w2 * ${glf(SECONDARY_RIPPLE_BRIGHT)}, 0.0, 1.0);

  vec3  color = mix(u_baseColor.rgb, u_tintColor, warm);
  // Interaction brightness is added OUTSIDE the vignette multiply, so the glow
  // stays emerald even toward the edges while the resting grid fades for depth.
  float alpha = (u_baseColor.a * vignette * character * breathe
               + force * 0.30
               + glow * 0.16
               + u_speed * 2.6 * glow
               + w1 * ${glf(PRIMARY_RIPPLE_BRIGHT)}
               + w2 * ${glf(SECONDARY_RIPPLE_BRIGHT)}) * disc;

  gl_FragColor = vec4(color, alpha);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

const cssRgba = (c: RGBA) =>
  `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(
    c[2] * 255
  )},${c[3]})`

export function ShaderGrid({
  className,
  fallbackClassName,
  spacing = 16,
  dotSize = 0.08,
  radius = 0.15,
  drag = 2.0,
  maxDrag = 0.014,
  lightColor = [0, 0, 0, 0.42],
  darkColor = [1, 1, 1, 0.5],
  tintColor = DEFAULT_TINT,
  fallbackOpacity = 1,
  shimmer = 1,
  interactive = true,
}: ShaderGridProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglActive, setWebglActive] = useState(false)
  const [fallbackVisible, setFallbackVisible] = useState(false)
  const [contextVersion, setContextVersion] = useState(0)

  const { isHigh, isBalanced } = usePerformanceMode()
  const maxDpr = isHigh ? 2 : isBalanced ? 1.5 : 1

  // Stable key so the effect only re-runs when the actual config changes.
  const colorKey = JSON.stringify([lightColor, darkColor, tintColor])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    setFallbackVisible(false)

    // ── Guard: honour reduced motion (keep the static CSS dot grid) ───────
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFallbackVisible(true)
      return
    }

    // ── Guard: touch-primary devices (phones / tablets) keep the static grid.
    // The pointer glow + drag reads as oversized, emerald-tinted dots under a
    // finger and muddies readability, so skip the interactive WebGL entirely.
    if (window.matchMedia("(pointer: coarse)").matches) {
      setFallbackVisible(true)
      return
    }

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
      })) as WebGLRenderingContext | null
    if (!gl) {
      setFallbackVisible(true)
      return
    }

    const vert = compile(gl, gl.VERTEX_SHADER, VERT_SRC)
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
    if (!vert || !frag) {
      if (vert) gl.deleteShader(vert)
      if (frag) gl.deleteShader(frag)
      setFallbackVisible(true)
      return
    }

    const program = gl.createProgram()
    if (!program) {
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      setFallbackVisible(true)
      return
    }
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      setFallbackVisible(true)
      return
    }
    gl.useProgram(program)

    // Full-screen triangle.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const aPos = gl.getAttribLocation(program, "a_pos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const u = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      intensity: gl.getUniformLocation(program, "u_intensity"),
      density: gl.getUniformLocation(program, "u_density"),
      dotSize: gl.getUniformLocation(program, "u_dotSize"),
      radius: gl.getUniformLocation(program, "u_radius"),
      velocity: gl.getUniformLocation(program, "u_velocity"),
      baseColor: gl.getUniformLocation(program, "u_baseColor"),
      tintColor: gl.getUniformLocation(program, "u_tintColor"),
      time: gl.getUniformLocation(program, "u_time"),
      ripple: gl.getUniformLocation(program, "u_ripple"),
      shimmer: gl.getUniformLocation(program, "u_shimmer"),
      heading: gl.getUniformLocation(program, "u_heading"),
      speed: gl.getUniformLocation(program, "u_speed"),
      settle: gl.getUniformLocation(program, "u_settle"),
    }

    // ── State ─────────────────────────────────────────────────────────────
    let dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    let width = 0
    let height = 0
    let density = 30

    // Normalized cursor (0..1, y-up). Smoothed toward target via lerp.
    let mx = 0.5
    let my = 0.5
    let targetX = 0.5
    let targetY = 0.5
    // Velocity of the smoothed cursor (drag direction), with its own inertia.
    let prevX = 0.5
    let prevY = 0.5
    let velX = 0
    let velY = 0
    let intensity = 0
    let targetIntensity = 0
    // Persistent travel heading (unit) + eased speed — feed the magnet bias,
    // the directional wake, and the velocity-driven glow.
    let headingX = 0
    let headingY = 0
    let speed = 0
    // Settling: capture the burst's peak energy + stop location, then play a
    // short JS-computed damped oscillation back toward rest.
    let movePeak = 0
    let lastSpeed = 0
    let settleCenterX = 0.5
    let settleCenterY = 0.5
    let settleStart = -1e9
    let settleEnergy = 0
    // Click ripple — centre in normalized UV, age derived per frame.
    let rippleX = 0.5
    let rippleY = 0.5
    let rippleStart = -1e9
    let raf = 0
    let visible = true
    let lastTime = 0
    let resizeRaf = 0
    let contextLost = false
    // Hold the matching CSS fallback in place until WebGL has actually drawn its
    // first frame, then hand off — avoids any empty frame or visible swap.
    let painted = false

    // Frame-rate-independent exponential smoothing (rate in 1/sec). Keeps the
    // motion identical at 60Hz and 120Hz (ProMotion iPad / high-refresh displays).
    const approach = (cur: number, target: number, rate: number, dt: number) =>
      cur + (target - cur) * (1 - Math.exp(-rate * dt))

    const isDark = () => document.documentElement.classList.contains("dark")
    let base = isDark() ? darkColor : lightColor

    const resize = () => {
      if (contextLost) return
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const rect = wrap.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(rect.width * dpr))
      const nextHeight = Math.max(1, Math.round(rect.height * dpr))
      if (nextWidth === width && nextHeight === height) return
      width = nextWidth
      height = nextHeight
      if (canvas.width !== width) canvas.width = width
      if (canvas.height !== height) canvas.height = height
      gl.viewport(0, 0, width, height)
      // Density derived from CSS spacing → consistent dot size on any screen.
      density = Math.max(4, rect.height / Math.max(8, spacing))
    }
    resize()

    const scheduleResize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        resize()
        kick()
      })
    }

    const render = (now = performance.now()) => {
      if (contextLost) return
      // Clamp dt so a backgrounded tab (huge gap) can't jolt the field.
      const dt = lastTime
        ? Math.min(Math.max((now - lastTime) / 1000, 1 / 240), 1 / 30)
        : 1 / 60
      lastTime = now

      // Smooth interpolation — soft, never snapping (time-based). Tracks the
      // cursor briskly so the field feels reactive, still eased enough to stay
      // liquid rather than rigid.
      mx = approach(mx, targetX, 7.5, dt)
      my = approach(my, targetY, 7.5, dt)
      intensity = approach(intensity, targetIntensity, 5.5, dt)

      // Watery drag: cursor velocity normalized to a 60fps frame so the drag
      // amount matches on 60Hz and 120Hz, eased for inertia so the dots keep
      // trailing briefly after the pointer slows, then settle.
      const instX = (mx - prevX) / (dt * 60)
      const instY = (my - prevY) / (dt * 60)
      prevX = mx
      prevY = my
      velX = approach(velX, instX, 12.0, dt)
      velY = approach(velY, instY, 12.0, dt)

      let dragX = velX * drag
      let dragY = velY * drag
      const dmag = Math.hypot(dragX, dragY)
      if (dmag > maxDrag) {
        dragX = (dragX / dmag) * maxDrag
        dragY = (dragY / dmag) * maxDrag
      }

      // Eased cursor speed (decoupled from the clamped drag) → wake + glow gain.
      const instSpeed = Math.hypot(instX, instY)
      speed = approach(speed, instSpeed, 12.0, dt)

      // Persistent travel heading — updated only while genuinely moving, so the
      // magnet keeps a faint directional lean for a beat after the cursor stops.
      if (instSpeed > SETTLE_MIN_SPEED) {
        const inv = 1 / instSpeed
        headingX = approach(headingX, instX * inv, 10.0, dt)
        headingY = approach(headingY, instY * inv, 10.0, dt)
      }

      // Settling — capture the burst's peak energy + freeze the spot when the
      // motion ends; a damped sinusoid (real-time t → fps-independent) then
      // plays a brief local overshoot back to rest over ~250–450ms.
      let settleX = 0
      let settleY = 0
      if (speed > SETTLE_MIN_SPEED) {
        movePeak = Math.max(movePeak, speed)
      } else if (lastSpeed > SETTLE_MIN_SPEED) {
        settleStart = now
        settleEnergy = Math.min(movePeak, SETTLE_MAX_ENERGY)
        settleCenterX = mx
        settleCenterY = my
        movePeak = 0
      }
      lastSpeed = speed
      if (settleEnergy > 0) {
        const st = (now - settleStart) / 1000
        if (st > 0.6) {
          settleEnergy = 0
        } else {
          const osc =
            Math.exp(-st / SETTLE_DECAY) * Math.sin(2 * Math.PI * SETTLE_FREQUENCY * st)
          const mag = settleEnergy * osc * SETTLE_STRENGTH
          settleX = headingX * mag
          settleY = headingY * mag
        }
      }

      gl.uniform2f(u.resolution, width, height)
      gl.uniform2f(u.mouse, mx, my)
      gl.uniform1f(u.intensity, intensity)
      gl.uniform1f(u.density, density)
      gl.uniform1f(u.dotSize, dotSize)
      gl.uniform1f(u.radius, radius)
      gl.uniform2f(u.velocity, dragX, dragY)
      gl.uniform4f(u.baseColor, base[0], base[1], base[2], base[3])
      gl.uniform3f(u.tintColor, tintColor[0], tintColor[1], tintColor[2])
      // Wrap the clock hourly to keep float precision healthy in the shader.
      gl.uniform1f(u.time, (now / 1000) % 3600)
      gl.uniform1f(u.shimmer, shimmer)
      gl.uniform2f(u.heading, headingX, headingY)
      gl.uniform1f(u.speed, speed)
      gl.uniform4f(u.settle, settleCenterX, settleCenterY, settleX, settleY)
      const rippleAge = (now - rippleStart) / 1000
      gl.uniform4f(
        u.ripple,
        rippleX,
        rippleY,
        Math.min(rippleAge, 10),
        rippleAge < RIPPLE_LIFE ? 1 : 0
      )

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // Reveal the canvas (and drop the fallback) only after the first real
      // paint, so the swap is seamless instead of flashing the static grid.
      if (!painted) {
        painted = true
        setWebglActive(true)
      }

      // The shimmer breathes continuously, so keep rendering while the field
      // is on screen; IntersectionObserver + visibilitychange pause it the
      // moment it scrolls away or the tab hides.
      if (visible) {
        raf = requestAnimationFrame(render)
      } else {
        raf = 0
      }
    }

    const kick = () => {
      if (!raf && visible && !contextLost) raf = requestAnimationFrame(render)
    }

    // ── Input → normalized 0..1 (y flipped to match gl_FragCoord) ─────────
    const setTarget = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      if (!inside) {
        release()
        return
      }
      targetX = Math.min(1, Math.max(0, (clientX - rect.left) / Math.max(1, rect.width)))
      targetY = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / Math.max(1, rect.height)))
      targetIntensity = 1
      kick()
    }
    const release = () => {
      targetIntensity = 0
      kick()
    }

    // Mouse / trackpad / pen only — never react to touch (it produces the
    // oversized, emerald-tinted "blob under the finger" the design is avoiding).
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      setTarget(e.clientX, e.clientY)
    }

    // A click drops a ripple into the field — one ring, then calm again.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const rect = canvas.getBoundingClientRect()
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        return
      rippleX = (e.clientX - rect.left) / Math.max(1, rect.width)
      rippleY = 1 - (e.clientY - rect.top) / Math.max(1, rect.height)
      rippleStart = performance.now()
      kick()
    }

    // Cursor reactivity is opt-out: when interactive=false we never attach the
    // pointer handlers, so intensity/velocity stay 0 and only the autonomous
    // shimmer animates. Resize / visibility / observers stay wired regardless.
    if (interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true })
      window.addEventListener("pointerdown", onPointerDown, { passive: true })
      window.addEventListener("blur", release)
      document.addEventListener("pointerleave", release)
    }
    window.addEventListener("resize", scheduleResize, { passive: true })
    window.addEventListener("orientationchange", scheduleResize)
    window.visualViewport?.addEventListener("resize", scheduleResize, { passive: true })
    window.visualViewport?.addEventListener("scroll", scheduleResize, { passive: true })
    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible"
      if (visible) {
        lastTime = 0
        scheduleResize()
        kick()
      } else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    const ro =
      "ResizeObserver" in window
        ? new ResizeObserver(() => {
            scheduleResize()
          })
        : null
    ro?.observe(wrap)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) kick()
        else if (raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 }
    )
    io.observe(wrap)

    // React to theme toggles (next-themes flips `.dark` on <html>).
    const mo = new MutationObserver(() => {
      base = isDark() ? darkColor : lightColor
      kick()
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const onContextLost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      if (raf) cancelAnimationFrame(raf)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      raf = 0
      resizeRaf = 0
      setWebglActive(false)
      setFallbackVisible(true)
    }
    const onContextRestored = () => {
      setContextVersion((version) => version + 1)
    }
    canvas.addEventListener("webglcontextlost", onContextLost)
    canvas.addEventListener("webglcontextrestored", onContextRestored)

    // Paint once so the static grid is present even before any interaction.
    kick()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("blur", release)
      window.removeEventListener("resize", scheduleResize)
      window.removeEventListener("orientationchange", scheduleResize)
      window.visualViewport?.removeEventListener("resize", scheduleResize)
      window.visualViewport?.removeEventListener("scroll", scheduleResize)
      document.removeEventListener("pointerleave", release)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      ro?.disconnect()
      io.disconnect()
      mo.disconnect()
      canvas.removeEventListener("webglcontextlost", onContextLost)
      canvas.removeEventListener("webglcontextrestored", onContextRestored)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      setWebglActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDpr, spacing, dotSize, radius, drag, maxDrag, shimmer, interactive, colorKey, contextVersion])

  // Static CSS fallback — matches the resting WebGL dot field, per theme. The
  // soft edge is centered on the true dot radius (instead of starting there and
  // fading outward) so the dots read at the same size as the shader's — keeping
  // them from looking bigger/crisper in the brief moment before WebGL paints.
  const dotR = dotSize * spacing
  const fallbackBg = (c: RGBA) =>
    `radial-gradient(circle, ${cssRgba(c)} ${Math.max(
      0,
      dotR - 0.5
    )}px, transparent ${dotR + 0.5}px)`

  // Mirrors the shader's vignette — smoothstep(1.15, 0.35, length(uv - 0.5)),
  // sampled across the curve so the falloff is smooth rather than a few hard
  // bands. `ellipse` (not circle) matches the shader's per-axis normalized UV,
  // so the fade stays true on wide / non-square viewports.
  const vignetteMask =
    "radial-gradient(ellipse farthest-corner at center, " +
    "#000 50%, " +
    "rgba(0,0,0,0.98) 60%, " +
    "rgba(0,0,0,0.91) 70%, " +
    "rgba(0,0,0,0.82) 80%, " +
    "rgba(0,0,0,0.71) 90%, " +
    "rgba(0,0,0,0.58) 100%)"

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {/* Static CSS fallback. Stays mounted and crossfades out once WebGL has
          painted (instead of an instant swap), so any residual difference from
          the shader grid dissolves rather than flashing. Remains fully visible
          when WebGL is unavailable / reduced motion (webglActive never flips). */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ease-out ${fallbackClassName ?? ""}`}
        style={{ opacity: !webglActive && fallbackVisible ? fallbackOpacity : 0 }}
      >
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: fallbackBg(lightColor),
            backgroundSize: `${spacing}px ${spacing}px`,
            maskImage: vignetteMask,
            WebkitMaskImage: vignetteMask,
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: fallbackBg(darkColor),
            backgroundSize: `${spacing}px ${spacing}px`,
            maskImage: vignetteMask,
            WebkitMaskImage: vignetteMask,
          }}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-300 ease-out"
        style={{
          opacity: webglActive ? 1 : 0,
          display: "block",
          contain: "strict",
          transform: "translateZ(0)",
        }}
      />
    </div>
  )
}
