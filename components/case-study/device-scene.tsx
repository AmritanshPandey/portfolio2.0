"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAmbientMode } from "@/hooks/use-ambient-still"
import { BLOCK, arrive, unfold } from "@/lib/device-motion"
import { loadDevice, loadDeviceKit, warmDeviceKit } from "@/lib/device-model"
import { MACBOOK_LID } from "@/lib/macbook-lid"
import { studioLight } from "@/lib/studio-light"
import { warmScene } from "@/lib/warm-scene"
import { FOLLOW, FoldPhone, type FoldDrive } from "./fold-phone"

/**
 * A device that brings its screen to the reader as the page scrolls: the
 * iPhone settles straight on, the MacBook opens and the view moves in to its
 * display, the iPhone Duo shows its cover screen and unfolds to the large
 * one. They share one timeline (lib/device-motion.ts): the screen is ready as
 * the block pins, then it holds still to be read. The scroll's progress
 * drives the device, eased so it never jumps.
 *
 * Apple's reference models live in public/devices (scripts/compact-devices.mjs).
 * Heavy, so only desktop pointers load them, and only as the block nears;
 * phones, iPads, low battery and reduced motion get the still screen,
 * unpinned. Scroll is read only while the block is on screen, against a
 * cached position, and the device draws only while it moves.
 */

type Kind = "macbook" | "iphone" | "duo"

const MODELS = {
  macbook: {
    url: "/devices/macbook-air-15-silver.glb",
    screen: "OQzaQDtbMVhhlAr",
    lid: "mlBJTkeLRJEGJYh",
    base: "PvXyCWMztHOhGyi",
  },
  iphone: {
    url: "/devices/iphone-18-pro.glb",
    screen: "oGFItxWqzAveXtT",
    keep: "pHYCsZfzCytMXko",
  },
} as const

/** The MacBook's turn while its lid is shut; it comes round as it opens. */
const SHUT_YAW = -0.3

/** How much of the stage a device fills. */
const FILL = 0.92

/** The iPhone's lean as it arrives: its screen is readable throughout. */
const LEAN = { yaw: -0.42, pitch: 0.1 }

/** How far `pose` (a moment on the shared timeline to 0..1) has got, from the
 *  block's scroll. Read only while the block is on screen, from a cached
 *  position. */
function useScrollDrive(block: React.RefObject<HTMLElement | null>, active: boolean, pose: (v: number) => number): FoldDrive {
  const progress = useRef(0)
  const listeners = useRef(new Set<() => void>())
  const drive = useMemo<FoldDrive>(
    () => ({
      get: () => progress.current,
      listen: (fn) => {
        listeners.current.add(fn)
        return () => listeners.current.delete(fn)
      },
    }),
    [],
  )

  useEffect(() => {
    const el = block.current
    if (!el || !active) return
    let pin = 0
    const measure = () => {
      const stuck = el.firstElementChild ? parseFloat(getComputedStyle(el.firstElementChild).top) || 0 : 0
      pin = el.getBoundingClientRect().top + scrollY - stuck
      read()
    }
    const read = () => {
      const p = pose((scrollY - pin) / innerHeight)
      if (p === progress.current) return
      progress.current = p
      listeners.current.forEach((fn) => fn())
    }
    const listen = (on: boolean) => {
      const m = on ? "addEventListener" : "removeEventListener"
      window[m]("scroll", read, { passive: true })
    }
    const io = new IntersectionObserver(([entry]) => {
      listen(entry.isIntersecting)
      if (entry.isIntersecting) measure()
    })
    io.observe(el)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener("resize", measure)
    return () => {
      io.disconnect()
      ro.disconnect()
      listen(false)
      window.removeEventListener("resize", measure)
    }
  }, [block, active, pose])

  return drive
}

