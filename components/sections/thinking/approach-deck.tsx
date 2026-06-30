"use client"

import { useCallback, useRef, useState } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion"
import {
  IconViewfinder,
  IconSitemap,
  IconScissors,
  IconBolt,
  IconUsers,
  IconStack2,
  type Icon,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface Step {
  num: string
  q: string
  body: string
  icon: Icon
}

const STEPS: Step[] = [
  {
    num: "01",
    q: "Frame the constraint",
    icon: IconViewfinder,
    body: "Name what is fixed: time, risk, legacy systems, brand rules, compliance, stakeholders, or engineering capacity.",
  },
  {
    num: "02",
    q: "Map the system",
    icon: IconSitemap,
    body: "Find the shared flows, repeated decisions, handoff points, and edge cases before designing the visible surface.",
  },
  {
    num: "03",
    q: "Choose the smallest useful solution",
    icon: IconScissors,
    body: "Cut the first version down to the decision that needs proof, then protect the path for what repeats later.",
  },
  {
    num: "04",
    q: "Prototype the decision",
    icon: IconBolt,
    body: "Use Figma, code, content models, or a working demo depending on what risk needs to be tested.",
  },
  {
    num: "05",
    q: "Align teams",
    icon: IconUsers,
    body: "Turn the decision into a shared artifact: a flow, rule, token model, prototype, or implementation note.",
  },
  {
    num: "06",
    q: "Scale what repeats",
    icon: IconStack2,
    body: "Promote repeated choices into components, templates, documentation, and governance only after the pattern proves useful.",
  },
]

const COUNT = STEPS.length
const THRESHOLD = 110 // px of horizontal offset to commit a throw
const V_THRESHOLD = 500 // px/s flick velocity to commit

/** Per-slot transform for the cards behind the front one. */
const SLOTS = [
  { y: 0, scale: 1, rotate: 0, opacity: 1, z: 30 }, // pos 0 (front)
  { y: 14, scale: 0.96, rotate: 2, opacity: 0.85, z: 20 }, // pos 1
  { y: 28, scale: 0.92, rotate: -3, opacity: 0.55, z: 10 }, // pos 2
  { y: 36, scale: 0.9, rotate: 0, opacity: 0, z: 0 }, // pos >= 3 (hidden)
] as const

function StepCard({ step, faded }: { step: Step; faded?: boolean }) {
  const Icon = step.icon
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] bg-card p-6 md:p-7",
        "ring-1 ring-foreground/[0.08] dark:ring-white/[0.08]",
        "shadow-[0_18px_44px_-24px_rgba(0,0,0,0.35)] will-change-transform"
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex size-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_18%,white)] text-accent ring-1 ring-accent/20 dark:bg-[color-mix(in_srgb,var(--accent)_22%,black)]"
        >
          <Icon className="size-5" stroke={1.75} aria-hidden />
        </span>
        <span
          aria-hidden
          className="type-section-title select-none font-mono leading-none text-accent/15 dark:text-accent/20"
        >
          {step.num}
        </span>
      </div>

      <p className="type-card-title mt-7 text-foreground">{step.q}</p>
      <p className={cn("type-card-body mt-3 text-muted-foreground", faded && "opacity-90")}>
        {step.body}
      </p>
    </div>
  )
}

export function ApproachDeck() {
  const [index, setIndex] = useState(0)
  const prefersReduced = useReducedMotion()

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-14, 0, 14])

  // Guards a click from firing after a real drag (framer fires a click on release).
  const draggedRef = useRef(false)

  const goTo = useCallback((i: number) => {
    setIndex(((i % COUNT) + COUNT) % COUNT)
    x.set(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % COUNT)
    x.set(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + COUNT) % COUNT)
    x.set(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDragEnd = useCallback(
    (_e: unknown, info: PanInfo) => {
      const offX = info.offset.x
      const velX = info.velocity.x
      const committed = Math.abs(offX) > THRESHOLD || Math.abs(velX) > V_THRESHOLD
      if (!committed) return // dragSnapToOrigin springs x back to 0

      const dir = (offX || velX) < 0 ? -1 : 1
      // Throw the front card off-screen, then restack: the thrown step's new slot
      // is the (hidden) back of the deck, so resetting x to 0 is invisible.
      animate(x, dir * 600, {
        type: "spring",
        stiffness: 260,
        damping: 30,
        velocity: velX,
      }).then(() => {
        advance()
      })
    },
    [advance, x]
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "Enter":
          e.preventDefault()
          advance()
          break
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          prev()
          break
        case "Home":
          e.preventDefault()
          goTo(0)
          break
      }
    },
    [advance, prev, goTo]
  )

  const active = STEPS[index]

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Heading + intro — first in DOM (above the deck on mobile), right column on desktop */}
      <div className="order-1 max-w-[640px] space-y-4 lg:order-2">
        <h2 className="type-section-title text-foreground">Approach</h2>
        <p className="type-section-intro text-muted-foreground">
          A practical operating model for moving from ambiguity to a decision teams can build from.
        </p>
      </div>

      {/* Deck column */}
      <div className="order-2 flex flex-col items-center gap-6 lg:order-1">
        <div
          role="group"
          tabIndex={0}
          aria-roledescription="Card deck"
          aria-label="Approach steps — use the left and right arrow keys to browse"
          onKeyDown={onKeyDown}
          onClick={() => {
            if (draggedRef.current) {
              draggedRef.current = false
              return
            }
            advance()
          }}
          className="relative aspect-[4/5] w-full max-w-[380px] cursor-pointer rounded-[1.5rem] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          {STEPS.map((step, i) => {
            const pos = (i - index + COUNT) % COUNT
            const isFront = pos === 0
            const slot = SLOTS[Math.min(pos, SLOTS.length - 1)]

            if (isFront) {
              // Single persistent, draggable front card bound to the motion values.
              return (
                <motion.div
                  key={step.num}
                  drag={prefersReduced ? false : "x"}
                  dragSnapToOrigin
                  dragElastic={0.6}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragDirectionLock
                  onDragStart={() => {
                    draggedRef.current = true
                  }}
                  onDragEnd={handleDragEnd}
                  style={{ x, rotate, zIndex: slot.z }}
                  className="absolute inset-0 touch-pan-y cursor-grab active:cursor-grabbing"
                >
                  <StepCard step={step} />
                </motion.div>
              )
            }

            return (
              <div
                key={step.num}
                aria-hidden
                className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{
                  transform: `translateY(${slot.y}px) scale(${slot.scale}) rotate(${slot.rotate}deg)`,
                  opacity: slot.opacity,
                  zIndex: slot.z,
                }}
              >
                <StepCard step={step} faded />
              </div>
            )
          })}
        </div>

        {/* Hint */}
        <p className="type-caption select-none text-muted-foreground">
          {prefersReduced ? "Tap or use arrow keys to browse" : "Drag card to browse 👆"}
        </p>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, i) => (
            <button
              key={step.num}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to step ${i + 1}: ${step.q}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "rounded-full transition-all duration-300",
                i === index
                  ? "h-1.5 w-4 bg-accent/70"
                  : "h-1.5 w-1.5 bg-foreground/20 hover:bg-foreground/35"
              )}
            />
          ))}
        </div>

        {/* Screen-reader live announcement of the current step */}
        <span aria-live="polite" className="sr-only">
          {`Step ${index + 1} of ${COUNT}: ${active.q}`}
        </span>
      </div>
    </div>
  )
}

export default ApproachDeck
