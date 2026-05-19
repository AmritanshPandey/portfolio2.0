"use client"

import { useEffect, useRef, useState } from "react"

const DEFAULT_WORDS = ["systems", "platforms", "experiences", "products"]
const DEFAULT_TYPING_SPEED = 120
const DEFAULT_DELETING_SPEED = 70
const DEFAULT_PAUSE_AFTER = 1400

interface TypingWordProps {
  words?: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseAfter?: number
  className?: string
}

export function TypingWord({
  words = DEFAULT_WORDS,
  typingSpeed = DEFAULT_TYPING_SPEED,
  deletingSpeed = DEFAULT_DELETING_SPEED,
  pauseAfter = DEFAULT_PAUSE_AFTER,
  className,
}: TypingWordProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const word = words[wordIndex % words.length]
    const hasCompletedWord = !isDeleting && displayed === word

    let delay = isDeleting ? deletingSpeed : typingSpeed

    if (!isDeleting) {
      delay = typingSpeed - Math.min(displayed.length * 4, 40)
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
          setWordIndex((prev) => (prev + 1) % words.length)
        }

        return
      }

      setDisplayed(word.slice(0, displayed.length + 1))
    }, hasCompletedWord ? pauseAfter : delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [displayed, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseAfter])

  return (
    <span className="inline-flex items-baseline leading-[1.05]">

      {/* TEXT */}
      <span
        className={
          className ??
          "text-orange-600/90 dark:text-orange-400/90 font-medium whitespace-nowrap"
        }
      >
        {displayed || " "}
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
