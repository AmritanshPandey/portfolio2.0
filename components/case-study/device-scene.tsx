"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAmbientMode } from "@/hooks/use-ambient-still"
import { warmScene } from "@/lib/warm-scene"
import { FoldPhone, type FoldDrive } from "./fold-phone"

/**
 * A device that animates with the page's scroll: the MacBook's lid opens,
 * the iPhone turns from its back to its screen, the iPhone Duo unfolds.
 * The scene is a tall block whose stage stays pinned while the reader
 * scrolls through it; the scroll's progress through the block drives the
 * device, eased so it never jumps.
 *
 * Apple's reference models live in public/devices (scripts/prepare-usdz.py).
 * Heavy, so only desktop pointers load them, and only as the block nears;
 * phones, iPads, low battery and reduced motion get the still screen,
 * unpinned. Scroll is read only while the block is on screen, against a
 * cached position, and the device draws only while it moves.
 */

type Kind = "macbook" | "iphone" | "duo"

const MODELS = {
  macbook: {
    url: "/devices/macbook-air-15-silver.usdz",
    screen: "OQzaQDtbMVhhlAr",
    lid: "mlBJTkeLRJEGJYh",
    base: "PvXyCWMztHOhGyi",
  },
  iphone: {
    url: "/devices/iphone-18-pro.usdz",
    screen: "oGFItxWqzAveXtT",
    keep: "pHYCsZfzCytMXko",
    drop: "zZWDMeVSzXXBycE",
  },
} as const

// The MacBook's lid, measured from its open pose: shut is about 111° forward.
const LID_SHUT = 1.94

const smooth = (t: number) => t * t * (3 - 2 * t)

/** Scroll progress through the block (0 at its top, 1 at its foot), read
 *  only while it is on screen, from a cached position. */
function useScrollDrive(block: React.RefObject<HTMLElement | null>, active: boolean): FoldDrive {
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
    let top = 0
    let span = 1
    const measure = () => {
      top = el.getBoundingClientRect().top + scrollY
      span = Math.max(1, el.offsetHeight - innerHeight)
      read()
    }
    const read = () => {
      const p = Math.min(1, Math.max(0, (scrollY - top) / span))
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
  }, [block, active])

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
      const [THREE, { USDLoader }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/USDLoader.js"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ])
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      renderer.domElement.setAttribute("aria-hidden", "true")
      renderer.domElement.style.display = "block"
      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      const room = new RoomEnvironment()
      scene.environment = pmrem.fromScene(room, 0.04).texture
      room.dispose()
      pmrem.dispose()
      scene.add(new THREE.HemisphereLight(0xffffff, 0xb5baa8, 1.4))
      const key = new THREE.DirectionalLight(0xfffcf5, 2.2)
      key.position.set(-0.3, 0.5, 0.6)
      scene.add(key)
      const camera = new THREE.PerspectiveCamera(26, 1, 0.01, 10)

      const spec = MODELS[kind]
      let model: import("three").Group
      let texture: import("three").Texture
      try {
        ;[model, texture] = await Promise.all([
          new USDLoader().loadAsync(spec.url) as Promise<import("three").Group>,
          new THREE.TextureLoader().loadAsync(screen),
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

      if ("drop" in spec) model.getObjectByName(spec.drop)?.removeFromParent()
      model.updateMatrixWorld(true)
      const body = "keep" in spec ? model.getObjectByName(spec.keep)! : model
      const box = new THREE.Box3().setFromObject(body)
      const size = box.getSize(new THREE.Vector3())
      model.position.sub(box.getCenter(new THREE.Vector3()))
      const pivot = new THREE.Group()
      pivot.add(model)
      scene.add(pivot)
      scene.updateMatrixWorld(true)

      // The display shows the screen image, lit by itself.
      model.traverse((o) => {
        const mesh = o as import("three").Mesh
        if (!mesh.isMesh || mesh.name !== spec.screen) return
        const material = (mesh.material as import("three").MeshStandardMaterial).clone()
        material.emissiveMap = texture
        material.emissive = new THREE.Color(0xffffff)
        material.emissiveIntensity = 1
        material.map = null
        material.color = new THREE.Color(0x000000)
        material.toneMapped = false
        mesh.material = material
      })

      // The MacBook's lid turns on its hinge: the back edge of the base, a
      // little above its top so the shut lid rests on it, not inside it.
      let hinge: import("three").Group | null = null
      if (kind === "macbook") {
        const lid = model.getObjectByName(MODELS.macbook.lid)!
        const lidBox = new THREE.Box3().setFromObject(lid)
        const baseTop = new THREE.Box3().setFromObject(model.getObjectByName(MODELS.macbook.base)!).max.y
        hinge = new THREE.Group()
        hinge.position.set(0, baseTop + 0.0025, lidBox.max.z)
        pivot.add(hinge)
        scene.updateMatrixWorld(true)
        hinge.attach(lid)
      }

      if (!(await warmScene(renderer, scene, camera, () => disposed))) {
        renderer.dispose()
        return
      }
      stage.appendChild(renderer.domElement)

      const fit = () => {
        const { width, height } = stage.getBoundingClientRect()
        if (!width || !height) return
        renderer.setSize(width, height)
        camera.aspect = width / height
        // Frame the device's larger side with a little air around it.
        const reach = kind === "macbook" ? Math.max(size.x / camera.aspect, size.y * 1.6) : size.y
        camera.position.set(0, kind === "macbook" ? size.y * 0.7 : 0, (reach / 0.86 / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))
        camera.lookAt(0, kind === "macbook" ? -size.y * 0.1 : 0, 0)
        camera.updateProjectionMatrix()
        kick()
      }

      let shown = drive.get()
      let raf = 0
      let last = performance.now()
      const pose = (p: number) => {
        const e = smooth(p)
        if (hinge) {
          hinge.rotation.x = (1 - e) * LID_SHUT
          pivot.rotation.y = (1 - e) * -0.5
        } else {
          // From its back (camera side out) round to its screen.
          pivot.rotation.y = e * Math.PI
          pivot.rotation.x = Math.sin(e * Math.PI) * 0.18
        }
      }
      const frame = (t: number) => {
        raf = 0
        const dt = Math.min((t - last) / 1000, 0.05)
        last = t
        const target = drive.get()
        shown += (target - shown) * (1 - Math.exp(-dt * 10))
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
      pose(shown)
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
    return () => {
      disposed = true
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
  const drive = useScrollDrive(blockRef, live)

  if (!live) {
    // Still: the screen alone, framed, in the flow of the page.
    return (
      <div className="relative mx-auto aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-[4px] bg-card ring-1 ring-foreground/[0.08]">
        <Image src={screen} alt={alt} fill sizes="(max-width: 768px) 92vw, 768px" className="object-contain p-6" />
      </div>
    )
  }

  return (
    <div ref={blockRef} className="relative h-[220vh]">
      <div className="sticky top-[var(--nav-h)] h-[calc(100svh-var(--nav-h))]">
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
