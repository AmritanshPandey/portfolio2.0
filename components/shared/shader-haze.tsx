"use client"

import { useEffect, useRef, useState } from "react"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

/**
 * A slow-drifting warm light haze rendered with a raw WebGL fragment shader —
 * domain-warped fractal value noise that breathes across the surface like soft
 * studio light. Designed as ambient background texture (footer / quiet zones),
 * far more restrained than the hero's dot field.
 *
 * The cursor is a gentle glow pocket: brightness lifts slightly where the
 * pointer rests and eases back out, never snapping. Decorative only
 * (pointer-events-none).
 *
 * Progressive enhancement: a matching static CSS gradient is rendered as a
 * fallback and stays visible under reduced motion or when WebGL is
 * unavailable. The canvas only fades in once it has actually painted a frame,
 * so there's no flash or empty gap on load.
 *
 * Retina-safe — the canvas scales with DPR (capped low; the haze is soft, so a
 * smaller buffer is indistinguishable and far cheaper). Resolution-independent.
 */

type RGB = readonly [number, number, number] // 0..1

interface ShaderHazeProps {
  /** warm tint of the haze (0..1 rgb) */
  tint?: RGB
  /** master opacity in light mode */
  lightAlpha?: number
  /** master opacity in dark mode */
  darkAlpha?: number
  /** drift speed multiplier (subtle by default) */
  speed?: number
}

// Brand rose (#fb7185-ish) — warm light, not a hard red.
const DEFAULT_TINT: RGB = [0.984, 0.443, 0.522]

const VERT_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision highp float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;      // normalized UV (0..1), y-up
uniform float u_intensity;  // 0..1 cursor ease
uniform vec3  u_tint;
uniform float u_alpha;      // master opacity

// ── Cheap value noise + fbm ───────────────────────────────────────────────
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time;

  // ── Domain-warped fbm — organic, visibly flowing drift ───────────────────
  // Each fbm layer moves on its own vector so the field churns and folds
  // rather than just sliding, giving a living, breathing light.
  vec2 q = vec2(
    fbm(p * 1.5 + vec2(0.0, t)),
    fbm(p * 1.5 + vec2(t * 0.8, 1.3) - 0.6 * t)
  );
  vec2 r = vec2(
    fbm(p * 2.0 + q * 1.6 + vec2(1.7 - t * 0.7, 9.2)),
    fbm(p * 2.0 + q * 1.6 + vec2(8.3, 2.8 + t * 0.6))
  );
  float f = fbm(p * 2.2 + r * 1.4 + 0.4 * t);

  // Shape the cloud: lift the mid-tones into a fuller, more present bloom.
  float cloud = smoothstep(0.15, 0.85, f);

  // ── Cursor glow pocket — a brightness lift near the pointer, eased ────────
  vec2  m    = vec2(u_mouse.x * aspect, u_mouse.y);
  float d    = length(p - m);
  float glow = smoothstep(0.5, 0.0, d) * u_intensity;

  // ── Soft edge falloff so the haze melts in — but keep it generous so the
  //    light reaches well into the footer, not just a thin rim. ─────────────
  float vig = smoothstep(1.35, 0.05, length(uv - 0.5));

  float alpha = (cloud * 1.15 + glow * 0.7) * u_alpha * vig;

  gl_FragColor = vec4(u_tint, alpha);
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

const cssRgb = (c: RGB, a: number) =>
  `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(
    c[2] * 255
  )},${a})`

