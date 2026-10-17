/**
 * Ledger sound: the plucked-rule notes, and the visitor's on/off choice.
 *
 * Off by default. Turning it on lasts for the visit (sessionStorage), never
 * across visits, so nobody returns days later to a page that makes noise.
 * Notes are synthesised with Karplus–Strong (a noise burst ringing through a
 * short delay line), so there are no audio files to download.
 */

const KEY = "ledger-sound"

// Rules further down the page play higher notes, so a sweep through the
// sections climbs a scale. D major pentatonic from A3, pitched where laptop
// speakers still sound warm: no two notes can clash.
const NOTES = [220.0, 246.94, 293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25]
const CONFIRM_NOTE = 2

const MASTER = 0.22
const MIN_GAP_MS = 45

type Listener = () => void

const listeners = new Set<Listener>()
let enabled: boolean | null = null

function stored(): boolean {
  try {
    return window.sessionStorage.getItem(KEY) === "on"
  } catch {
    return false
  }
}

export function isSoundOn(): boolean {
  if (enabled === null) enabled = typeof window !== "undefined" && stored()
  return enabled
}

export function subscribeSound(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setSound(on: boolean) {
  enabled = on
  try {
    window.sessionStorage.setItem(KEY, on ? "on" : "off")
  } catch {
    // Storage can be blocked; the choice still holds until the page reloads.
  }
  listeners.forEach((listener) => listener())
  if (!on) {
    void ctx?.suspend().catch(() => {})
    return
  }
  // Called from the toggle's click: the gesture that lets audio start. A soft
  // note confirms that it is on.
  void unlock()?.resume().then(() => playNote(CONFIRM_NOTE, 0.35, 0), () => {})
}

/* ── Synthesis ─────────────────────────────────────────────────────────── */

let ctx: AudioContext | null = null
let out: AudioNode | null = null
const buffers = new Map<number, AudioBuffer>()
const lastPlayed = new Map<number, number>()

/**
 * Creates or resumes the audio context. Only ever called from a click or key
 * press: browsers refuse to start audio otherwise, so creating it earlier
 * would only log a warning.
 */
function unlock(): AudioContext | null {
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    const gain = ctx.createGain()
    gain.gain.value = MASTER
    // The compressor stops overlapping notes from ever clipping.
    const limiter = ctx.createDynamicsCompressor()
    gain.connect(limiter).connect(ctx.destination)
    out = gain
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {})
  return ctx
}

/**
 * When sound was switched on earlier in the visit, the browser still needs a
 * fresh gesture after a reload before it will play. The first click or key
 * press anywhere wakes it.
 */
export function wakeSoundOnGesture(): () => void {
  const wake = () => {
    if (isSoundOn()) unlock()
  }
  window.addEventListener("pointerdown", wake, { once: true, capture: true })
  window.addEventListener("keydown", wake, { once: true, capture: true })
  return () => {
    window.removeEventListener("pointerdown", wake, { capture: true })
    window.removeEventListener("keydown", wake, { capture: true })
  }
}

// One buffer per note, made the first time it plays (about 290KB each).
function pluckBuffer(c: AudioContext, freq: number): AudioBuffer {
  const cached = buffers.get(freq)
  if (cached) return cached

  const rate = c.sampleRate
  const length = Math.floor(rate * 1.5)
  const buffer = c.createBuffer(1, length, rate)
  const data = buffer.getChannelData(0)
  const period = Math.max(2, Math.round(rate / freq))

  // Excitation: one period of noise, softened by a one-pole low-pass.
  const ring = new Float32Array(period)
  let lp = 0
  for (let i = 0; i < period; i++) {
    lp += 0.6 * (Math.random() * 2 - 1 - lp)
    ring[i] = lp
  }

  let peak = 0
  for (let i = 0, j = 0; i < length; i++) {
    const next = (j + 1) % period
    const sample = ring[j]
    data[i] = sample
    peak = Math.max(peak, Math.abs(sample))
    ring[j] = 0.996 * 0.5 * (sample + ring[next])
    j = next
  }

  // Normalise, and fade the last 300ms so a note never ends on a click.
  const fade = Math.floor(rate * 0.3)
  const scale = peak > 0 ? 1 / peak : 0
  for (let i = 0; i < length; i++) {
    const tail = i > length - fade ? (length - i) / fade : 1
    data[i] *= scale * tail
  }

  buffers.set(freq, buffer)
  return buffer
}

/**
 * Plays the note for the `index`-th rule on the page. `strength` (0–1) is how
 * far the rule was drawn; `pan` (−1 to 1) is where along it it was caught.
 */
export function playNote(index: number, strength: number, pan: number) {
  // Until a gesture has started audio there is nothing to play into; a note
  // queued on a suspended context would sound late, on the next click.
  const c = ctx
  if (!isSoundOn() || !c || !out || c.state !== "running") return

  const now = performance.now()
  if (now - (lastPlayed.get(index) ?? -Infinity) < MIN_GAP_MS) return
  lastPlayed.set(index, now)

  const s = Math.min(Math.max(strength, 0), 1)
  const freq = NOTES[((index % NOTES.length) + NOTES.length) % NOTES.length]
  const source = c.createBufferSource()
  source.buffer = pluckBuffer(c, freq)
  // A hair of detune per note keeps repeated plucks from sounding sampled.
  source.playbackRate.value = 1 + (Math.random() - 0.5) * 0.006

  // A harder pluck is louder and brighter; a gentle one stays woody.
  const tone = c.createBiquadFilter()
  tone.type = "lowpass"
  tone.frequency.value = 1400 + 2800 * s
  const level = c.createGain()
  level.gain.value = 0.3 + 0.7 * s

  let node: AudioNode = source.connect(tone).connect(level)
  if (typeof c.createStereoPanner === "function") {
    const panner = c.createStereoPanner()
    panner.pan.value = Math.min(Math.max(pan, -1), 1) * 0.6
    node = node.connect(panner)
  }
  node.connect(out)
  source.start()
}
