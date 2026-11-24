// three ships no types for its USD composer; lib/usd-xform.ts patches the one
// method declared here.
declare module "three/examples/jsm/loaders/usd/USDComposer.js" {
  import type { Object3D } from "three"
  export class USDComposer {
    applyTransform(obj: Object3D, fields: Record<string, unknown>, attrs?: Record<string, unknown>): void
  }
}
