"use client"

import { useEffect, useRef, useState } from "react"

const WORDS = ["systems", "platforms", "experiences", "products"]

// Timing constants — tweak here, not buried in logic
const TYPING_MIN    = 100
const TYPING_MAX    = 160
const DELETING_MIN  = 60
const DELETING_MAX  = 100
const PAUSE_AFTER   = 1800  // ms pause when word is fully typed
const PAUSE_BEFORE  = 300   // ms pause before starting to delete

export function TypingWord() {
  const [wordIndex,  setWordIndex]  = useState(0)
  const [displayed,  setDisplayed]  = useState("")
  const [phase,      setPhase]      = useState<"typing" | "pausing" | "deleting" | "switching">("typing")

  // Use a ref for the timeout so cleanup is always reliable
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  useEffect(() => {
    clear()
    const word = WORDS[wordIndex]

    if (phase === "typing") {
      if (displayed === word) {
        // Word fully typed — pause before deleting
        timeoutRef.current = setTimeout(() => setPhase("pausing"), PAUSE_AFTER)
        return
      }
      const delay = Math.random() * (TYPING_MAX - TYPING_MIN) + TYPING_MIN
      timeoutRef.current = setTimeout(() => {
        setDisplayed(word.slice(0, displayed.length + 1))
      }, delay)
    }

    if (phase === "pausing") {
      timeoutRef.current = setTimeout(() => setPhase("deleting"), PAUSE_BEFORE)
    }

    if (phase === "deleting") {
      if (displayed === "") {
        // Word fully deleted — move to next word
        timeoutRef.current = setTimeout(() => {
          setWordIndex((prev) => (prev + 1) % WORDS.length)
          setPhase("typing")
        }, 120)
        return
      }
      const delay = Math.random() * (DELETING_MAX - DELETING_MIN) + DELETING_MIN
      timeoutRef.current = setTimeout(() => {
        setDisplayed((prev) => prev.slice(0, prev.length - 1))
      }, delay)
    }

    return clear
  }, [displayed, phase, wordIndex])

  return (
<span className="inline-flex items-baseline gap-[2px]">
  <span className="text-orange-400">{displayed}</span>

  <span
    className={`
      inline-block h-[0.85em] w-[1.5px] rounded-full bg-orange-400/80
      ${phase === "pausing" ? "animate-pulse" : "opacity-100"}
      transition-opacity duration-100
    `}
  />
</span>
  )
}