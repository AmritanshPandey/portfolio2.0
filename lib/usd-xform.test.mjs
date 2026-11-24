// Unit tests for the USD transform patch: three's USDComposer skips suffixed
// xformOps (Maya-style pivots), which misplaced parts of the device models.
// Run with `npm run test:unit`.
import assert from "node:assert/strict"
import fs from "node:fs"
import { test } from "node:test"
import * as THREE from "three"
import { USDLoader } from "three/examples/jsm/loaders/USDLoader.js"
import { USDComposer } from "three/examples/jsm/loaders/usd/USDComposer.js"

import { opKind, patchUsdComposer } from "./usd-xform.ts"

patchUsdComposer(USDComposer)

const composer = Object.create(USDComposer.prototype)
const compose = (data) => {
  const obj = new THREE.Object3D()
  composer.applyTransform(obj, data)
  obj.updateMatrix()
  return obj
}

test("suffixed ops are read by their kind", () => {
  assert.equal(opKind("xformOp:translate:rotatePivot"), "translate")
  assert.equal(opKind("xformOp:translate"), "translate")
  assert.equal(opKind("xformOp:rotateXYZ:rotation"), "rotateXYZ")
  assert.equal(opKind("xformOp:scale:scalePivot"), "scale")
})

test("a rotation about a rotatePivot leaves the pivot in place", () => {
  const pivot = [0.03, 0.04, 0.01]
  const obj = compose({
    xformOpOrder: ["xformOp:translate", "xformOp:translate:rotatePivot", "xformOp:rotateXYZ", "!invert!xformOp:translate:rotatePivot"],
    "xformOp:translate": [0, 0, 0],
    "xformOp:translate:rotatePivot": pivot,
    "xformOp:rotateXYZ": [0, 0, 90],
  })
  const p = new THREE.Vector3(...pivot).applyMatrix4(obj.matrix)
  assert.ok(p.distanceTo(new THREE.Vector3(...pivot)) < 1e-9, `pivot moved to ${p.toArray()}`)
})

test("a rotatePivotTranslate moves the part", () => {
  const obj = compose({
    xformOpOrder: ["xformOp:translate:rotatePivotTranslate"],
    "xformOp:translate:rotatePivotTranslate": [0.01, 0, 0],
  })
  assert.ok(Math.abs(obj.position.x - 0.01) < 1e-9)
})

test("unsuffixed ops compose as before", () => {
  const obj = compose({
    xformOpOrder: ["xformOp:translate", "xformOp:rotateXYZ", "xformOp:scale"],
    "xformOp:translate": [1, 2, 3],
    "xformOp:rotateXYZ": [0, 90, 0],
    "xformOp:scale": [2, 2, 2],
  })
  assert.deepEqual(obj.position.toArray().map((n) => +n.toFixed(6)), [1, 2, 3])
  assert.ok(Math.abs(obj.scale.x - 2) < 1e-9)
})

// Every transform op the device models use is understood, none skipped.
globalThis.document ??= { createElementNS: () => ({ style: {}, addEventListener() {}, setAttribute() {} }) }
for (const file of ["public/devices/iphone-18-pro.usdz", "public/devices/macbook-air-15-silver.usdz", "public/devices/imac-silver.usdz"]) {
  test(`${file}: no transform op is skipped`, () => {
    const kinds = new Set(["transform", "translate", "scale", "orient", "rotateX", "rotateY", "rotateZ", "rotateXYZ", "rotateXZY", "rotateYXZ", "rotateYZX", "rotateZXY", "rotateZYX"])
    const unknown = new Set()
    const apply = USDComposer.prototype.applyTransform
    USDComposer.prototype.applyTransform = function (obj, fields, attrs = {}) {
      for (const op of { ...fields, ...attrs }.xformOpOrder ?? []) {
        const name = op.startsWith("!invert!") ? op.slice(8) : op
        if (!kinds.has(opKind(name))) unknown.add(name)
      }
      return apply.call(this, obj, fields, attrs)
    }
    try {
      const buf = fs.readFileSync(file)
      try {
        new USDLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
      } catch {
        // Textures need a real DOM; transforms are composed before that.
      }
    } finally {
      USDComposer.prototype.applyTransform = apply
    }
    assert.deepEqual([...unknown], [])
  })
}
