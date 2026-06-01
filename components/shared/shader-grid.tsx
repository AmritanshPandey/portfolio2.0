"use client"

import { useEffect, useRef, useState } from "react"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

/**
 * Cursor-reactive background grid rendered with a raw WebGL fragment shader.
 *
 * Supports two patterns:
 *   - "dots"  — a dot grid; dots near the cursor grow + brighten + tint orange.
 *   - "lines" — a square line grid; lines near the cursor thicken + brighten + tint.
 *
 * Decorative only (pointer-events-none). Progressive enhancement: the matching
 * static CSS grid is always rendered as a fallback and stays visible when WebGL
 * is unavailable, on touch / coarse pointers, or under reduced motion. The canvas
 * only paints (and the fallback is hidden) once WebGL is confirmed active.
 */

type RGBA = readonly [number, number, number, number] // 0..1
type RGB = readonly [number, number, number] // 0..1

interface ShaderGridProps {
  pattern?: "dots" | "lines"
  /** px between dots / grid lines */
  spacing?: number
  /** px — dot radius, or line half-width */
  size?: number
  /** px influence radius around the cursor */
  glowRadius?: number
  /** base color in light mode */
  lightColor?: RGBA
  /** base color in dark mode */
  darkColor?: RGBA
  /** tint color near the cursor (default orange-400) */
  glowColor?: RGB
}

// Lighter orange (orange-400, #fb923c).
const DEFAULT_GLOW: RGB = [251 / 255, 146 / 255, 60 / 255]

const VERT_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG_DOTS = `
precision highp float;

uniform vec2  u_mouse;       // canvas px (gl_FragCoord space, y-up)
uniform float u_spacing;     // px between dots
uniform float u_size;        // px dot radius at rest
uniform float u_glowRadius;  // px influence radius
uniform vec4  u_baseColor;   // base rgba
uniform vec3  u_glowColor;   // tint near cursor
uniform float u_intensity;   // 0..1 master ease

void main() {
  vec2 frag = gl_FragCoord.xy;

  // Vector from the fragment to its nearest dot centre.
  vec2 offset = mod(frag, u_spacing) - u_spacing * 0.5;
  vec2 center = frag - offset;
  float d = length(offset);

  float md = distance(center, u_mouse);
  float glow = u_intensity * smoothstep(u_glowRadius, 0.0, md);

  float radius = u_size * (1.0 + glow * 1.6);
  float shape = 1.0 - smoothstep(radius - 1.0, radius + 1.0, d);

  vec3 color = mix(u_baseColor.rgb, u_glowColor, glow);
  float alpha = clamp(u_baseColor.a + glow * 0.7, 0.0, 1.0) * shape;

  gl_FragColor = vec4(color, alpha);
}
`

