"use client"

import { useEffect, useRef, useState } from "react"
import { IconArrowDown } from "@tabler/icons-react"

const VERTEX_SHADER = `
precision mediump float;

attribute vec3 aPosition;

uniform float uAspect;
uniform float uCursorActive;
uniform float uCursorVelocity;
uniform float uLayer;
uniform float uLayerOpacity;
uniform float uLayerScale;
uniform float uProgress;
uniform float uTime;
uniform vec2 uCursor;
uniform vec2 uOffset;

varying float vEnergy;
varying float vDepth;
varying float vCursorGlow;

mat3 rotateX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}

mat3 rotateY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, s,
    0.0, 1.0, 0.0,
    -s, 0.0, c
  );
}

void main() {
  vec3 p = aPosition;
  float ribbonMix = smoothstep(0.06, 0.28, uProgress) * (1.0 - smoothstep(0.44, 0.58, uProgress));
  float curtainMix = smoothstep(0.25, 0.48, uProgress) * (1.0 - smoothstep(0.64, 0.76, uProgress));
  float gridMix = smoothstep(0.50, 0.72, uProgress) * (1.0 - smoothstep(0.82, 0.94, uProgress));
  float collapseMix = smoothstep(0.74, 0.98, uProgress);
  float pulse = sin(uProgress * 3.14159265);
  float layerOffset = uLayer * 0.42;

  float waveA = sin(p.x * (7.0 + layerOffset) + p.y * 4.0 + uTime * (1.2 - uLayer * 0.2));
  float waveB = sin((p.x - p.y) * (8.5 - uLayer * 0.55) - uTime * (0.9 + uLayer * 0.12));
  float waveC = cos((p.x + p.z) * 6.0 + uTime * (0.75 + uLayer * 0.18));
  float energy = (waveA + waveB + waveC) / 3.0;

  vec3 ribbon = vec3(
    aPosition.x * (3.2 + uLayer * 0.42),
    aPosition.y * 0.42 + energy * (0.18 + uLayer * 0.05),
    aPosition.z * 0.22
  );
  vec3 curtain = vec3(
    aPosition.x * 2.35,
    aPosition.y * 1.42 + sin(aPosition.x * 7.0 + uTime * 1.15) * 0.22 + energy * 0.18,
    sin(aPosition.x * 3.2 + aPosition.y * 4.4 + uTime * 0.55) * (0.38 + uLayer * 0.12)
  );
  // Wide lattice that still carries depth (z), so it never reads as paper.
  vec3 grid = vec3(
    aPosition.x * 2.7,
    aPosition.y * 1.3 + energy * 0.1,
    aPosition.z * 0.9
  );
  // Settled oblate spheroid: wide and calm, but keeps real height and depth
  // so it stays volumetric and never goes thin edge-on while rotating.
  vec3 collapsed = vec3(
    aPosition.x * (2.4 + uLayer * 0.3),
    aPosition.y * 0.72 + energy * 0.14,
    aPosition.z * 1.05
  );

  p = mix(p, ribbon, ribbonMix);
  p = mix(p, curtain, curtainMix);
  p = mix(p, grid, gridMix);
  p = mix(p, collapsed, collapseMix);
  p += normalize(aPosition) * energy * (0.035 + pulse * 0.085) * (1.0 - collapseMix * 0.62);
  p *= (1.15 + pulse * 0.16) * uLayerScale;
  p = rotateY(uTime * (0.14 - uLayer * 0.035) + ribbonMix * 0.8 + curtainMix * 0.25 - gridMix * 0.34 + uLayer * 0.18) * rotateX(-0.28 + ribbonMix * 0.24 + curtainMix * 0.44 - gridMix * 0.22 - uLayer * 0.08) * p;

  float cameraZ = 4.2;
  float perspective = 2.18 / (cameraZ - p.z);
  vec2 screen = vec2((p.x * perspective) / uAspect, p.y * perspective) + uOffset;
  // ── Cursor: repel the field, parting a soft round pocket around the pointer.
  // Presence-based (uCursorActive), so it reacts on hover, not only fast moves.
  vec2 fromCursor = screen - uCursor;
  float dist = length(fromCursor * vec2(uAspect, 1.0));
  float radius = 0.62 + uLayer * 0.1;
  float field = smoothstep(radius, 0.0, dist) * uCursorActive;
  float velocityBoost = clamp(uCursorVelocity * 4.5, 0.0, 1.0);
  vec2 dir = fromCursor / max(length(fromCursor), 0.0008);
  // Push outward, strongest near the cursor, so lines bend away and clear a pocket.
  float push = field * field * (0.16 + uLayer * 0.04) * (1.0 + velocityBoost * 0.6);
  screen += dir * push;
  // Lift the parted lines toward the viewer so the rim catches light.
  p.z += field * (0.42 + uLayer * 0.16);
  gl_Position = vec4(screen, 0.0, 1.0);

  vEnergy = energy * 0.5 + 0.5;
  vDepth = smoothstep(-1.6, 1.6, p.z);
  // Lines piling at the pocket edge glow brightest; the center opens up.
  vCursorGlow = field * (0.55 + 0.45 * field) + velocityBoost * field * 0.35;
}
`