/** The MacBook or the iPhone, drawn with three.js and driven by `drive`. */
function DeviceCanvas({ kind, screen, drive }: { kind: "macbook" | "iphone"; screen: string; drive: FoldDrive }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let disposed = false
    let teardown: (() => void) | null = null

    const start = async () => {
      if (!document.createElement("canvas").getContext("webgl2")) return
      const THREE = await loadDeviceKit()
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      renderer.domElement.setAttribute("aria-hidden", "true")
      renderer.domElement.style.display = "block"
      const scene = new THREE.Scene()
      scene.add(new THREE.HemisphereLight(0xffffff, 0xb5baa8, 1.4))
      const key = new THREE.DirectionalLight(0xfffcf5, 2.2)
      key.position.set(-0.3, 0.5, 0.6)
      scene.add(key)
      if (kind === "macbook") {
        // Straight on, the room blows out the thumb notch on the base's front
        // edge to a white bar: turn the room, and light from above.
        scene.environmentRotation.y = 2.4
        key.intensity = 1.2
        key.position.set(-0.4, 0.9, 0)
      }
      // A long lens on the laptop: its base stays no wider than its display, so
      // the display can fill the stage.
      const camera = new THREE.PerspectiveCamera(kind === "macbook" ? 9 : 26, 1, 0.05, 20)

      const spec = MODELS[kind]
      let model: import("three").Group
      let texture: import("three").Texture
      try {
        ;[model, texture, scene.environment] = await Promise.all([
          loadDevice(THREE, spec.url),
          new THREE.TextureLoader().loadAsync(screen),
          studioLight(THREE, renderer),
        ])
      } catch {
        renderer.dispose()
        return
      }
      if (disposed) {
        renderer.dispose()
        return
      }
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

      model.updateMatrixWorld(true)
      const body = "keep" in spec ? model.getObjectByName(spec.keep)! : model
      const box = new THREE.Box3().setFromObject(body)
      model.position.sub(box.getCenter(new THREE.Vector3()))
      const pivot = new THREE.Group()
      pivot.add(model)
      scene.add(pivot)
      scene.updateMatrixWorld(true)

      // The display shows the screen image as it is: no light, no reflections.
      model.traverse((o) => {
        const mesh = o as import("three").Mesh
        if (mesh.isMesh && mesh.name === spec.screen) mesh.material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
      })

      // The MacBook's lid turns on its hinge, inside the base (lib/macbook-lid).
      let hinge: import("three").Group | null = null
      if (kind === "macbook") {
        const lid = model.getObjectByName(MODELS.macbook.lid)!
        const lidBox = new THREE.Box3().setFromObject(lid)
        const baseTop = new THREE.Box3().setFromObject(model.getObjectByName(MODELS.macbook.base)!).max.y
        hinge = new THREE.Group()
        hinge.position.set(0, baseTop + MACBOOK_LID.axisY, lidBox.max.z + MACBOOK_LID.axisZ)
        pivot.add(hinge)
        scene.updateMatrixWorld(true)
        hinge.attach(lid)
      }

      // The device's outline in its settled pose: a few thousand of its points,
      // which the view is framed by.
      pivot.rotation.set(0, hinge ? 0 : Math.PI, 0)
      scene.updateMatrixWorld(true)
      const settled: import("three").Vector3[] = []
      const parts: import("three").Mesh[] = []
      pivot.traverse((o) => {
        if ((o as import("three").Mesh).isMesh) parts.push(o as import("three").Mesh)
      })
      const every = Math.max(1, Math.ceil(parts.reduce((n, m) => n + m.geometry.attributes.position.count, 0) / 3000))
      const outline = (into: import("three").Vector3[]) => {
        scene.updateMatrixWorld(true)
        for (const mesh of parts) {
          const at = mesh.geometry.attributes.position
          for (let i = 0; i < at.count; i += every) into.push(new THREE.Vector3().fromBufferAttribute(at, i).applyMatrix4(mesh.matrixWorld))
        }
      }
      outline(settled)
      // The shut MacBook, turned, reaches further left than the open one: the
      // first view frames both, so no corner leaves the stage.
      const start = [...settled]
      if (hinge) {
        hinge.rotation.x = MACBOOK_LID.shut
        pivot.rotation.y = SHUT_YAW
        outline(start)
        hinge.rotation.x = 0
        pivot.rotation.y = 0
        scene.updateMatrixWorld(true)
      }

      if (!(await warmScene(renderer, scene, camera, () => disposed))) {
        renderer.dispose()
        return
      }
      stage.appendChild(renderer.domElement)

      // Where the view starts (the whole device) and ends (in on its screen).
      const from = { eye: new THREE.Vector3(), at: new THREE.Vector3() }
      const to = { eye: new THREE.Vector3(), at: new THREE.Vector3() }
      const at = new THREE.Vector3()
      const pose = (e: number) => {
        if (hinge) {
          hinge.rotation.x = (1 - e) * MACBOOK_LID.shut
          pivot.rotation.y = (1 - e) * SHUT_YAW
        } else {
          pivot.rotation.set((1 - e) * LEAN.pitch, Math.PI + (1 - e) * LEAN.yaw, 0)
        }
        camera.position.lerpVectors(from.eye, to.eye, e)
        camera.lookAt(at.lerpVectors(from.at, to.at, e))
      }
      const fit = () => {
        const { width, height } = stage.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * FILL
        /** Stand `up` radians above straight on, as near as keeps every
         *  point in view, with the device centred top to bottom. */
        const stand = (view: typeof to, points: import("three").Vector3[], up: number) => {
          const ahead = new THREE.Vector3(0, Math.sin(up), Math.cos(up))
          const above = new THREE.Vector3(0, Math.cos(up), -Math.sin(up))
          let lift = 0
          let away = 0
          for (let i = 0; i < 4; i++) {
            away = 0
            for (const p of points) {
              const reach = Math.max(Math.abs(p.x) / camera.aspect, Math.abs(p.dot(above) - lift))
              away = Math.max(away, p.dot(ahead) + reach / half)
            }
            const heights = points.map((p) => (p.dot(above) - lift) / (away - p.dot(ahead)))
            lift += ((Math.max(...heights) + Math.min(...heights)) / 2) * away
          }
          view.at.copy(above).multiplyScalar(lift)
          view.eye.copy(ahead).multiplyScalar(away).add(view.at)
        }
        // The laptop is seen from above as it opens, then from just over its
        // keyboard, where the display is all but square on and at its largest.
        stand(to, settled, hinge ? 0.13 : 0)
        stand(from, start, hinge ? 0.42 : 0)
        kick()
      }

      let shown = drive.get()
      let raf = 0
      let last = performance.now()
      const frame = (t: number) => {
        raf = 0
        const dt = Math.min((t - last) / 1000, 0.05)
        last = t
        const target = drive.get()
        shown += (target - shown) * (1 - Math.exp(-dt * FOLLOW))
        if (Math.abs(target - shown) < 0.0005) shown = target
        pose(shown)
        renderer.render(scene, camera)
        if (shown !== target) raf = requestAnimationFrame(frame)
      }
      const kick = () => {
        if (!raf) {
          last = performance.now()
          raf = requestAnimationFrame(frame)
        }
      }

      const unlisten = drive.listen(kick)
      const ro = new ResizeObserver(fit)
      ro.observe(stage)
      fit()
      setReady(true)

      teardown = () => {
        cancelAnimationFrame(raf)
        unlisten()
        ro.disconnect()
        texture.dispose()
        scene.environment?.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    // Fetch only as the scene nears.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        near.disconnect()
        void start()
      },
      { rootMargin: "800px 0px" },
    )
    near.observe(stage)
    const unwarm = warmDeviceKit()
    return () => {
      disposed = true
      unwarm()
      near.disconnect()
      teardown?.()
    }
  }, [kind, screen, drive])

  return <div ref={stageRef} data-ready={ready || undefined} aria-hidden className="absolute inset-0" />
}

