import type { Texture, WebGLRenderer } from "three"

type Kit = typeof import("./device-kit")

/** public/devices/studio-light.bin, made by scripts/bake-studio-light.mjs: a
 *  gzip of six cube faces, each with its mip levels from SIZE down to 8, each
 *  level as four planes (r, g, b, shared exponent), each plane stored as
 *  differences from the pixel before. */
const URL = "/devices/studio-light.bin"
const SIZE = 256
const LEVELS = 6
/** r, g and b are 0..STEPS of the exponent's power of two. */
const STEPS = 127

type Mip = { data: Uint16Array; width: number; height: number }
type Face = { width: number; height: number; mipmaps: Mip[] }

export function decodePlane(from: Uint8Array, at: number, n: number, out: Uint8Array) {
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const i = y * n + x
      const before = x ? out[i - 1] : y ? out[i - n] : 0
      out[i] = (from[at + i] + before) & 255
    }
}

async function load(kit: Kit): Promise<Face[]> {
  const response = await fetch(URL)
  if (!response.ok || !response.body) throw new Error(`${URL}: ${response.status}`)
  const bytes = new Uint8Array(await new Response(response.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer())
  // Half floats for every exponent and step, so decoding is a lookup.
  const half = new Uint16Array(256 * (STEPS + 1))
  for (let e = 0; e < 256; e++)
    for (let s = 0; s <= STEPS; s++) half[e * (STEPS + 1) + s] = kit.DataUtils.toHalfFloat(Math.min(65504, (s / STEPS) * 2 ** (e - 128)))
  const one = kit.DataUtils.toHalfFloat(1)
  const faces: Face[] = []
  let at = 0
  for (let f = 0; f < 6; f++) {
    const mipmaps: Mip[] = []
    for (let l = 0; l < LEVELS; l++) {
      const n = SIZE >> l
      const planes = [0, 1, 2, 3].map(() => new Uint8Array(n * n))
      for (const plane of planes) {
        decodePlane(bytes, at, n, plane)
        at += n * n
      }
      const [r, g, b, e] = planes
      const data = new Uint16Array(n * n * 4)
      for (let i = 0; i < n * n; i++) {
        const row = e[i] * (STEPS + 1)
        data[i * 4] = half[row + r[i]]
        data[i * 4 + 1] = half[row + g[i]]
        data[i * 4 + 2] = half[row + b[i]]
        data[i * 4 + 3] = one
      }
      mipmaps.push({ data, width: n, height: n })
    }
    faces.push({ width: SIZE, height: SIZE, mipmaps })
    // A task per face, so a frame can land between them.
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
  if (at !== bytes.length) throw new Error(`${URL}: unexpected size`)
  return faces
}

let faces: Promise<Face[]> | null = null

/**
 * The light the devices reflect: three's RoomEnvironment, filtered ahead of
 * time. Filtering it in the browser builds six shaders and blocks the main
 * thread for a third of a second on a first visit; this only uploads a
 * texture. Where the file can't be read, it is filtered live.
 */
export async function studioLight(kit: Kit, renderer: WebGLRenderer): Promise<Texture> {
  try {
    const images = await (faces ??= load(kit))
    const texture = new kit.CompressedCubeTexture(images as never, kit.RGBAFormat as never, kit.HalfFloatType)
    Object.assign(texture, { isPMREMTexture: true })
    texture.minFilter = kit.LinearMipmapLinearFilter
    texture.magFilter = kit.LinearFilter
    texture.generateMipmaps = false
    texture.colorSpace = kit.LinearSRGBColorSpace
    texture.needsUpdate = true
    return texture
  } catch {
    faces = null
    const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js")
    const pmrem = new kit.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const { texture } = pmrem.fromScene(room, 0.04)
    room.dispose()
    pmrem.dispose()
    return texture
  }
}