const FRAGMENT_SHADER = `
precision mediump float;

uniform float uLayer;
uniform float uLayerOpacity;
uniform float uProgress;
varying float vEnergy;
varying float vDepth;
varying float vCursorGlow;

// Smooth cyclic palette (Inigo Quilez cosine form) — sweeps the full hue
// circle, so a single phase value reads as many colours.
vec3 palette(float t) {
  vec3 a = vec3(0.50, 0.50, 0.50);
  vec3 b = vec3(0.50, 0.50, 0.50);
  vec3 c = vec3(1.00, 1.00, 1.00);
  vec3 d = vec3(0.00, 0.33, 0.67);
  return a + b * cos(6.28318530718 * (c * t + d));
}

void main() {
  // Spread the hue across the mesh by energy, depth and layer (plus a slow
  // scroll drift) so the field reads multi-colour rather than one emerald wash.
  float hue = vEnergy * 0.58 + vDepth * 0.34 + uLayer * 0.20 + uProgress * 0.22;
  vec3 color = palette(hue);
  // Keep saturation lively but lift the mid-tones so lines stay luminous.
  color = mix(color, vec3(0.92, 1.0, 0.97), vDepth * 0.18);
  // Bright emerald rim where the lines part around the cursor.
  color = mix(color, vec3(0.50, 1.0, 0.78), clamp(vCursorGlow, 0.0, 1.0));
  float collapseGlow = smoothstep(0.75, 1.0, uProgress);
  float alpha = (0.21 + vEnergy * 0.36 + uProgress * 0.08 + collapseGlow * 0.16 + vCursorGlow * 0.5) * uLayerOpacity;
  gl_FragColor = vec4(color, alpha);
}
`

const STAGES = [
  {
    title: "Sphere",
    text: "The line mesh opens as a slow-turning sphere, set far enough back to sit behind the page rather than on it.",
  },
  {
    title: "Stretched ribbon",
    text: "Scroll tension pulls the sphere wide into a ribbon. The cursor adds rotational energy where it passes, not a shove to the whole mesh.",
  },
  {
    title: "Wave curtain",
    text: "The surface lifts into a curtain of running waves. The back layer drifts slower than the front, so the field keeps its depth.",
  },
  {
    title: "Wide lattice",
    text: "The curtain opens into a wide lattice that keeps its depth as it turns, weighted to one side of the frame.",
  },
  {
    title: "Settled orbit",
    text: "It eases into a slow, three-dimensional drift. Fast pointer movement blooms mint heat across the lines before they settle.",
  },
]

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("Unable to create shader")

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader compile error"
    gl.deleteShader(shader)
    throw new Error(info)
  }

  return shader
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
  const program = gl.createProgram()
  if (!program) throw new Error("Unable to create WebGL program")

  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)

  gl.deleteShader(vertex)
  gl.deleteShader(fragment)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown program link error"
    gl.deleteProgram(program)
    throw new Error(info)
  }

  return program
}

function spherePoint(theta: number, phi: number) {
  const cosTheta = Math.cos(theta)
  return [
    cosTheta * Math.cos(phi),
    Math.sin(theta),
    cosTheta * Math.sin(phi),
  ]
}

function pushPoint(target: number[], point: number[]) {
  target.push(point[0], point[1], point[2])
}

