"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

/**
 * Chromatic-lens hero — a WebGL recreation of the incredibles.dev hero.
 *
 * The giant headline is rasterised to a texture on an offscreen 2D canvas, then
 * a single full-screen fragment shader draws everything: the off-white canvas
 * with a faint square-dot halftone, the near-black type, and — inside a disc
 * that follows the cursor — a magnified, refracted, per-channel
 * chromatically-aberrated, halftone-screened, magenta-tinted copy of the
 * letters with a soft bloom.
 *
 * Progressive enhancement: a real, styled <h1> sits under the canvas. The
 * canvas is transparent until it has painted a frame, so if WebGL is missing,
 * JS is disabled, or the shader fails to compile, the headline still renders
 * and reads normally (and stays the document's <h1> for crawlers). Reduced
 * motion parks the lens and skips the rAF loop; touch devices get a slow
 * autonomous drift; fine pointers follow the cursor.
 */

const LINES = ["Product design", "for fintech", "that can't", "afford to miss"]

/** Reference magenta (the incredibles.dev lens hue). */
const TINT: [number, number, number] = [1.0, 0.18, 0.49]

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;

uniform vec2  u_res;       // drawing-buffer px
uniform vec2  u_mouse;     // px, y-up (gl_FragCoord space)
uniform float u_intensity; // 0..1 ease in/out
uniform float u_radius;    // lens radius, px
uniform float u_dpr;
uniform sampler2D u_text;  // white type on transparent (FLIP_Y on upload)
uniform vec3  u_bg;
uniform vec3  u_ink;
uniform vec3  u_tint;

float textAt(vec2 fragUp) {
  return texture2D(u_text, fragUp / u_res).r;
}

