"use client"

import { useEffect, useRef, useState } from "react"

const WORDS = ["systems", "platforms", "experiences", "products"]

const TYPING_MIN    = 100
const TYPING_MAX    = 150
const DELETING_MIN  = 60
const DELETING_MAX  = 90
const PAUSE_AFTER   = 1600
const PAUSE_BEFORE  = 250

export function TypingWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing")

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  useEffect(() => {
    clear()
    const word = WORDS[wordIndex]

    if (phase === "typing") {
      if (displayed === word) {
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
    <span className="inline-flex items-baseline gap-[3px]">

      {/* TEXT */}
      <span className="
        text-orange-500
        dark:text-orange-400
        dark:drop-shadow-[0_0_6px_rgba(249,115,22,0.25)]
      ">
        {displayed}
      </span>

      {/* CURSOR */}
      <span
        className="
          inline-block h-[0.85em] w-[1.5px] rounded-full
          bg-orange-500/80
          dark:bg-orange-400/80
          transition-opacity duration-300
        "
        style={{
          opacity: phase === "pausing" ? 0.35 : 1,
        }}
      />

    </span>
  )
}