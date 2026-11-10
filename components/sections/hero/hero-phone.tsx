"use client"

import { useEffect, useRef, useState } from "react"
import { useAmbientMode } from "@/hooks/use-ambient-still"

/**
 * The hero's phone: Apple's iPhone 18 Pro reference model (public/devices,
 * see scripts/prepare-usdz.py) with a coded screen on its display. It rises
 * and turns into place once loaded, then swivels a little toward the
 * pointer, never round: a turn of at most YAW either way.
 *
 * Heavy (three.js and a 5.6 MB model), so it loads only on a desktop
 * pointer, after the page has settled (useAmbientMode "desktop": phones,
 * iPads, low battery and reduced motion never fetch it). It draws only while
 * it moves and pauses off screen.
 */

// The model holds two posed phones; this one is kept, its display replaced.
const KEEP = "pHYCsZfzCytMXko"
const DROP = "zZWDMeVSzXXBycE"
const SCREEN = "oGFItxWqzAveXtT"
const YAW = 0.42
const PITCH = 0.12
const ENTER_MS = 1400

/** The placeholder screen: a coded UI in the site's palette, 1024 x 2048. */
function drawScreen(): HTMLCanvasElement {
  const c = document.createElement("canvas")
  c.width = 1024
  c.height = 2048
  const g = c.getContext("2d")!
  const ink = "#111111"
  const graphite = "#8a877f"
  const rule = "#e2ded5"
  const blue = "#2B35E8"
  g.fillStyle = "#F8F7F3"
  g.fillRect(0, 0, 1024, 2048)
  // Status bar.
  g.fillStyle = ink
  g.font = "600 44px ui-sans-serif, system-ui, sans-serif"
  g.fillText("9:41", 96, 128)
  g.fillRect(824, 100, 92, 34)
  // Header.
  g.fillStyle = graphite
  g.font = "400 36px ui-monospace, monospace"
  g.fillText("Placeholder · coded UI", 80, 300)
  g.fillStyle = ink
  g.font = "800 104px ui-sans-serif, system-ui, sans-serif"
  g.fillText("Screen", 80, 420)
  g.fillText("goes here.", 80, 530)
  // Ruled line items.
  for (let i = 0; i < 4; i++) {
    const y = 660 + i * 220
    g.fillStyle = rule
    g.fillRect(80, y, 864, 3)
    g.fillStyle = i === 0 ? blue : ink
    g.fillRect(80, y + 56, 28, 28)
    g.fillStyle = ink
    g.fillRect(140, y + 52, 420 - i * 40, 34)
    g.fillStyle = rule
    g.fillRect(140, y + 112, 600 - i * 60, 26)
    g.fillStyle = graphite
    g.fillRect(820, y + 56, 124, 28)
  }
  // Primary action.
  g.fillStyle = blue
  g.fillRect(80, 1660, 864, 140)
  g.fillStyle = "#ffffff"
  g.font = "600 52px ui-sans-serif, system-ui, sans-serif"
  g.fillText("Continue", 400, 1748)
  return c
}

