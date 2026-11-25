#!/usr/bin/env node
/**
 * Bake the light the device models reflect (three's RoomEnvironment, filtered
 * for every roughness) into public/devices/studio-light.bin. The format is
 * described where it is read, lib/studio-light.ts. Committed; run it again
 * after upgrading three if reflections change:
 *   npx playwright install chromium && node scripts/bake-studio-light.mjs
 */
import { chromium } from "@playwright/test"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { gzipSync } from "node:zlib"

const ROOT = path.resolve(import.meta.dirname, "..")
const OUT = path.join(ROOT, "public/devices/studio-light.bin")
const PAGE = `<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/":"/node_modules/three/"}}</script>`

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost").pathname
  if (url === "/") return res.setHeader("content-type", "text/html").end(PAGE)
  const file = path.join(ROOT, url)
  if (!file.startsWith(path.join(ROOT, "node_modules") + path.sep) || !fs.existsSync(file)) return res.writeHead(404).end()
  res.setHeader("content-type", "text/javascript").end(fs.readFileSync(file))
})
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
const browser = await chromium.launch({ args: ["--enable-gpu"] })
const page = await browser.newPage()
await page.goto(`http://127.0.0.1:${server.address().port}/`)

const base64 = await page.evaluate(async () => {
  const T = await import("three")
  const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js")
  const renderer = new T.WebGLRenderer()
  const { texture } = new T.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04)
  const STEPS = 127
  // Copy each face and level out. x is flipped: three reads cube textures
  // (as opposed to its own render targets) mirrored.
  const material = new T.RawShaderMaterial({
    glslVersion: T.GLSL3,
    uniforms: { map: { value: texture }, face: { value: 0 }, level: { value: 0 }, size: { value: 1 } },
    vertexShader: "in vec3 position; void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: `precision highp float; precision highp int;
      uniform highp samplerCube map; uniform int face; uniform float level, size; out vec4 color;
      void main() {
        vec2 c = 2.0 * gl_FragCoord.xy / size - 1.0;
        vec3 d = face == 0 ? vec3(1.0, -c.y, -c.x) : face == 1 ? vec3(-1.0, -c.y, c.x) : face == 2 ? vec3(c.x, 1.0, c.y)
          : face == 3 ? vec3(c.x, -1.0, -c.y) : face == 4 ? vec3(c.x, -c.y, 1.0) : vec3(-c.x, -c.y, -1.0);
        color = vec4(textureLod(map, vec3(-d.x, d.yz), level).rgb, 1.0);
      }`,
    depthTest: false,
  })
  const quad = new T.Mesh(new T.PlaneGeometry(2, 2), material)
  quad.frustumCulled = false
  const scene = new T.Scene()
  scene.add(quad)
  const planes = []
  for (let face = 0; face < 6; face++)
    for (let level = 0; level < texture.mipmaps.length; level++) {
      const n = texture.mipmaps[level].width
      const target = new T.WebGLRenderTarget(n, n, { type: T.FloatType, depthBuffer: false })
      Object.assign(material.uniforms.face, { value: face })
      Object.assign(material.uniforms.level, { value: level })
      Object.assign(material.uniforms.size, { value: n })
      renderer.setRenderTarget(target)
      renderer.render(scene, new T.Camera())
      const px = new Float32Array(n * n * 4)
      renderer.readRenderTargetPixels(target, 0, 0, n, n, px)
      target.dispose()
      const rgbe = [0, 1, 2, 3].map(() => new Uint8Array(n * n))
      for (let i = 0; i < n * n; i++) {
        const peak = Math.max(px[i * 4], px[i * 4 + 1], px[i * 4 + 2])
        const e = peak < 1e-9 ? -128 : Math.ceil(Math.log2(peak) + 1e-9)
        for (let c = 0; c < 3; c++) rgbe[c][i] = Math.max(0, Math.min(STEPS, Math.round((px[i * 4 + c] / 2 ** e) * STEPS)))
        rgbe[3][i] = e + 128
      }
      for (const plane of rgbe)
        planes.push(plane.map((v, i) => v - (i % n ? plane[i - 1] : i ? plane[i - n] : 0)))
    }
  let text = ""
  for (const plane of planes) for (let i = 0; i < plane.length; i += 32768) text += String.fromCharCode(...plane.subarray(i, i + 32768))
  return btoa(text)
})
const raw = Buffer.from(base64, "base64")
if (!raw.some((v) => v)) throw new Error("baked nothing")
fs.writeFileSync(OUT, gzipSync(raw, { level: 9 }))
console.log(`studio-light.bin: ${Math.round(fs.statSync(OUT).size / 1024)} KB (${Math.round(raw.length / 1024)} KB unpacked)`)
await browser.close()
server.close()
