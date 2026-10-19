"use client"

import clsx from "clsx"
import { useEffect, useRef, useSyncExternalStore } from "react"
import { isSoundOn, setSound, subscribeSound } from "@/lib/ledger-sound"
import { PLUCK, isAtRest, stepString } from "@/lib/pluck"

// How far the mark swings when sound is on (viewBox units), and how it rings
// into place.
const WAVE = 2.4
const RING = { ...PLUCK, frequency: 7, damping: 0.16, rest: 0.03 }

// One full wave, like a string sounding its second harmonic; flat at 0.
const mark = (a: number) => {
  const c = (8 - a * 1.33).toFixed(3)
  const r = (8 + a * 1.33).toFixed(3)
  return `M2 8C4 ${c} 6 ${c} 8 8S12 ${r} 14 8`
}

/**
 * Sound for the plucked rules. A ruled square like the theme toggle, whose
 * mark is itself a rule: flat while sound is off, rung into a wave when it
 * comes on. Off by default; shown only where rules can be plucked (a desktop
 * pointer with motion allowed, see `.sound-toggle` in globals.css).
 */
export function SoundToggle({ className }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, isSoundOn, () => false)
  const path = useRef<SVGPathElement>(null)
  const wave = useRef(0)

  // Ring the mark from wherever it is to its new rest, with the rules' physics.
  useEffect(() => {
    const target = on ? WAVE : 0
    let s = { d: wave.current - target, v: 0 }
    let last = performance.now()
    let raf = requestAnimationFrame(function frame(now) {
      s = stepString(s, Math.min((now - last) / 1000, 1 / 20), RING)
      last = now
      const settled = isAtRest(s, RING)
      wave.current = settled ? target : target + s.d
      path.current?.setAttribute("d", mark(wave.current))
      if (!settled) raf = requestAnimationFrame(frame)
    })
    return () => cancelAnimationFrame(raf)
  }, [on])

  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-label="Sound"
      aria-pressed={on}
      title={on ? "Sound on" : "Sound off"}
      className={clsx(
        "sound-toggle glass-edge size-9 shrink-0 items-center justify-center border text-foreground",
        "transition-[border-color,transform] duration-200 hover:border-foreground active:translate-y-px",
        on ? "border-foreground" : "border-border",
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-4 overflow-visible">
        <path ref={path} d={mark(0)} fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
