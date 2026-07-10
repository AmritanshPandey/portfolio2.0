"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

/**
 * Chromatic-lens hero — a WebGL recreation of the incredibles.dev hero.
 *
 * The centred headline is rasterised to a texture on an offscreen 2D canvas,
 * then a single full-screen fragment shader draws everything: the light-gray
 * canvas with a fine dark dot-grid, the near-black type, and — inside a disc
 * that lags behind the cursor with inertia (leaving a comet stretch) — an
 * authentic halftone where each pink dot's size grows with the darkness of the
 * letter beneath it, plus a solid pink centre dot, a soft magenta bloom, and a
 * subtle chromatic aberration.
 *
 * Progressive enhancement: a real, styled <h1> sits under the canvas, so if
 * WebGL is missing, JS is disabled, or the shader fails, the headline still
 * renders and stays the document's crawler-visible heading. The canvas is
 * transparent until it has painted a frame. Reduced motion parks the lens and
 * skips the rAF loop; touch devices get a slow autonomous drift; fine pointers
 * follow the cursor.
 */

const LINES = ["Product design", "for fintech that", "can't afford", "to miss"]

/** Hot magenta — the incredibles.dev lens hue. */
const TINT: [number, number, number] = [1.0, 0.12, 0.42]

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;

uniform vec2  u_res;       // drawing-buffer px
uniform vec2  u_mouse;     // px, y-up (lagged lens centre)
uniform vec2  u_vel;       // px, lens velocity (for the comet stretch)
uniform float u_intensity; // 0..1 ease in/out
uniform float u_radius;    // lens radius, px
uniform float u_dpr;
uniform float u_time;      // seconds — drives the ripple shimmer
uniform sampler2D u_text;  // white type on transparent (FLIP_Y on upload)
uniform vec3  u_bg;
uniform vec3  u_ink;
uniform vec3  u_tint;

float txt(vec2 fragUp) { return texture2D(u_text, fragUp / u_res).r; }

// Layered sine field in grid-cell units → soft shimmering ripple bands.
// Returns roughly -1..1.
float field(vec2 p, float t) {
  float w = 0.0;
  w += sin(p.x * 0.85 + t * 0.65);
  w += sin(p.y * 1.05 - t * 0.5);
  w += sin((p.x + p.y) * 0.6 + t * 0.9);
  w += sin((p.x - p.y) * 0.45 - t * 0.4);
  return w * 0.25;
}

