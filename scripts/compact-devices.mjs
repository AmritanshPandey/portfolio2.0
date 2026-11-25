#!/usr/bin/env node
/**
 * Make the compact models the site loads (public/devices/*.glb) from Apple's
 * USD models beside them. Same shapes, materials and part names; the vertices
 * are welded and compressed (meshopt), the textures are WebP, and parts the
 * page never shows (a second phone, the pictures Apple ships on the displays)
 * are left out. three reads these without the long main-thread parse USD needs.
 *
 * The GLBs are committed; run this again only to remake them:
 *   npm i --no-save @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer@1
 *   npx playwright install chromium
 *   node scripts/compact-devices.mjs
 */
import { chromium } from "@playwright/test"
import { NodeIO } from "@gltf-transform/core"
import { ALL_EXTENSIONS, EXTMeshoptCompression } from "@gltf-transform/extensions"
import { dedup, prune, quantize, reorder, textureCompress, weld } from "@gltf-transform/functions"
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer"
import sharp from "sharp"
import fs from "node:fs"
import http from "node:http"
import { stripTypeScriptTypes } from "node:module"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const DEVICES = path.join(ROOT, "public/devices")

/** `drop`: parts to leave out. `screens`: displays, whose picture is dropped. */
const MODELS = [
  { out: "iphone-18-pro.glb", from: "iphone-18-pro.usdz", drop: ["zZWDMeVSzXXBycE"], screens: ["oGFItxWqzAveXtT"] },
  { out: "macbook-air-15-silver.glb", from: "macbook-air-15-silver.usdz", drop: [], screens: ["OQzaQDtbMVhhlAr"] },
  {
    out: "iphone-duo.glb",
    from: "iphone-duo/iPhone_Duo_Render.usdc",
    drop: [],
    screens: ["UXtsBZYlaUvHoEh", "hhgAIoCGsHXeDPY"],
  },
]

const TYPES = { ".js": "text/javascript", ".ts": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg" }
const PAGE = `<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/":"/node_modules/three/"}}</script>`

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname)
  if (url === "/") return res.setHeader("content-type", "text/html").end(PAGE)
  const file = path.join(ROOT, url)
  if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file)) return res.writeHead(404).end()
  res.setHeader("content-type", TYPES[path.extname(file)] ?? "application/octet-stream")
  const body = fs.readFileSync(file)
  res.end(file.endsWith(".ts") ? stripTypeScriptTypes(body.toString()) : body)
})
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))

await MeshoptEncoder.ready
await MeshoptDecoder.ready
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder })

// Read USD in a browser (three's loader needs its images decoded), write GLB.
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(`http://127.0.0.1:${server.address().port}/`)

for (const { out, from, drop, screens } of MODELS) {
  const base64 = await page.evaluate(
    async ([url, drop]) => {
      const { USDLoader } = await import("three/examples/jsm/loaders/USDLoader.js")
      const { USDComposer } = await import("three/examples/jsm/loaders/usd/USDComposer.js")
      const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js")
      const { patchUsdComposer } = await import("/lib/usd-xform.ts")
      patchUsdComposer(USDComposer)
      const model = await new USDLoader().loadAsync(url)
      for (const name of drop) model.getObjectByName(name).removeFromParent()
      // The images arrive after the model.
      const images = () => {
        const all = []
        model.traverse((o) => {
          if (o.isMesh) for (const v of Object.values(o.material)) if (v?.isTexture) all.push(v.image)
        })
        return all
      }
      for (let i = 0; i < 200 && images().some((m) => !m || m.complete === false); i++) await new Promise((r) => setTimeout(r, 100))
      if (images().some((m) => !m || m.complete === false)) throw new Error(`${url}: an image never loaded`)
      model.updateMatrixWorld(true)
      const bytes = new Uint8Array(await new GLTFExporter().parseAsync(model, { binary: true, onlyVisible: false }))
      let text = ""
      for (let i = 0; i < bytes.length; i += 32768) text += String.fromCharCode(...bytes.subarray(i, i + 32768))
      return btoa(text)
    },
    [`/public/devices/${from}`, drop],
  )

  const doc = await io.readBinary(new Uint8Array(Buffer.from(base64, "base64")))
  for (const node of doc.getRoot().listNodes()) {
    if (!screens.includes(node.getName())) continue
    for (const primitive of node.getMesh().listPrimitives()) {
      const material = primitive.getMaterial().clone()
      primitive.setMaterial(material.setBaseColorTexture(null).setEmissiveTexture(null))
    }
  }
  const webp = { encoder: sharp, targetFormat: "webp", effort: 80 }
  await doc.transform(
    dedup(),
    weld(),
    // Keep every texture coordinate: the page puts its own pictures on the displays.
    prune({ keepLeaves: true, keepAttributes: true, keepSolidTextures: true }),
    textureCompress({ ...webp, slots: /^(?!normalTexture)/, quality: 88 }),
    textureCompress({ ...webp, slots: /^normalTexture/, lossless: true }),
    reorder({ encoder: MeshoptEncoder, target: "size" }),
    quantize({ quantizePosition: 16, quantizeNormal: 10, quantizeTexcoord: 14 }),
  )
  doc
    .createExtension(EXTMeshoptCompression)
    .setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER })
  await io.write(path.join(DEVICES, out), doc)
  const kb = (file) => Math.round(fs.statSync(path.join(DEVICES, file)).size / 1024)
  console.log(`${out}: ${kb(out)} KB (from ${from}, ${kb(from)} KB)`)
}

await browser.close()
server.close()
