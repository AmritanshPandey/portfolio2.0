import type { Camera, Material, Mesh, Scene, Texture, WebGLRenderer } from "three"

const task = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

/**
 * Ready a three.js scene's first frame before it is shown: decode every image
 * off the main thread, upload one texture per task, and compile the shaders
 * in parallel where the browser can. Otherwise all of it lands in the first
 * render as one stall, while the page is being scrolled.
 *
 * Resolves false, having stopped, once `cancelled` says so.
 */
export async function warmScene(renderer: WebGLRenderer, scene: Scene, camera: Camera, cancelled: () => boolean): Promise<boolean> {
  const maps = new Set<Texture>()
  scene.traverse((object) => {
    const material = (object as Mesh).material as Material | Material[] | undefined
    if (!material) return
    for (const m of Array.isArray(material) ? material : [material])
      for (const value of Object.values(m)) if ((value as Texture | null)?.isTexture) maps.add(value as Texture)
  })
  // A model's own images can arrive after the model; wait for them, a while.
  const until = performance.now() + 4000
  for (const map of maps) {
    const pending = () => {
      const image = map.image as { complete?: boolean } | null | undefined
      return !image || image.complete === false
    }
    while (pending() && performance.now() < until) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      if (cancelled()) return false
    }
    await (map.image as HTMLImageElement | null)?.decode?.().catch(() => {})
    await task()
    if (cancelled()) return false
    if (!pending()) renderer.initTexture(map)
  }
  await renderer.compileAsync(scene, camera)
  return !cancelled()
}