void main() {
  vec2 frag = gl_FragCoord.xy;   // y-up
  vec2 uv   = frag / u_res;

  // ── Living dot field ─────────────────────────────────────────────────────
  // A procedural grid whose dots are displaced + scaled by the layered field
  // (shimmering ripple bands drift across) and by an expanding ring emanating
  // from the cursor. Each dot can wander into a neighbouring cell, so we test
  // the 3x3 block and keep the strongest coverage.
  float cell  = 22.0 * u_dpr;
  float aa    = 1.0 * u_dpr;
  float baseR = 1.4 * u_dpr;

  float md     = length(frag - u_mouse);
  // Expanding ripple rings around the pointer — the "magical" push. Wider reach
  // and stronger amplitude so the rings clearly ride out through the field.
  float curRip = sin(md * 0.028 / u_dpr - u_time * 3.6) * exp(-md * 0.0014 / u_dpr) * u_intensity;

  float dotCov = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2  cid    = floor(frag / cell) + vec2(float(i), float(j));
      vec2  center = (cid + 0.5) * cell;
      float w      = field(center / cell, u_time) + curRip * 2.1;
      vec2  disp   = vec2(sin(w * 3.14159), cos(w * 3.14159)) * 5.2 * u_dpr;
      // A pool of enlarged dots gathers under the pointer. (Inverse falloff
      // written with increasing edges — reversed smoothstep edges are
      // undefined in GLSL and vary by driver.)
      float prox   = (1.0 - smoothstep(0.0, u_radius * 2.0, length(center - u_mouse))) * u_intensity;
      float r      = baseR * (0.55 + 0.78 * (w * 0.5 + 0.5) + prox * prox * 1.9);
      float dd     = length(frag - (center + disp));
      dotCov = max(dotCov, 1.0 - smoothstep(r - aa, r + aa, dd));
    }
  }

  // Dots read as a faint gray field, warming to magenta near the cursor.
  float mtint = (1.0 - smoothstep(0.0, u_radius * 1.9, md)) * u_intensity;
  vec3  dotCol = mix(mix(u_bg, u_ink, 0.17), u_tint, mtint * 0.7);
  vec3  col    = mix(u_bg, dotCol, dotCov * 0.66);

  // Near-black type sits on top of the field.
  col = mix(col, u_ink, txt(frag));

  // ── Comet-stretched falloff: reach further on the trailing side ──────────
  vec2  toC   = frag - u_mouse;
  vec2  vdir  = length(u_vel) > 1.0 ? normalize(u_vel) : vec2(0.0);
  float along = dot(toC, vdir);                       // >0 ahead, <0 behind
  vec2  d     = toC - vdir * clamp(-along, 0.0, u_radius) * 0.55;
  float dist  = length(d);
  float fo    = (1.0 - smoothstep(0.0, u_radius, dist)) * u_intensity;

  // Soft magenta bloom — always present under the pointer, spills past the disc.
  float halo  = (1.0 - smoothstep(0.0, u_radius * 1.7, length(toC))) * u_intensity;
  col += u_tint * halo * halo * 0.14;

  if (fo > 0.001) {
    vec2  dir  = frag - u_mouse;
    vec2  ndir = dir / max(length(dir), 1.0);

    // Refraction: magnify toward the centre, bulge near the rim.
    vec2 lf = u_mouse + dir * (1.0 - 0.26 * fo);
    lf += ndir * sin(clamp(length(dir) / u_radius, 0.0, 1.0) * 3.14159) * 7.0 * u_dpr * fo;

    // Subtle per-channel chromatic aberration.
    vec2 ca = ndir * 4.0 * u_dpr * fo;
    float tr = txt(lf + ca);
    float tg = txt(lf);
    float tb = txt(lf - ca);
    float cov = max(max(tr, tg), tb);

    // Authentic halftone: each cell's dot RADIUS grows with letter darkness.
    float hcell = 7.0 * u_dpr;
    vec2  hc    = mod(frag, hcell) - hcell * 0.5;
    float dotR  = sqrt(cov) * hcell * 0.66;
    float dot   = 1.0 - smoothstep(dotR - 1.0 * u_dpr, dotR + 1.0 * u_dpr, length(hc));

    vec3 lensCol = u_bg;
    lensCol = mix(lensCol, u_tint, dot);                 // pink halftone letters
    lensCol += vec3(tr - tg, 0.0, tb - tg) * 0.5 * dot;  // cyan / red fringe

    // Solid pink centre dot — the lagging "cursor".
    float core = 1.0 - smoothstep(5.0 * u_dpr, 8.5 * u_dpr, dist);
    lensCol = mix(lensCol, u_tint, core);

    // Inner bloom lift.
    lensCol += u_tint * fo * fo * 0.22;

    col = mix(col, lensCol, clamp(fo * 1.25, 0.0, 1.0));
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
      vel: gl.getUniformLocation(prog, "u_vel"),
      intensity: gl.getUniformLocation(prog, "u_intensity"),
      radius: gl.getUniformLocation(prog, "u_radius"),
      dpr: gl.getUniformLocation(prog, "u_dpr"),
      time: gl.getUniformLocation(prog, "u_time"),
      text: gl.getUniformLocation(prog, "u_text"),
      bg: gl.getUniformLocation(prog, "u_bg"),
      ink: gl.getUniformLocation(prog, "u_ink"),
      tint: gl.getUniformLocation(prog, "u_tint"),
    }

    // ── Text texture — rasterise the centred headline offscreen ──────────────
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const textCanvas = document.createElement("canvas")
    const tctx = textCanvas.getContext("2d")!
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

      const fs = Math.min(Math.max(cssW * 0.078, 32), 112) * dpr
      const lh = fs * 1.02
      const blockH = lh * LINES.length
      let y = (H - blockH) / 2

      tctx.clearRect(0, 0, W, H)
      tctx.fillStyle = "#fff"
      tctx.textBaseline = "top"
      tctx.textAlign = "center"
      tctx.font = `700 ${fs}px ${family}`
      for (const line of LINES) {
        tctx.fillText(line, W / 2, y)
        y += lh
      }

      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
    }

    // ── Palette — reference light gray / dark, switched on the .dark class ───
    const isDark = () => document.documentElement.classList.contains("dark")
    let bg: [number, number, number] = [0.922, 0.918, 0.91]
    let ink: [number, number, number] = [0.09, 0.09, 0.09]
    const refreshColors = () => {
      if (isDark()) {
        bg = [0.055, 0.055, 0.055]
        ink = [0.96, 0.96, 0.96]
      } else {
        bg = [0.922, 0.918, 0.91]
        ink = [0.09, 0.09, 0.09]
      }
    }
    refreshColors()

    // ── Lens state ───────────────────────────────────────────────────────────
    let mx = 0.5
    let my = 0.52
    let tx = mx
    let ty = my
    let pmx = mx
    let pmy = my
    let velX = 0
    let velY = 0
    let intensity = reduce ? 1 : 0
    let targetIntensity = reduce ? 1 : coarse ? 1 : 0
    const radius = () => Math.min(W, H) * (coarse ? 0.2 : 0.17)

    const draw = () => {
      gl.uniform2f(u.res, W, H)
      gl.uniform1f(u.dpr, dpr)
      gl.uniform2f(u.mouse, mx * W, my * H)
      gl.uniform2f(u.vel, velX * W, velY * H)
      gl.uniform1f(u.intensity, intensity)
      gl.uniform1f(u.radius, radius())
      gl.uniform1f(u.time, (performance.now() / 1000) % 3600)
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

    // Free the GL objects this effect allocated. getContext returns the same
    // context for a canvas, so without this they'd accumulate across remounts
    // (StrictMode double-mount, client navigations back to this page).
    const disposeGL = () => {
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }

    // Paint immediately with whatever font is available so the canvas never
    // depends on document.fonts.ready resolving (which can race the mount).
    let disposed = false
    renderText()
    draw()
    reveal()
    // Re-rasterise once the real webfont settles, so the texture isn't a
    // fallback face — guarded so it can't run after unmount (StrictMode remount).
    document.fonts.ready.then(() => {
      if (disposed) return
      renderText()
      draw()
    })

    // Static redraw observers — needed in every mode (including reduced motion),
    // so the canvas re-rasterises on resize / orientation and repaints on a
    // theme toggle instead of showing a stale frame.
    const ro = new ResizeObserver(() => {
      renderText()
      draw()
    })
    ro.observe(root)

    const mo = new MutationObserver(() => {
      refreshColors()
      draw()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    if (reduce) {
      // No cursor-driven animation loop, but keep resize/theme redraws live.
      return () => {
        disposed = true
        ro.disconnect()
        mo.disconnect()
        disposeGL()
      }
    }

    let raf = 0
    let running = true
    let last = performance.now()

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const rect = root.getBoundingClientRect()
      tx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      ty = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height)) // y-up
      targetIntensity = 1
    }
    const onLeave = () => { targetIntensity = coarse ? 1 : 0 }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now

      if (coarse) {
        const s = now / 1000
        tx = 0.5 + Math.sin(s * 0.5) * 0.26
        ty = 0.5 + Math.sin(s * 0.85 + 1.1) * 0.17
      }

      // Lag the lens behind the pointer for inertia; derive velocity for the tail.
      const k = 1 - Math.exp(-7 * dt)
      mx += (tx - mx) * k
      my += (ty - my) * k
      const iv = 1 - Math.exp(-14 * dt)
      velX += ((mx - pmx) - velX) * iv
      velY += ((my - pmy) - velY) * iv
      pmx = mx
      pmy = my
      intensity += (targetIntensity - intensity) * (1 - Math.exp(-6 * dt))

      draw()
      reveal()
      raf = running ? requestAnimationFrame(loop) : 0
    }

    if (!coarse) {
      window.addEventListener("pointermove", onMove, { passive: true })
      document.addEventListener("pointerleave", onLeave)
      window.addEventListener("blur", onLeave)
    }

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

    raf = requestAnimationFrame(loop)

    return () => {
      disposed = true
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      disposeGL()
    }
  }, [])

  return (
    <main
      ref={rootRef}
      className="clens relative min-h-[100svh] overflow-hidden bg-[#ebeae7] text-[#171717] dark:bg-[#0e0e0e] dark:text-[#f4f4f4]"
    >
      {/* Fallback + SEO: the real, centred headline. Sits under the canvas, so
          it shows whenever WebGL / JS is unavailable. (No `clens` class here —
          it would override Tailwind's `absolute` with position:relative.) */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center px-5 text-center">
        <h1 className="clens__type">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white/70 px-3 py-1.5 text-[12px] font-medium text-black/70 backdrop-blur-md transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1e6b]/50 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/70 dark:hover:text-white"
          >
            <IconArrowLeft size={14} stroke={2} />
            Showcase
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60 backdrop-blur-md dark:border-white/15 dark:bg-white/[0.06] dark:text-white/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#ff1e6b" }} />
            Kinetic type · Chromatic lens
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 px-5 pb-10 md:flex-row md:items-end md:justify-between md:px-8 md:pb-12">
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-black/70 dark:text-white/75 md:text-[17px]">
            Seven years shipping payments, platforms, and AI commerce, from the
            first demo to the CPO&apos;s Money20/20 stage.
          </p>
          <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45 dark:text-white/50">
            Move your cursor
          </p>
        </div>
      </div>
    </main>
  )
}