void main() {
  vec2 frag = gl_FragCoord.xy;          // y-up
  vec2 uv   = frag / u_res;

  // ── Base: off-white canvas + faint square-dot halftone + near-black type ──
  float cell   = 16.0 * u_dpr;
  vec2  gpos   = mod(frag, cell) - cell * 0.5;
  float bgDot  = 1.0 - smoothstep(0.6 * u_dpr, 1.4 * u_dpr, length(gpos));
  vec3  col    = mix(u_bg, mix(u_bg, u_ink, 0.14), bgDot * 0.5);

  float baseTxt = textAt(frag);
  col = mix(col, u_ink, baseTxt);

  // ── Lens ─────────────────────────────────────────────────────────────────
  float dist = distance(frag, u_mouse);
  float fo   = smoothstep(u_radius, 0.0, dist) * u_intensity; // 1 centre → 0 rim

  if (fo > 0.001) {
    vec2  dir  = frag - u_mouse;
    float rn   = clamp(dist / u_radius, 0.0, 1.0);
    vec2  ndir = dir / max(dist, 1.0);

    // Refraction: magnify toward the centre, bulge near the rim.
    vec2 lensFrag = u_mouse + dir * (1.0 - 0.34 * fo);
    lensFrag += ndir * sin(rn * 3.14159) * 10.0 * u_dpr * fo;

    // Per-channel chromatic aberration along the radial direction.
    vec2 ca = ndir * (7.0 * u_dpr) * fo;
    float tr = textAt(lensFrag + ca);
    float tg = textAt(lensFrag);
    float tb = textAt(lensFrag - ca);
    float txt = max(max(tr, tg), tb);

    // Dense halftone dot-screen inside the disc.
    float hcell = 6.0 * u_dpr;
    vec2  hp    = mod(frag, hcell) - hcell * 0.5;
    float dot   = 1.0 - smoothstep(1.6 * u_dpr, 2.6 * u_dpr, length(hp));

    // Magenta type with the RGB split showing cyan / red fringes.
    vec3 lensCol = mix(u_bg, u_tint, txt);
    lensCol += vec3(tr - tg, (tg - tr) * 0.5 + (tg - tb) * 0.5, tb - tg) * 0.9;
    // Screen the letters through the halftone (darker between dots).
    lensCol = mix(lensCol, lensCol * 0.5, (1.0 - dot) * txt * 0.7);
    // Soft magenta bloom.
    lensCol += u_tint * fo * (0.12 + txt * 0.10);

    col = mix(col, lensCol, fo);
  }

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function readVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

/** Resolve a CSS color string to 0..1 rgb via a scratch canvas. */
function toRGB(css: string): [number, number, number] {
  const c = document.createElement("canvas")
  c.width = c.height = 1
  const ctx = c.getContext("2d")!
  ctx.fillStyle = "#000"
  ctx.fillStyle = css
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

export function ChromaticLensHero() {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarse = window.matchMedia("(pointer: coarse)").matches

    const gl = (canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null
    if (!gl) return // fallback <h1> stays visible

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, "a_pos")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      intensity: gl.getUniformLocation(prog, "u_intensity"),
      radius: gl.getUniformLocation(prog, "u_radius"),
      dpr: gl.getUniformLocation(prog, "u_dpr"),
      text: gl.getUniformLocation(prog, "u_text"),
      bg: gl.getUniformLocation(prog, "u_bg"),
      ink: gl.getUniformLocation(prog, "u_ink"),
      tint: gl.getUniformLocation(prog, "u_tint"),
    }

    // ── Text texture — rasterise the headline on an offscreen 2D canvas ──────
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const textCanvas = document.createElement("canvas")
    const tctx = textCanvas.getContext("2d")!
    // The real family that next/font applied to <body> (a hashed name).
    const family = getComputedStyle(document.body).fontFamily || "sans-serif"

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0
    let H = 0

    const renderText = () => {
      const rect = root.getBoundingClientRect()
      const cssW = Math.max(1, rect.width)
      const cssH = Math.max(1, rect.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.round(cssW * dpr)
      H = Math.round(cssH * dpr)

      canvas.width = W
      canvas.height = H
      textCanvas.width = W
      textCanvas.height = H
      gl.viewport(0, 0, W, H)

      const fs = Math.min(Math.max(cssW * 0.135, 44), 200) * dpr
      const lh = fs * 0.92
      const padX = 20 * dpr
      const blockH = lh * LINES.length
      let y = (H - blockH) / 2

      tctx.clearRect(0, 0, W, H)
      tctx.fillStyle = "#fff"
      tctx.textBaseline = "top"
      tctx.textAlign = "left"
      tctx.font = `700 ${fs}px ${family}`
      for (const line of LINES) {
        tctx.fillText(line, padX, y)
        y += lh
      }

      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
    }

    // ── Colours (theme-aware base; magenta lens matches the reference) ───────
    let bg = toRGB(readVar("--background", "#fafafa"))
    let ink = toRGB(readVar("--foreground", "#2b2b2b"))
    const refreshColors = () => {
      bg = toRGB(readVar("--background", "#fafafa"))
      ink = toRGB(readVar("--foreground", "#2b2b2b"))
    }

    // ── Lens state ───────────────────────────────────────────────────────────
    let mx = 0.42
    let my = 0.52 // normalized (0..1), y-up
    let tx = mx
    let ty = my
    let intensity = reduce ? 1 : 0
    let targetIntensity = reduce ? 1 : coarse ? 1 : 0
    const radius = () => Math.min(W, H) * (coarse ? 0.26 : 0.22)

    const draw = () => {
      gl.uniform2f(u.res, W, H)
      gl.uniform1f(u.dpr, dpr)
      gl.uniform2f(u.mouse, mx * W, my * H)
      gl.uniform1f(u.intensity, intensity)
      gl.uniform1f(u.radius, radius())
      gl.uniform3f(u.bg, bg[0], bg[1], bg[2])
      gl.uniform3f(u.ink, ink[0], ink[1], ink[2])
      gl.uniform3f(u.tint, TINT[0], TINT[1], TINT[2])
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.uniform1i(u.text, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let painted = false
    const reveal = () => {
      if (painted) return
      painted = true
      canvas.style.opacity = "1"
    }

    // Fonts settle before rasterising, or the texture uses a fallback face.
    let ready = false
    document.fonts.ready.then(() => {
      renderText()
      ready = true
      draw()
      reveal()
    })

    // ── Reduced motion: one static frame, no loop, no listeners ──────────────
    if (reduce) {
      return () => {
        gl.getExtension("WEBGL_lose_context")?.loseContext()
      }
    }

    let raf = 0
    let running = true
    let last = performance.now()

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const rect = root.getBoundingClientRect()
      tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      ty = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height)) // flip to y-up
      targetIntensity = 1
    }
    const onLeave = () => { targetIntensity = coarse ? 1 : 0 }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now

      if (coarse) {
        const s = now / 1000
        tx = 0.5 + Math.sin(s * 0.55) * 0.24
        ty = 0.5 + Math.sin(s * 0.9 + 1.1) * 0.16
      }

      const k = 1 - Math.exp(-9 * dt)
      mx += (tx - mx) * k
      my += (ty - my) * k
      intensity += (targetIntensity - intensity) * (1 - Math.exp(-6 * dt))

      if (ready) {
        draw()
        reveal()
      }
      raf = running ? requestAnimationFrame(loop) : 0
    }

    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true })
      document.addEventListener("pointerleave", onLeave)
      window.addEventListener("blur", onLeave)
    }

    const ro = new ResizeObserver(() => {
      renderText()
      if (ready) draw()
    })
    ro.observe(root)

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
        if (running && !raf) {
          last = performance.now()
          raf = requestAnimationFrame(loop)
        } else if (!running && raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 }
    )
    io.observe(root)

    const mo = new MutationObserver(() => {
      refreshColors()
      if (ready) draw()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    raf = requestAnimationFrame(loop)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [])

  return (
    <main
      ref={rootRef}
      className="clens relative min-h-[100svh] overflow-hidden bg-background text-foreground"
    >
      {/* Fallback + SEO: the real headline, styled like the hero. Sits under the
          canvas, so it shows whenever WebGL / JS is unavailable. */}
      <div className="clens absolute inset-0 z-0 flex flex-col justify-center px-5 md:px-8">
        <h1 className="clens__type text-foreground">
          {LINES.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
      </div>

      {/* WebGL canvas — fades in once it has actually painted a frame. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 z-[1] h-full w-full opacity-0 transition-opacity duration-500 ease-out"
      />

      {/* ── Chrome (above the canvas) ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto absolute left-5 top-24 flex flex-wrap items-center gap-2 md:left-8">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-[12px] font-medium text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45"
          >
            <IconArrowLeft size={14} stroke={2} />
            Showcase
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-md">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#ff2e7e" }} />
            Kinetic type · Chromatic lens
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-5 pb-10 md:flex-row md:items-end md:justify-between md:px-8 md:pb-12">
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-foreground/75 md:text-[17px]">
            Seven years shipping payments, platforms, and AI commerce, from the
            first demo to the CPO&apos;s Money20/20 stage.
          </p>
          <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
            Move your cursor
          </p>
        </div>
      </div>
    </main>
  )
}
