"use client"

import { useEffect, useRef, useState } from "react"

const WORDS = ["systems", "platforms", "experiences", "products"]

const TYPING_SPEED = 120
const DELETING_SPEED = 70
const PAUSE_AFTER = 1400

export function TypingWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const word = WORDS[wordIndex]
    const hasCompletedWord = !isDeleting && displayed === word

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED

    if (!isDeleting) {
      delay = TYPING_SPEED - Math.min(displayed.length * 4, 40)
    }

    timeoutRef.current = setTimeout(() => {
      if (hasCompletedWord) {
        setIsDeleting(true)
        return
      }

      if (isDeleting) {
        const next = word.slice(0, displayed.length - 1)
        setDisplayed(next)

        if (next === "") {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % WORDS.length)
        }

        return
      }

      setDisplayed(word.slice(0, displayed.length + 1))
    }, hasCompletedWord ? PAUSE_AFTER : delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayed, isDeleting, wordIndex])

  return (
    <span className="inline-flex items-baseline leading-[1.05]">

      {/* TEXT */}
      <span
        className="
          text-orange-600/90 dark:text-orange-400/90
          font-medium
          whitespace-nowrap
        "
      >
        {displayed || "\u00A0"} {/* prevents collapse */}
      </span>

      {/* CURSOR */}
      <span
        className="
          ml-[2px] inline-block
          w-[1.5px] h-[0.9em]
          rounded-full
          bg-orange-500/80 dark:bg-orange-400/80
          animate-pulse
        "
      />
    </span>
  )
}