export function ShaderHaze({
  tint = DEFAULT_TINT,
  lightAlpha = 0.3,
  darkAlpha = 0.5,
  speed = 1,
}: ShaderHazeProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglActive, setWebglActive] = useState(false)

  const { isHigh, isBalanced } = usePerformanceMode()
  // The haze is soft, so a small buffer is indistinguishable — keep it cheap.
  const maxDpr = isHigh ? 1 : isBalanced ? 0.75 : 0.6

  const key = JSON.stringify([tint, lightAlpha, darkAlpha, speed])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    // Honour reduced motion — keep the static CSS gradient fallback.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        premultipliedAlpha: false,
      })) as WebGLRenderingContext | null
    if (!gl) return

    const vert = compile(gl, gl.VERTEX_SHADER, VERT_SRC)
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
    if (!vert || !frag) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

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
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      intensity: gl.getUniformLocation(program, "u_intensity"),
      tint: gl.getUniformLocation(program, "u_tint"),
      alpha: gl.getUniformLocation(program, "u_alpha"),
    }

    // ── State ─────────────────────────────────────────────────────────────
    let dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    let width = 0
    let height = 0

    let mx = 0.5
    let my = 0.5
    let targetX = 0.5
    let targetY = 0.5
    let intensity = 0
    let targetIntensity = 0
    let time = 0
    let raf = 0
    let visible = true
    let painted = false
    let lastTime = 0

    const approach = (cur: number, target: number, rate: number, dt: number) =>
      cur + (target - cur) * (1 - Math.exp(-rate * dt))

    const isDark = () => document.documentElement.classList.contains("dark")
    let alpha = isDark() ? darkAlpha : lightAlpha

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const rect = wrap.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width * dpr))
      height = Math.max(1, Math.round(rect.height * dpr))
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }
    resize()

    const render = (now = performance.now()) => {
      const dt = lastTime
        ? Math.min(Math.max((now - lastTime) / 1000, 1 / 240), 1 / 30)
        : 1 / 60
      lastTime = now

      // Frame-rate-independent drift — visible, but still calm and ambient.
      time += dt * 0.22 * speed

      mx = approach(mx, targetX, 4.0, dt)
      my = approach(my, targetY, 4.0, dt)
      intensity = approach(intensity, targetIntensity, 3.0, dt)

      gl.uniform2f(u.resolution, width, height)
      gl.uniform1f(u.time, time)
      gl.uniform2f(u.mouse, mx, my)
      gl.uniform1f(u.intensity, intensity)
      gl.uniform3f(u.tint, tint[0], tint[1], tint[2])
      gl.uniform1f(u.alpha, alpha)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      // Reveal only after the first real paint — seamless, no flash / gap.
      if (!painted) {
        painted = true
        setWebglActive(true)
      }

      // The haze drifts continuously while in view; pause otherwise.
      if (visible) raf = requestAnimationFrame(render)
      else raf = 0
    }

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(render)
    }

    const setTarget = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      targetX = (clientX - rect.left) / Math.max(1, rect.width)
      targetY = 1 - (clientY - rect.top) / Math.max(1, rect.height)
      targetIntensity = 1
    }
    const release = () => {
      targetIntensity = 0
    }

    const onPointerMove = (e: PointerEvent) => setTarget(e.clientX, e.clientY)

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("blur", release)
    document.addEventListener("pointerleave", release)

    const ro = new ResizeObserver(() => {
      resize()
      kick()
    })
    ro.observe(wrap)

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

    const mo = new MutationObserver(() => {
      alpha = isDark() ? darkAlpha : lightAlpha
      kick()
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    kick()

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("blur", release)
      document.removeEventListener("pointerleave", release)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      setWebglActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDpr, key])

  // Static CSS fallback — a soft warm bloom that matches the haze at rest, so
  // the swap (or a no-WebGL / reduced-motion render) is seamless.
  const fallback = (a: number) =>
    `radial-gradient(120% 90% at 70% 15%, ${cssRgb(tint, a)} 0%, transparent 60%)`

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{ opacity: webglActive ? 0 : 1 }}
      >
        <div
          className="absolute inset-0 dark:hidden"
          style={{ backgroundImage: fallback(lightAlpha) }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{ backgroundImage: fallback(darkAlpha) }}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-500 ease-out"
        style={{ opacity: webglActive ? 1 : 0 }}
      />
    </div>
  )
}