const FRAG_LINES = `
precision highp float;

uniform vec2  u_mouse;       // canvas px (gl_FragCoord space, y-up)
uniform float u_spacing;     // px between grid lines
uniform float u_size;        // px line half-width (constant)
uniform float u_glowRadius;  // px influence radius
uniform vec4  u_baseColor;   // grid line rgba
uniform vec3  u_glowColor;   // square-glow colour near cursor
uniform float u_intensity;   // 0..1 master ease

void main() {
  vec2 frag = gl_FragCoord.xy;

  // Distance to the nearest vertical / horizontal grid line.
  float dx = mod(frag.x, u_spacing);
  dx = min(dx, u_spacing - dx);
  float dy = mod(frag.y, u_spacing);
  dy = min(dy, u_spacing - dy);
  float lineDist = min(dx, dy);

  // The grid lines stay constant (no reactivity).
  float lineShape = 1.0 - smoothstep(u_size - 0.75, u_size + 0.75, lineDist);

  // The squares (cell interiors) glow bright near the cursor.
  float md = distance(frag, u_mouse);
  float glow = u_intensity * smoothstep(u_glowRadius, 0.0, md);
  float glowAlpha = glow * 0.55;

  // Orange glow fills the cells; the grid lines sit on top.
  vec3 color = mix(u_glowColor, u_baseColor.rgb, lineShape);
  float alpha = max(glowAlpha, u_baseColor.a * lineShape);

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
  pattern = "dots",
  spacing = 24,
  size = pattern === "lines" ? 0.6 : 2,
  glowRadius = 140,
  lightColor = pattern === "lines" ? [0, 0, 0, 0.1] : [0, 0, 0, 0.34],
  darkColor = pattern === "lines" ? [1, 1, 1, 0.12] : [1, 1, 1, 0.45],
  glowColor = DEFAULT_GLOW,
}: ShaderGridProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglActive, setWebglActive] = useState(false)

  const { isHigh, isBalanced } = usePerformanceMode()
  const maxDpr = isHigh ? 2 : isBalanced ? 1.5 : 1

  // Stable key so the effect only re-runs when the actual config changes.
  const colorKey = JSON.stringify([lightColor, darkColor, glowColor])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    // ── Guards: fall back to the static CSS grid ──────────────────────────
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const finePointer = window.matchMedia("(pointer: fine)").matches
    if (prefersReducedMotion || !finePointer) return

    const gl = (canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        premultipliedAlpha: false,
      })) as WebGLRenderingContext | null
    if (!gl) return

    const vert = compile(gl, gl.VERTEX_SHADER, VERT_SRC)
    const frag = compile(
      gl,
      gl.FRAGMENT_SHADER,
      pattern === "lines" ? FRAG_LINES : FRAG_DOTS
    )
    if (!vert || !frag) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
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

    const uMouse = gl.getUniformLocation(program, "u_mouse")
    const uSpacing = gl.getUniformLocation(program, "u_spacing")
    const uSize = gl.getUniformLocation(program, "u_size")
    const uGlowRadius = gl.getUniformLocation(program, "u_glowRadius")
    const uBaseColor = gl.getUniformLocation(program, "u_baseColor")
    const uGlowColor = gl.getUniformLocation(program, "u_glowColor")
    const uIntensity = gl.getUniformLocation(program, "u_intensity")

    setWebglActive(true)

    // ── State ─────────────────────────────────────────────────────────────
    let dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    let width = 0
    let height = 0
    // Mouse in canvas px (gl_FragCoord space, y-up). Smoothed toward target.
    let mx = -1e4
    let my = -1e4
    let targetX = -1e4
    let targetY = -1e4
    let intensity = 0
    let targetIntensity = 0
    let raf = 0
    let visible = true

    const isDark = () => document.documentElement.classList.contains("dark")
    let base = isDark() ? darkColor : lightColor

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

    const render = () => {
      mx += (targetX - mx) * 0.15
      my += (targetY - my) * 0.15
      intensity += (targetIntensity - intensity) * 0.08

      gl.uniform2f(uMouse, mx, my)
      gl.uniform1f(uSpacing, spacing * dpr)
      gl.uniform1f(uSize, size * dpr)
      gl.uniform1f(uGlowRadius, glowRadius * dpr)
      gl.uniform4f(uBaseColor, base[0], base[1], base[2], base[3])
      gl.uniform3f(uGlowColor, glowColor[0], glowColor[1], glowColor[2])
      gl.uniform1f(uIntensity, intensity)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      const settling =
        Math.abs(targetX - mx) > 0.5 ||
        Math.abs(targetY - my) > 0.5 ||
        Math.abs(targetIntensity - intensity) > 0.002
      if (visible && (settling || targetIntensity > 0)) {
        raf = requestAnimationFrame(render)
      } else {
        raf = 0
      }
    }

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(render)
    }

    // ── Listeners ─────────────────────────────────────────────────────────
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetX = (e.clientX - rect.left) * dpr
      targetY = (rect.bottom - e.clientY) * dpr // flip y for gl_FragCoord
      targetIntensity = 1
      kick()
    }
    const onPointerLeave = () => {
      targetIntensity = 0
      kick()
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("blur", onPointerLeave)
    document.addEventListener("pointerleave", onPointerLeave)

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

    // React to theme toggles (next-themes flips `.dark` on <html>).
    const mo = new MutationObserver(() => {
      base = isDark() ? darkColor : lightColor
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
      window.removeEventListener("blur", onPointerLeave)
      document.removeEventListener("pointerleave", onPointerLeave)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      setWebglActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxDpr, pattern, spacing, size, glowRadius, colorKey])

  // Static CSS fallback backgrounds, per pattern + theme.
  const fallbackBg = (c: RGBA) =>
    pattern === "lines"
      ? `linear-gradient(to right, ${cssRgba(c)} 1px, transparent 1px), linear-gradient(to bottom, ${cssRgba(c)} 1px, transparent 1px)`
      : `radial-gradient(circle, ${cssRgba(c)} ${size}px, transparent ${size}px)`

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      {/* Static CSS fallback — hidden once WebGL takes over to avoid doubling. */}
      {!webglActive && (
        <>
          <div
            className="absolute inset-0 dark:hidden"
            style={{
              backgroundImage: fallbackBg(lightColor),
              backgroundSize: `${spacing}px ${spacing}px`,
            }}
          />
          <div
            className="absolute inset-0 hidden dark:block"
            style={{
              backgroundImage: fallbackBg(darkColor),
              backgroundSize: `${spacing}px ${spacing}px`,
            }}
          />
        </>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: webglActive ? 1 : 0 }}
      />
    </div>
  )
}