export function DeviceScene({ kind, screen, alt }: { kind: Kind; screen: string; alt: string }) {
  const mode = useAmbientMode("desktop")
  const live = mode === "live"
  const blockRef = useRef<HTMLDivElement>(null)
  const drive = useScrollDrive(blockRef, live, kind === "duo" ? unfold : arrive)

  if (!live) {
    // Still: the screen alone, framed, in the flow of the page, as large as
    // its shape allows.
    const shape = kind === "iphone" ? "aspect-[3/4] sm:aspect-[4/3]" : "aspect-[16/11]"
    return (
      <div className={`relative mx-auto w-full max-w-3xl overflow-hidden rounded-[4px] bg-card ring-1 ring-foreground/[0.08] ${shape}`}>
        <Image src={screen} alt={alt} fill sizes="(max-width: 768px) 92vw, 768px" className="object-contain p-3 sm:p-5" />
      </div>
    )
  }

  return (
    <div ref={blockRef} style={{ height: `${BLOCK * 100}svh` }} className="relative">
      {/* Clear of the study bar at the foot of the screen and, below xl, of
          the chapter strip under the nav. */}
      <div className="sticky top-[calc(var(--nav-h)+2.25rem)] h-[calc(100svh-var(--nav-h)-5rem)] xl:top-[var(--nav-h)] xl:h-[calc(100svh-var(--nav-h)-2.75rem)]">
        <p className="sr-only">{alt}</p>
        {kind === "duo" ? (
          <div className="flex h-full items-center">
            <FoldPhone screens={screen} alt={alt} drive={drive} />
          </div>
        ) : (
          <DeviceCanvas kind={kind} screen={screen} drive={drive} />
        )}
      </div>
    </div>
  )
}
