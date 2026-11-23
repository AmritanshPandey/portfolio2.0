/// <reference lib="webworker" />
import { flowSource, solidSource, type PiecesAsk, type PiecesFrame } from "./approach-pieces"

/**
 * Runs the Approach pieces off the main thread: sphere-cube-morph alone
 * takes ~20 ms a frame. Answers each ask with both grids packed into
 * transferable arrays. Idle unless asked, and the field only asks while it is
 * on screen.
 */

const solid = solidSource()
const flow = flowSource()

self.onmessage = (e: MessageEvent<PiecesAsk>) => {
  solid.update(e.data.solid)
  flow.update(e.data.flow)
  const frame: PiecesFrame = { solid: solid.pack(), flow: flow.pack() }
  ;(self as unknown as DedicatedWorkerGlobalScope).postMessage(frame, [frame.solid.buffer, frame.flow.buffer])
}
