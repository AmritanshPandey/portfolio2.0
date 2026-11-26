// The MacBook's shut lid, measured on its display panel: not the lid group's
// lowest point, which is the hinge lip at the back and says nothing about the
// gap a reader sees. Run with `npm run test:unit`.
import assert from "node:assert/strict"
import fs from "node:fs"
import { test } from "node:test"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"

import { MACBOOK_LID } from "./macbook-lid.ts"

const LID = "mlBJTkeLRJEGJYh"
const BASE = "PvXyCWMztHOhGyi"
const PANEL = ["awCetlAgwzdhTcS", "OQzaQDtbMVhhlAr", "mwMOgOJFeLwwRrb"]
const SHELL = ["coYTbBAwZivAZjX"]

// The model the site ships. Its textures can't load in Node, and needn't.
globalThis.self ??= globalThis
const buf = fs.readFileSync("public/devices/macbook-air-15-silver.glb")
const warn = console.warn
console.warn = () => {}
const { scene: model } = await new GLTFLoader()
  .setMeshoptDecoder(MeshoptDecoder)
  .parseAsync(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), "")
console.warn = warn
model.updateMatrixWorld(true)

function points(root, names) {
  const out = []
  root.traverse((o) => {
    if (!o.isMesh || (names && !names.includes(o.name))) return
    const p = o.geometry.attributes.position
    for (let i = 0; i < p.count; i++) out.push(new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld))
  })
  return out
}
const max = (pts, k) => pts.reduce((m, p) => Math.max(m, p[k]), -Infinity)
const min = (pts, k) => pts.reduce((m, p) => Math.min(m, p[k]), Infinity)

const lid = model.getObjectByName(LID)
const base = points(model.getObjectByName(BASE))
const baseTop = max(base, "y")
// The hinge, placed as components/case-study/device-scene.tsx places it.
const axisY = new THREE.Box3().setFromObject(model.getObjectByName(BASE)).max.y + MACBOOK_LID.axisY
const axisZ = new THREE.Box3().setFromObject(lid).max.z + MACBOOK_LID.axisZ
const shut = (pts) =>
  pts.map((p) => {
    const y = p.y - axisY
    const z = p.z - axisZ
    const c = Math.cos(MACBOOK_LID.shut)
    const s = Math.sin(MACBOOK_LID.shut)
    return { x: p.x, y: axisY + y * c - z * s, z: axisZ + y * s + z * c }
  })

const panel = shut(points(lid, PANEL))
const shell = shut(points(lid, SHELL))
const gapMm = (pts) => (min(pts, "y") - baseTop) * 1000

test("the shut panel rests on the base at its front and its back", () => {
  const front = gapMm(panel.filter((p) => p.z > max(panel, "z") - 0.02))
  const back = gapMm(panel.filter((p) => p.z < min(panel, "z") + 0.02))
  assert.ok(front >= 0 && front < 1, `front gap ${front.toFixed(2)}mm`)
  assert.ok(back >= 0 && back < 1, `back gap ${back.toFixed(2)}mm`)
})

test("the shut lid is flush with the base, front and back", () => {
  const front = (max(shell, "z") - max(base, "z")) * 1000
  const back = (min(shell, "z") - min(base, "z")) * 1000
  assert.ok(Math.abs(front) < 0.5, `front ${front.toFixed(2)}mm`)
  assert.ok(Math.abs(back) < 0.5, `back ${back.toFixed(2)}mm`)
})

test("no part of the shut lid sinks into the base ahead of the hinge", () => {
  const sunk = shut(points(lid)).filter((p) => p.y < baseTop - 0.0005 && p.z > min(base, "z") + 0.02)
  assert.equal(sunk.length, 0)
})
