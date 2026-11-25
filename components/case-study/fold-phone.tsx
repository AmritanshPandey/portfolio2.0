"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { floatGeometry, loadDevice, loadDeviceKit, warmDeviceKit } from "@/lib/device-model"
import { studioLight } from "@/lib/studio-light"
import { warmScene } from "@/lib/warm-scene"

/**
 * A foldable phone showing two product screens: folded, the cover shows the
 * right half of the image; open, the inner screen shows all of it (two
 * screens side by side). `drive` says how far open it is, e.g. from the
 * page's scroll (device-scene.tsx); it has no controls of its own.
 *
 * The fold, the projected screen UI and the progressive blur are adapted from
 * jadon7/iphone-duo (main.js), MIT License, Copyright (c) 2026 jadon7. The
 * phone is Apple's iPhone Duo reference model, prepared once by
 * scripts/prepare-iphone-duo.py and scripts/compact-devices.mjs into
 * public/devices; it belongs to Apple and is shown as a reference device.
 *
 * Heavy by nature (Three.js plus a 1.6 MB model), so the model loads only as
 * the viewer is about to scroll into view (the code, once the page is idle); until then, and wherever WebGL or the
 * model is unavailable, the still screens stand in. It draws only while the
 * phone moves.
 */

// The image the screens show: 1600 x 1125, two portrait screens side by side.
const UI_W = 1600
const UI_H = 1125
// Model geometry constants from the reference model (inner and outer screen
// frames in the unfolded front view, the hinge line, the reference eye).
const HINGE_Z = 0.275454
const INNER_SCREEN_Z = 0.24948
const LIFT = -5.8974
const MOVING_HALF = "upTUAKvMVkPOMKq"
const FIXED_HALF = "SiftyleUEEZwLhF"
const FLEXIBLE = ["JnJdTkxbQgUtLwU", "xdyyaajWsatVNxN", "UXtsBZYlaUvHoEh", "MvKPXGSdYDVvSpk"]
const INNER_MESH = "UXtsBZYlaUvHoEh"
const OUTER_MESH = "hhgAIoCGsHXeDPY"

/** How briskly a device follows the scroll (per second). */
export const FOLLOW = 14

/** An outside driver for the fold, e.g. page scroll: 0 is closed, 1 open. */
export type FoldDrive = { get: () => number; listen: (onChange: () => void) => () => void }