export function HeroPhone() {
  const mode = useAmbientMode("desktop")
  const stageRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (mode !== "live" || !stage) return
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
      const camera = new THREE.PerspectiveCamera(24, 1, 0.01, 10)
      camera.position.set(0, 0, 0.5)

      let model: import("three").Group
      try {
        model = (await new USDLoader().loadAsync("/devices/iphone-18-pro.usdz")) as import("three").Group
      } catch {
        renderer.dispose()
        return
      }
      if (disposed) {
        renderer.dispose()
        return
      }

      // One phone, centred, its display toward the camera.
      model.getObjectByName(DROP)?.removeFromParent()
      // Measure with the model's own transforms (its 0.01 scale) applied.
      model.updateMatrixWorld(true)
      const phone = model.getObjectByName(KEEP)!
      const pivot = new THREE.Group()
      const box = new THREE.Box3().setFromObject(phone)
      const centre = box.getCenter(new THREE.Vector3())
      model.position.sub(centre)
      pivot.add(model)
      const turn = new THREE.Group()
      turn.rotation.y = Math.PI
      turn.add(pivot)
      scene.add(turn)
      const height = box.getSize(new THREE.Vector3()).y

      const texture = new THREE.CanvasTexture(drawScreen())
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      phone.traverse((o) => {
        const mesh = o as import("three").Mesh
        if (!mesh.isMesh || mesh.name !== SCREEN) return
        const material = (mesh.material as import("three").MeshStandardMaterial).clone()
        material.emissiveMap = texture
        material.emissive = new THREE.Color(0xffffff)
        material.emissiveIntensity = 1
        material.map = null
        material.color = new THREE.Color(0x000000)
        // A lit screen shows its own colours, outside the scene's tone curve.
        material.toneMapped = false
        mesh.material = material
      })

      await renderer.compileAsync(scene, camera)
      if (disposed) {
        renderer.dispose()
        return
      }
      stage.appendChild(renderer.domElement)

      const fit = () => {
        const { width, height: h } = stage.getBoundingClientRect()
        if (!width || !h) return
        renderer.setSize(width, h)
        camera.aspect = width / h
        // The phone fills about 88% of the stage's height.
        camera.position.z = (height / 0.88 / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
        camera.updateProjectionMatrix()
        kick()
      }

      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
      const born = performance.now()
      const target = { yaw: 0, pitch: 0 }
      const now = { yaw: reduce ? 0 : -0.9, pitch: 0 }
      let raf = 0
      let last = born
      let onScreen = true
      let rect = stage.getBoundingClientRect()

      const frame = (t: number) => {
        raf = 0
        const dt = Math.min((t - last) / 1000, 0.05)
        last = t
        // Entrance: rise and turn into place.
        const p = reduce ? 1 : Math.min((t - born) / ENTER_MS, 1)
        const e = 1 - Math.pow(1 - p, 3)
        turn.position.y = (1 - e) * -height * 0.35
        const follow = 1 - Math.exp(-dt * (p < 1 ? 3 : 5))
        now.yaw += (target.yaw - now.yaw) * follow
        now.pitch += (target.pitch - now.pitch) * follow
        pivot.rotation.set(now.pitch, now.yaw, 0)
        renderer.domElement.style.opacity = String(e)
        renderer.render(scene, camera)
        const moving = p < 1 || Math.abs(target.yaw - now.yaw) > 0.001 || Math.abs(target.pitch - now.pitch) > 0.001
        if (onScreen && moving) raf = requestAnimationFrame(frame)
      }
      const kick = () => {
        if (!raf && onScreen) {
          last = performance.now()
          raf = requestAnimationFrame(frame)
        }
      }

      // Swivel toward the pointer, within YAW and PITCH; listened for only
      // while the phone is on screen.
      const onPointer = (e: PointerEvent) => {
        const x = (e.clientX - (rect.left + rect.width / 2)) / (innerWidth / 2)
        const y = (e.clientY - (rect.top + rect.height / 2)) / (innerHeight / 2)
        target.yaw = Math.max(-1, Math.min(1, x)) * YAW
        target.pitch = Math.max(-1, Math.min(1, y)) * PITCH
        kick()
      }
      const onScroll = () => {
        rect = stage.getBoundingClientRect()
      }
      const listen = (on: boolean) => {
        if (reduce) return
        const m = on ? "addEventListener" : "removeEventListener"
        window[m]("pointermove", onPointer as EventListener, { passive: true })
        window[m]("scroll", onScroll, { passive: true })
      }

      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting
        listen(onScreen)
        if (onScreen) {
          rect = stage.getBoundingClientRect()
          kick()
        }
      })
      io.observe(stage)
      const ro = new ResizeObserver(() => {
        rect = stage.getBoundingClientRect()
        fit()
      })
      ro.observe(stage)
      fit()
      setReady(true)

      teardown = () => {
        cancelAnimationFrame(raf)
        listen(false)
        io.disconnect()
        ro.disconnect()
        texture.dispose()
        scene.environment?.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    // After the page has settled: the hero's own landing runs first.
    let idle = 0
    const go = () => void start()
    const after = () => {
      idle = window.setTimeout(go, 600)
    }
    if (document.readyState === "complete") after()
    else window.addEventListener("load", after, { once: true })

    return () => {
      disposed = true
      window.removeEventListener("load", after)
      window.clearTimeout(idle)
      teardown?.()
    }
  }, [mode])

  return <div ref={stageRef} data-ready={ready || undefined} aria-hidden className="relative h-full min-h-[320px] w-full" />
}
