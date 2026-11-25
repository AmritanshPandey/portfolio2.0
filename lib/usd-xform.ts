import { Euler, Matrix4, Quaternion, type Object3D } from "three"

/**
 * USD transform ops, read the way USD reads them.
 *
 * three's USDComposer.applyTransform knows a fixed list of op names, so it
 * silently skips suffixed ops such as Maya's pivots
 * (`xformOp:translate:rotatePivot`, `…:scalePivotTranslate`). Apple's device
 * models wrap their rotations in those, so parts turned about the wrong
 * point and sat off the body: a fragment under the iPhone's lenses, a bar by
 * its front camera. patchUsdComposer replaces that method with one that
 * reads every op by its kind, whatever its suffix
 * (lib/usd-xform.test.mjs).
 */

type Data = Record<string, unknown>

const ROTATE3 = /^rotate([XYZ]{3})$/

/** "xformOp:translate:rotatePivot" → "translate". */
export function opKind(op: string): string {
  return op.split(":")[1] ?? ""
}

function opMatrix(kind: string, value: unknown, m: Matrix4): Matrix4 | null {
  const v = value as number[] | number | undefined
  if (v === undefined || v === null) return null
  if (kind === "transform" && Array.isArray(v) && v.length === 16) {
    // USD is row-vector; three is column-vector.
    return m.set(v[0], v[4], v[8], v[12], v[1], v[5], v[9], v[13], v[2], v[6], v[10], v[14], v[3], v[7], v[11], v[15])
  }
  if (kind === "translate" && Array.isArray(v)) return m.makeTranslation(v[0], v[1], v[2])
  if (kind === "scale") return Array.isArray(v) ? m.makeScale(v[0], v[1], v[2]) : m.makeScale(v, v, v)
  if (kind === "orient" && Array.isArray(v) && v.length === 4) return m.makeRotationFromQuaternion(new Quaternion(v[0], v[1], v[2], v[3]))
  const rad = Math.PI / 180
  if (kind === "rotateX" && typeof v === "number") return m.makeRotationX(v * rad)
  if (kind === "rotateY" && typeof v === "number") return m.makeRotationY(v * rad)
  if (kind === "rotateZ" && typeof v === "number") return m.makeRotationZ(v * rad)
  const three = ROTATE3.exec(kind)
  if (three && Array.isArray(v)) {
    // USD rotateABC applies A, then B, then C: three's Euler order "CBA".
    const order = three[1].split("").reverse().join("") as "XYZ"
    return m.makeRotationFromEuler(new Euler(v[0] * rad, v[1] * rad, v[2] * rad, order))
  }
  return null
}

type Composer = { prototype: { applyTransform: (obj: Object3D, fields: Data, attrs?: Data) => void } }

/** Teach a USDComposer class every suffixed xformOp. Idempotent. */
export function patchUsdComposer(Composer: Composer) {
  const proto = Composer.prototype as Composer["prototype"] & { __usdXform?: true }
  if (proto.__usdXform) return
  const original = proto.applyTransform
  proto.applyTransform = function (obj, fields, attrs = {}) {
    const data: Data = { ...fields, ...attrs }
    const order = data.xformOpOrder as string[] | undefined
    if (!order || order.length === 0) return original.call(this, obj, fields, attrs)

    const matrix = new Matrix4()
    const temp = new Matrix4()
    let scale: number[] | null = null
    for (const op of order) {
      const inverse = op.startsWith("!invert!")
      const name = inverse ? op.slice(8) : op
      const kind = opKind(name)
      const m = opMatrix(kind, data[name], temp)
      if (!m) continue
      if (kind === "scale") {
        const s = data[name] as number[] | number
        scale = Array.isArray(s) ? [s[0], s[1], s[2]] : [s, s, s]
      }
      if (inverse) m.invert()
      matrix.multiply(m)
    }
    obj.matrix.copy(matrix)
    obj.matrix.decompose(obj.position, obj.quaternion, obj.scale)
    // As three does: decompose folds a full negative scale into the rotation.
    if (scale && scale.every((n) => n < 0)) {
      obj.scale.set(scale[0], scale[1], scale[2])
      obj.quaternion.set(obj.quaternion.x, -obj.quaternion.y, obj.quaternion.z, -obj.quaternion.w)
    }
  }
  proto.__usdXform = true
}