export function FoldPhone({
  screens,
  alt,
  modelUrl = "/devices/iphone-duo.glb",
  drive,
}: {
  screens: string
  alt: string
  modelUrl?: string
  /** How far open it is, followed with a little ease. */
  drive: FoldDrive
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle")

  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    if (!wrap || !stage) return
    let disposed = false
    let teardown: (() => void) | null = null

    const start = async () => {
      const probe = document.createElement("canvas")
      if (!probe.getContext("webgl2")) {
        setStatus("failed")
        return
      }
      const THREE = await loadDeviceKit()
      if (disposed) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 250)
      camera.position.set(0, 0, 40)
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.18
      renderer.domElement.setAttribute("aria-hidden", "true")
      renderer.domElement.style.display = "block"
      stage.appendChild(renderer.domElement)

      scene.environmentIntensity = 1.35
      scene.add(new THREE.HemisphereLight(0xffffff, 0xb5baa8, 1.8))
      const key = new THREE.DirectionalLight(0xfffcf5, 2.6)
      key.position.set(-15, 25, 30)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0xe8edf5, 2)
      rim.position.set(15, 5, -15)
      scene.add(rim)

      camera.lookAt(0, 0, HINGE_Z)

      const phone = new THREE.Group()
      scene.add(phone)
      const bend = { value: 0 }
      const eye = new THREE.Vector3(0, 0, 40)
      const innerFrame = new THREE.Vector4(-7.89935, 0.34562 + LIFT, 15.7987, 11.1035)

      // One image on both screens: the inner shows it whole, the outer its
      // right half, anchored to its hinge-side edge.
      const [texture, light] = await Promise.all([new THREE.TextureLoader().loadAsync(screens), studioLight(THREE, renderer)])
      scene.environment = light
      if (disposed) {
        texture.dispose()
        light.dispose()
        renderer.dispose()
        return
      }
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
      const pixel = new THREE.Vector2(1 / UI_W, 1 / UI_H)
      const screenUniforms = {
        inner: { frame: { value: innerFrame.clone() }, gradient: { value: new THREE.Vector2(0.5, 0) } },
        outer: { frame: { value: innerFrame.clone() }, gradient: { value: new THREE.Vector2(0.5, 1) } },
      }
      const screenMaterials = {
        inner: new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
        outer: new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
      }

      const screenShader = /* glsl */ `
        uniform float foldAngle;
        uniform vec2 uiPixel;
        uniform vec4 uiFrame;
        uniform vec2 uiGradient;
        uniform vec3 uiReferenceEye;
        varying vec3 vUIPosition;
        vec3 screenColor() {
          float depth = (${INNER_SCREEN_Z} - uiReferenceEye.z) / (vUIPosition.z - uiReferenceEye.z);
          vec2 projected = uiReferenceEye.xy + (vUIPosition.xy - uiReferenceEye.xy) * depth;
          vec2 sourceUV = (projected - uiFrame.xy) / uiFrame.zw;
          #ifdef INNER_UI
            float progress = clamp(foldAngle / 1.570796327, 0.0, 1.0);
          #else
            float c = cos(foldAngle), s = sin(foldAngle);
            vec2 hingeEdge = vec2(-0.23396, -0.27463 - ${HINGE_Z});
            vec2 foldedEdge = vec2(c * hingeEdge.x + s * hingeEdge.y, -s * hingeEdge.x + c * hingeEdge.y + ${HINGE_Z});
            float edgeDepth = (${INNER_SCREEN_Z} - uiReferenceEye.z) / (foldedEdge.y - uiReferenceEye.z);
            float anchorX = uiReferenceEye.x + (foldedEdge.x - uiReferenceEye.x) * edgeDepth;
            sourceUV.x = uiGradient.x + (projected.x - anchorX) / uiFrame.z;
            float progress = clamp((3.141592654 - foldAngle) / 1.570796327, 0.0, 1.0);
          #endif
          float edge = (sourceUV.x - uiGradient.x) / (uiGradient.y - uiGradient.x);
          float motion = smoothstep(0.0, 1.0, progress);
          float blurGradient = clamp(edge, 0.0, 1.0);
          float darkenGradient = clamp((edge - 0.2) / 0.8, 0.0, 1.0);
          float effect = motion * pow(darkenGradient, 1.35);
          float radius = 72.0 * motion * pow(blurGradient, 1.35);
          vec2 aa = max(fwidth(sourceUV), uiPixel * 0.5);
          vec2 dx = dFdx(sourceUV) / uiPixel;
          vec2 dy = dFdy(sourceUV) / uiPixel;
          float baseLod = log2(max(1.0, max(length(dx), length(dy))));
          vec2 coverage = smoothstep(-aa, aa, sourceUV) * (1.0 - smoothstep(vec2(1.0) - aa, vec2(1.0) + aa, sourceUV));
          vec3 color = textureLod(map, clamp(sourceUV, vec2(0.0), vec2(1.0)), baseLod).rgb * coverage.x * coverage.y;
          if (radius > 0.0) {
            float lod = max(baseLod, log2(max(1.0, radius)));
            vec2 footprint = max(aa, uiPixel * radius * 0.75);
            color = vec3(0.0);
            for (int y = -2; y <= 2; y++) {
              for (int x = -2; x <= 2; x++) {
                float wx = x == 0 ? 6.0 : (abs(x) == 1 ? 4.0 : 1.0);
                float wy = y == 0 ? 6.0 : (abs(y) == 1 ? 4.0 : 1.0);
                vec2 sampleUV = sourceUV + vec2(float(x), float(y)) * uiPixel * radius;
                vec2 cov = smoothstep(-footprint, footprint, sampleUV) * (1.0 - smoothstep(vec2(1.0) - footprint, vec2(1.0) + footprint, sampleUV));
                color += textureLod(map, clamp(sampleUV, vec2(0.0), vec2(1.0)), lod).rgb * cov.x * cov.y * wx * wy / 256.0;
              }
            }
          }
          return color * (1.0 - min(1.0, effect * 2.0));
        }
      `
      // The camera half holds still; only the cover half rotates about the hinge.
      const foldShader = /* glsl */ `
        uniform float foldAngle;
        vec2 rotateHinge(vec2 p) {
          float c = cos(foldAngle), s = sin(foldAngle);
          p.y -= ${HINGE_Z};
          return vec2(c * p.x + s * p.y, -s * p.x + c * p.y + ${HINGE_Z});
        }
        #ifdef FLEXIBLE_SCREEN
        vec4 bendStrip(vec3 p) {
          float halfWidth = 0.35;
          if (p.x >= halfWidth) return vec4(p.x, p.z, 1.0, 0.0);
          if (p.x <= -halfWidth) return vec4(rotateHinge(p.xz), cos(foldAngle), -sin(foldAngle));
          float t = (p.x + halfWidth) / (2.0 * halfWidth);
          float t2 = t*t, t3 = t2*t;
          vec2 a = rotateHinge(vec2(-halfWidth, p.z));
          vec2 b = vec2(halfWidth, p.z);
          vec2 ta = 2.0 * halfWidth * vec2(cos(foldAngle), -sin(foldAngle));
          vec2 tb = vec2(2.0 * halfWidth, 0.0);
          vec2 point = (2.0*t3-3.0*t2+1.0)*a + (t3-2.0*t2+t)*ta + (-2.0*t3+3.0*t2)*b + (t3-t2)*tb;
          vec2 tangent = normalize((6.0*t2-6.0*t)*a + (3.0*t2-4.0*t+1.0)*ta + (-6.0*t2+6.0*t)*b + (3.0*t2-2.0*t)*tb);
          return vec4(point, tangent);
        }
        #endif
      `

      let model: import("three").Group
      try {
        model = await loadDevice(THREE, modelUrl)
      } catch {
        if (!disposed) setStatus("failed")
        renderer.dispose()
        renderer.domElement.remove()
        return
      }
      if (disposed) {
        renderer.dispose()
        return
      }
      // Each step below runs in its own task, so a frame of page scroll can
      // land between them instead of waiting for one long setup.
      const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0))
      await nextTask()
      if (disposed) {
        renderer.dispose()
        return
      }
      model.scale.multiplyScalar(100)
      model.updateMatrixWorld(true)
      const owned: { dispose: () => void }[] = [texture, screenMaterials.inner, screenMaterials.outer]
      model.traverse((object) => {
        const mesh = object as import("three").Mesh
        if (!mesh.isMesh) return
        const geometry = floatGeometry(THREE, mesh.geometry).applyMatrix4(mesh.matrixWorld)
        geometry.translate(0, LIFT, 0)
        let ancestor: import("three").Object3D | null = mesh
        while (ancestor && ![MOVING_HALF, FIXED_HALF].includes(ancestor.name)) ancestor = ancestor.parent
        const moving = ancestor?.name === MOVING_HALF
        const flexible = FLEXIBLE.includes(mesh.name)
        const kind = mesh.name === INNER_MESH ? "inner" : mesh.name === OUTER_MESH ? "outer" : null
        const source = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
        const material = kind ? screenMaterials[kind] : source.clone()
        if (kind) {
          // Screen UVs follow the unfolded front view of each screen.
          const p = geometry.attributes.position
          const uv = new Float32Array(p.count * 2)
          for (let i = 0; i < p.count; i++) {
            uv[i * 2] = kind === "inner" ? (p.getX(i) + 7.89935) / 15.7987 : (-0.23396 - p.getX(i)) / 7.73936
            uv[i * 2 + 1] =
              kind === "inner" ? (p.getY(i) - LIFT - 0.34562) / 11.1035 : (p.getY(i) - LIFT - 0.27173) / 11.2513
          }
          geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2))
        }
        if (moving || flexible) {
          material.onBeforeCompile = (shader) => {
            shader.uniforms.foldAngle = bend
            if (kind) {
              shader.uniforms.uiFrame = screenUniforms[kind].frame
              shader.uniforms.uiGradient = screenUniforms[kind].gradient
              shader.uniforms.uiReferenceEye = { value: eye }
              shader.uniforms.uiPixel = { value: pixel }
              shader.fragmentShader = shader.fragmentShader
                .replace(
                  "#include <map_pars_fragment>",
                  `#include <map_pars_fragment>\n${kind === "inner" ? "#define INNER_UI" : ""}\n${screenShader}`,
                )
                .replace("#include <map_fragment>", "diffuseColor.rgb *= screenColor();")
              shader.vertexShader = `varying vec3 vUIPosition;\n${shader.vertexShader}`.replace(
                "#include <project_vertex>",
                "vUIPosition = transformed;\n#include <project_vertex>",
              )
            }
            shader.vertexShader = `${flexible ? "#define FLEXIBLE_SCREEN\n" : ""}${foldShader}\n${shader.vertexShader}`
              .replace(
                "#include <begin_vertex>",
                flexible
                  ? "vec4 folded = bendStrip(position);\nvec3 transformed = vec3(folded.x, position.y, folded.y);"
                  : "vec2 folded = rotateHinge(position.xz);\nvec3 transformed = vec3(folded.x, position.y, folded.y);",
              )
              .replace(
                "#include <beginnormal_vertex>",
                `vec3 objectNormal = vec3(normal);
                ${flexible ? "vec4 strip = bendStrip(position); float a = atan(-strip.w, strip.z);" : "float a = foldAngle;"}
                objectNormal.x = cos(a) * normal.x + sin(a) * normal.z;
                objectNormal.z = -sin(a) * normal.x + cos(a) * normal.z;`,
              )
          }
          material.customProgramCacheKey = () => `${flexible ? "fold-flexible" : "fold-cover"}-${kind || "body"}`
        }
        const out = new THREE.Mesh(geometry, material)
        out.frustumCulled = false
        phone.add(out)
        owned.push(geometry)
        if (!kind) owned.push(material)
      })

      // Ready the first frame before showing it, so none of it lands as a
      // stall while the page is scrolling.
      const abort = () => {
        for (const item of owned) item.dispose()
        scene.environment?.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
      if (!(await warmScene(renderer, scene, camera, () => disposed))) return abort()

      // State, and drawing only while something moves.
      let current = 0
      let raf = 0
      let last = performance.now()
      let onScreen = true

      const applyAngle = (value: number) => {
        current = value
        bend.value = ((180 - value) / 180) * Math.PI
        // Folded, only the fixed half shows; ease it to the centre.
        phone.position.x = (-3.95 * (1 - Math.cos(bend.value))) / 2
        // The cover screen is off when the phone is fully open.
        screenMaterials.outer.color.setScalar(value >= 180 ? 0 : 1)
      }
      const resize = () => {
        const { width, height } = stage.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height)
        camera.aspect = width / height
        const pixelsPerUnit = Math.min(width / 17.2, height / 12.6, 60)
        camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(height / pixelsPerUnit / 2 / 40))
        camera.updateProjectionMatrix()
        kick()
      }
      const frame = (now: number) => {
        raf = 0
        const delta = Math.min((now - last) / 1000, 0.05)
        last = now
        const target = drive.get() * 180
        const next = current + (target - current) * (1 - Math.exp(-delta * FOLLOW))
        applyAngle(Math.abs(target - next) < 0.05 ? target : next)
        renderer.render(scene, camera)
        if (onScreen && current !== target) raf = requestAnimationFrame(frame)
      }
      const kick = () => {
        if (!raf && onScreen) {
          last = performance.now()
          raf = requestAnimationFrame(frame)
        }
      }
      const ro = new ResizeObserver(resize)
      ro.observe(stage)
      const visibility = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen) kick()
      })
      visibility.observe(stage)

      applyAngle(drive.get() * 180)
      const unlisten = drive.listen(kick)
      resize()
      setStatus("ready")

      teardown = () => {
        cancelAnimationFrame(raf)
        unlisten()
        ro.disconnect()
        visibility.disconnect()
        for (const item of owned) item.dispose()
        scene.environment?.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    // Start fetching only when the viewer is about to scroll into view.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        near.disconnect()
        void start()
      },
      { rootMargin: "600px 0px" },
    )
    near.observe(wrap)
    const unwarm = warmDeviceKit()
    return () => {
      disposed = true
      unwarm()
      near.disconnect()
      teardown?.()
    }
  }, [screens, modelUrl, drive])

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      {/* The still screens: shown until the phone is ready, and instead of it
          where WebGL or the model is unavailable. */}
      <div
        className={`absolute inset-[12%] transition-opacity duration-500 ${status === "ready" ? "opacity-0" : "opacity-100"}`}
        aria-hidden={status === "ready"}
      >
        <Image src={screens} alt={alt} fill sizes="(max-width: 768px) 76vw, 600px" className="object-contain" />
      </div>
      <div ref={stageRef} className="absolute inset-0" />
    </div>
  )
}
