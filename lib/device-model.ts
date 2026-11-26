import type { BufferGeometry, Group } from "three"

type Kit = typeof import("./device-kit")
let kit: Promise<Kit> | null = null

/** three.js, as the device models need it. One download, shared. */
export const loadDeviceKit = () =>
  (kit ??= import("./device-kit").catch((error) => {
    kit = null
    throw error
  }))

/**
 * Fetch and evaluate the kit once the page is idle, so that work isn't done
 * in the middle of a scroll when a device comes near. Skipped when the reader
 * asked to save data. Returns a cancel.
 */
export function warmDeviceKit(): () => void {
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return () => {}
  const go = () => void loadDeviceKit().catch(() => {})
  let cancel = () => {}
  const wait = () => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(go, { timeout: 4000 })
      cancel = () => cancelIdleCallback(id)
    } else {
      const id = setTimeout(go, 1200)
      cancel = () => clearTimeout(id)
    }
  }
  if (document.readyState === "complete") wait()
  else window.addEventListener("load", wait, { once: true })
  return () => {
    window.removeEventListener("load", wait)
    cancel()
  }
}

/** A device model (public/devices/*.glb, made by scripts/compact-devices.mjs). */
export async function loadDevice(kit: Kit, url: string): Promise<Group> {
  const { scene } = await new kit.GLTFLoader().setMeshoptDecoder(kit.MeshoptDecoder).loadAsync(url)
  return scene
}

/**
 * The compact models store vertices as small integers, scaled by their node.
 * This gives back a plain float copy, for code that bakes transforms into the
 * vertices.
 */
export function floatGeometry(kit: Kit, source: BufferGeometry): BufferGeometry {
  const out = new kit.BufferGeometry()
  if (source.index) out.setIndex(source.index.clone())
  for (const [name, from] of Object.entries(source.attributes)) {
    const size = from.itemSize
    const values = new Float32Array(from.count * size)
    // getComponent undoes the integer scaling, and any interleaving.
    for (let i = 0; i < from.count; i++) for (let c = 0; c < size; c++) values[i * size + c] = from.getComponent(i, c)
    out.setAttribute(name, new kit.BufferAttribute(values, size))
  }
  return out
}