function buildSphereLineMesh(latSegments = 78, lonSegments = 136) {
  const vertices: number[] = []
  const pi = Math.PI
  const tau = Math.PI * 2

  for (let lat = 1; lat < latSegments; lat++) {
    const theta = -pi / 2 + (lat / latSegments) * pi

    for (let lon = 0; lon < lonSegments; lon++) {
      const phi0 = (lon / lonSegments) * tau
      const phi1 = ((lon + 1) / lonSegments) * tau
      pushPoint(vertices, spherePoint(theta, phi0))
      pushPoint(vertices, spherePoint(theta, phi1))
    }
  }

  for (let lon = 0; lon < lonSegments; lon++) {
    const phi = (lon / lonSegments) * tau

    for (let lat = 0; lat < latSegments; lat++) {
      const theta0 = -pi / 2 + (lat / latSegments) * pi
      const theta1 = -pi / 2 + ((lat + 1) / latSegments) * pi
      pushPoint(vertices, spherePoint(theta0, phi))
      pushPoint(vertices, spherePoint(theta1, phi))
    }
  }

  return new Float32Array(vertices)
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}

export function WebglScrollShaderDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: false,
    })
    if (!gl) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const program = createProgram(gl)
    const vertices = buildSphereLineMesh(80, 140)
    const buffer = gl.createBuffer()
    if (!buffer) return

    const positionLocation = gl.getAttribLocation(program, "aPosition")
    const cursorLocation = gl.getUniformLocation(program, "uCursor")
    const cursorActiveLocation = gl.getUniformLocation(program, "uCursorActive")
    const cursorVelocityLocation = gl.getUniformLocation(program, "uCursorVelocity")
    const layerLocation = gl.getUniformLocation(program, "uLayer")
    const layerOpacityLocation = gl.getUniformLocation(program, "uLayerOpacity")
    const layerScaleLocation = gl.getUniformLocation(program, "uLayerScale")
    const progressLocation = gl.getUniformLocation(program, "uProgress")
    const timeLocation = gl.getUniformLocation(program, "uTime")
    const aspectLocation = gl.getUniformLocation(program, "uAspect")
    const offsetLocation = gl.getUniformLocation(program, "uOffset")

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.disable(gl.DEPTH_TEST)

    let width = 0
    let height = 0
    let dpr = 1
    let raf = 0
    let currentProgress = 0
    let targetProgress = 0
    let currentCursorX = 0
    let currentCursorY = 0
    let targetCursorX = 0
    let targetCursorY = 0
    let previousCursorX = 0
    let previousCursorY = 0
    let currentCursorActive = 0
    let targetCursorActive = 0
    let targetCursorVelocity = 0
    let currentCursorVelocity = 0
    let hasCursorPosition = false
    let frameTime = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const updateProgress = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = Math.max(1, rect.height - window.innerHeight)
      targetProgress = clamp(-rect.top / scrollable)
    }

    const updateCursor = (event: PointerEvent) => {
      if (event.pointerType === "touch") return

      const rect = canvas.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
      targetCursorX = x
      targetCursorY = y
      const velocity = hasCursorPosition ? Math.hypot(x - previousCursorX, y - previousCursorY) : 0
      targetCursorVelocity = clamp(velocity * 10, 0, 1)
      previousCursorX = x
      previousCursorY = y
      hasCursorPosition = true
      targetCursorActive = 1
    }

    const clearCursor = () => {
      targetCursorActive = 0
      targetCursorVelocity = 0
      hasCursorPosition = false
    }

    const drawLayer = ({
      layer,
      opacity,
      scale,
      timeScale,
    }: {
      layer: number
      opacity: number
      scale: number
      timeScale: number
    }) => {
      gl.uniform1f(progressLocation, currentProgress)
      gl.uniform1f(timeLocation, reduceMotion ? 0 : frameTime * 0.001 * timeScale)
      gl.uniform1f(aspectLocation, width / height)
      gl.uniform2f(cursorLocation, currentCursorX, currentCursorY)
      gl.uniform1f(cursorActiveLocation, reduceMotion ? 0 : currentCursorActive)
      gl.uniform1f(cursorVelocityLocation, reduceMotion ? 0 : currentCursorVelocity)
      gl.uniform1f(layerLocation, layer)
      gl.uniform1f(layerOpacityLocation, opacity)
      gl.uniform1f(layerScaleLocation, scale)
      const desktopOffset = width >= 1024
      const tabletOffset = width >= 720 && width < 1024
      const offsetX = desktopOffset ? 0.23 : tabletOffset ? 0.12 : 0
      const offsetY = desktopOffset ? -0.02 : tabletOffset ? -0.04 : -0.08
      gl.uniform2f(offsetLocation, offsetX + layer * 0.055, offsetY + layer * 0.035)
      gl.drawArrays(gl.LINES, 0, vertices.length / 3)
    }

    const draw = (time: number) => {
      frameTime = time
      updateProgress()
      currentProgress = reduceMotion
        ? targetProgress
        : currentProgress + (targetProgress - currentProgress) * 0.075
      currentCursorX += (targetCursorX - currentCursorX) * 0.12
      currentCursorY += (targetCursorY - currentCursorY) * 0.12
      currentCursorActive += (targetCursorActive - currentCursorActive) * 0.14
      currentCursorVelocity += (targetCursorVelocity - currentCursorVelocity) * 0.16
      targetCursorVelocity *= 0.86

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
      drawLayer({ layer: 1, opacity: 0.34, scale: 1.22, timeScale: 0.68 })
      drawLayer({ layer: 0, opacity: 0.94, scale: 1, timeScale: 1 })

      raf = requestAnimationFrame(draw)
    }

    let running = false
    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    // Only run the render loop while the section is on screen.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
    )
    visibilityObserver.observe(section)
    window.addEventListener("pointermove", updateCursor, { passive: true })
    window.addEventListener("pointerleave", clearCursor)
    window.addEventListener("blur", clearCursor)
    resize()
    updateProgress()
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      window.removeEventListener("pointermove", updateCursor)
      window.removeEventListener("pointerleave", clearCursor)
      window.removeEventListener("blur", clearCursor)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  // Track which stage caption is centered, to drive the progress rail.
  useEffect(() => {
    const blocks = stageRefs.current.filter(Boolean) as HTMLDivElement[]
    if (blocks.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number(entry.target.getAttribute("data-stage"))
          if (!Number.isNaN(index)) setActiveStage(index)
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    )

    blocks.forEach((block) => observer.observe(block))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[530vh] overflow-clip bg-neutral-950 text-white"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_66%_38%,rgba(16,185,129,0.16),transparent_43%),linear-gradient(180deg,rgba(10,10,10,0.32),rgba(10,10,10,0.96))]"
        />
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,transparent_42%,rgba(10,10,10,0.86)_84%)]"
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-5 pb-8 pt-28 md:px-6 md:pt-32">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/75 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              Hand-written GLSL, no libraries
            </div>
            <h1 className="text-balance text-5xl font-bold leading-[0.96] tracking-normal md:text-7xl">
              Five states from one shader field.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/70 md:text-base">
              Scroll drives the mesh through five forms. Pointer speed adds local
              swirl and heat where the cursor passes, so the field reacts to you
              without a 3D library doing the work.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-white/65">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.06]">
              <IconArrowDown size={16} strokeWidth={1.9} aria-hidden="true" />
            </span>
            Scroll to transform the mesh
          </div>
        </div>

        {/* Progress rail: the five stages as one sequence, active step lit. */}
        <ol
          aria-hidden
          className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 md:right-8 md:flex"
        >
          {STAGES.map((stage, index) => {
            const active = index === activeStage
            return (
              <li key={stage.title} className="flex items-center justify-end gap-3">
                <span
                  className={[
                    "text-right text-[13px] font-medium tabular-nums transition-colors duration-500",
                    active ? "text-white" : "text-white/35",
                  ].join(" ")}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={[
                    "h-px transition-all duration-500",
                    active ? "w-8 bg-emerald-400" : "w-4 bg-white/25",
                  ].join(" ")}
                />
              </li>
            )
          })}
        </ol>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        {STAGES.map((stage, index) => (
          <div
            key={stage.title}
            ref={(node) => {
              stageRefs.current[index] = node
            }}
            data-stage={index}
            className="mx-auto flex h-screen max-w-6xl items-end px-5 pb-20 md:px-6 md:pb-24"
          >
            <div
              className={[
                "max-w-sm rounded-2xl border border-white/12 bg-neutral-950/55 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl",
                index % 2 === 1 ? "ml-auto" : "",
              ].join(" ")}
            >
              <span className="block text-sm font-semibold tabular-nums text-emerald-400">
                {String(index + 1).padStart(2, "0")} / 05
              </span>
              <h2 className="mt-2 text-xl font-semibold leading-tight text-white">
                {stage.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">{stage.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
