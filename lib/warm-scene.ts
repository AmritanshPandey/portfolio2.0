import type { Camera, Material, Mesh, Scene, Texture, WebGLRenderer } from "three"

const task = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

/** Meshes drawn together in one rehearsal step. */
const STEP = 6

/** Resolves once the GPU has finished what it was given so far. */
async function settled(gl: WebGL2RenderingContext) {
  const fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)
  gl.flush()
  if (!fence) return
  const until = performance.now() + 4000
  do await new Promise((resolve) => setTimeout(resolve, 8))
  while (gl.getSyncParameter(fence, gl.SYNC_STATUS) === gl.UNSIGNALED && performance.now() < until)
  gl.deleteSync(fence)
}

/**
 * Ready a three.js scene's first frame before it is shown: decode every image
 * off the main thread, upload one texture per task, compile the shaders in
 * parallel where the browser can, then draw the scene a few meshes at a time
 * into a single pixel, letting the GPU finish each step. Otherwise all of it
 * lands in the first render as one stall (most of a second on a first visit,
 * before the browser has the shaders cached), while the page is scrolled.
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
  if (cancelled()) return false
  // Asking a program for its inputs waits for the GPU; ask before it is busy.
  for (const program of renderer.info.programs ?? []) {
    program.getUniforms()
    program.getAttributes()
  }

  const meshes: { mesh: Mesh; visible: boolean; culled: boolean }[] = []
  scene.traverse((object) => {
    const mesh = object as Mesh
    if (mesh.isMesh) meshes.push({ mesh, visible: mesh.visible, culled: mesh.frustumCulled })
  })
  const gl = renderer.getContext() as WebGL2RenderingContext
  try {
    for (const { mesh } of meshes) {
      mesh.visible = false
      mesh.frustumCulled = false
    }
    renderer.setScissor(0, 0, 1, 1)
    renderer.setScissorTest(true)
    const shown = meshes.filter((m) => m.visible)
    for (let i = 0; i < shown.length; i += STEP) {
      const step = shown.slice(i, i + STEP)
      for (const { mesh } of step) mesh.visible = true
      renderer.render(scene, camera)
      for (const { mesh } of step) mesh.visible = false
      await settled(gl)
      if (cancelled()) return false
    }
  } finally {
    renderer.setScissorTest(false)
    for (const { mesh, visible, culled } of meshes) {
      mesh.visible = visible
      mesh.frustumCulled = culled
    }
  }
  return true
}
