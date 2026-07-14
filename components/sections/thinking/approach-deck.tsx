"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  animate,
  motion,
  useInView,
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
    q: "Identify what cannot move",
    icon: IconViewfinder,
    body: "Set the fixed points first so the team knows where there is room to move.",
  },
  {
    num: "02",
    q: "Map the moving parts",
    icon: IconSitemap,
    body: "See the flows, handoffs, dependencies, and edge cases before committing to a screen.",
  },
  {
    num: "03",
    q: "Choose the smallest proof",
    icon: IconScissors,
    body: "Build the smallest version that proves the decision, not the fullest expression of it.",
  },
  {
    num: "04",
    q: "Prototype the risk",
    icon: IconBolt,
    body: "Use the right fidelity for the unknown: sketch, Figma, content, code, or a demo.",
  },
  {
    num: "05",
    q: "Make alignment concrete",
    icon: IconUsers,
    body: "Turn debate into a shared artifact: a rule, flow, token model, prototype, or implementation note.",
  },
  {
    num: "06",
    q: "Systematize what works",
    icon: IconStack2,
    body: "Promote proven decisions into components, templates, documentation, and governance.",
  },
]

const COUNT = STEPS.length
const THRESHOLD = 110 // px of horizontal offset to commit a cycle
const V_THRESHOLD = 500 // px/s flick velocity to commit
const AUTO_SWIPE_INTERVAL = 4200
const MANUAL_PAUSE_MS = 8000

/** Per-slot transform for the cards behind the front one. */
const SLOTS = [
  { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, z: 30 }, // pos 0 (front)
  { x: 12, y: 12, scale: 0.96, rotate: 2, opacity: 0.85, z: 20 }, // pos 1
  { x: -10, y: 24, scale: 0.92, rotate: -3, opacity: 0.55, z: 10 }, // pos 2
  { x: 0, y: 30, scale: 0.9, rotate: 0, opacity: 0, z: 0 }, // pos >= 3 (hidden)
] as const

const SLOT_TRANSITION = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],
} as const

const TUCK_TRANSITION = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1],
} as const

interface OutgoingCard {
  id: number
  step: Step
  dir: -1 | 1
  x: number
  targetX: number
  rotate: number
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function StepCard({ step, faded }: { step: Step; faded?: boolean }) {
  const Icon = step.icon
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] bg-card p-5 md:p-6",
        "ring-1 ring-foreground/[0.08] dark:ring-white/[0.08]",
        "shadow-[0_18px_44px_-24px_rgba(0,0,0,0.35)] will-change-transform"
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="bg-accent-wash flex size-10 items-center justify-center rounded-xl text-accent ring-1 ring-accent/20 md:size-11"
        >
          <Icon className="size-5" stroke={1.75} aria-hidden />
        </span>
        <span
          aria-hidden
          className="select-none font-mono text-[42px] font-semibold leading-none text-accent/10 dark:text-accent/15 md:text-[46px]"
        >
          {step.num}
        </span>
      </div>

      <div className="mt-auto pt-7">
        <p className="type-card-title text-foreground">{step.q}</p>
        <p className={cn("type-card-body mt-2.5 text-muted-foreground", faded && "opacity-90")}>
          {step.body}
        </p>
      </div>
    </div>
  )
}

export function ApproachDeck() {
  const [index, setIndex] = useState(0)
  const [outgoing, setOutgoing] = useState<OutgoingCard | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isDocumentVisible, setIsDocumentVisible] = useState(true)
  const [manualPauseUntil, setManualPauseUntil] = useState(0)
  const prefersReduced = useReducedMotion()

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-14, 0, 14])

  // Guards a click from firing after a real drag (framer fires a click on release).
  const draggedRef = useRef(false)
  const pointerFocusRef = useRef(false)
  const outgoingIdRef = useRef(0)
  const deckRef = useRef<HTMLDivElement>(null)
  const isDeckInView = useInView(deckRef, { amount: 0.35 })

  useEffect(() => {
    const updateVisibility = () => {
      setIsDocumentVisible(document.visibilityState === "visible")
    }

    updateVisibility()
    document.addEventListener("visibilitychange", updateVisibility)

    return () => document.removeEventListener("visibilitychange", updateVisibility)
  }, [])

  const resetDrag = useCallback(() => {
    x.stop()
    x.set(0)
  }, [x])

  const markManualInteraction = useCallback(() => {
    setManualPauseUntil(performance.now() + MANUAL_PAUSE_MS)
  }, [])

  const goTo = useCallback((i: number) => {
    setIndex(((i % COUNT) + COUNT) % COUNT)
    setOutgoing(null)
    resetDrag()
  }, [resetDrag])

  const advance = useCallback((options?: { keepOutgoing?: boolean }) => {
    setIndex((i) => (i + 1) % COUNT)
    if (!options?.keepOutgoing) setOutgoing(null)
    resetDrag()
  }, [resetDrag])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + COUNT) % COUNT)
    setOutgoing(null)
    resetDrag()
  }, [resetDrag])

  const commitOutgoing = useCallback(
    ({
      dir,
      x: releaseX,
      targetX,
      rotate: releaseRotate,
    }: Omit<OutgoingCard, "id" | "step">) => {
      setOutgoing({
        id: outgoingIdRef.current + 1,
        step: STEPS[index],
        dir,
        x: releaseX,
        targetX,
        rotate: releaseRotate,
      })
      outgoingIdRef.current += 1
      advance({ keepOutgoing: true })
    },
    [advance, index]
  )

  const cycleForward = useCallback(
    (options?: { auto?: boolean }) => {
      if (!options?.auto) {
        markManualInteraction()
      }

      if (outgoing) return

      if (prefersReduced) {
        advance()
        return
      }

      const dir = -1
      const deckRect = deckRef.current?.getBoundingClientRect()
      const minSafeX = deckRect ? -deckRect.left + 2 : -170
      const maxSafeX = deckRect ? window.innerWidth - deckRect.right - 2 : 170
      const releaseX = clamp(
        dir * THRESHOLD,
        Math.max(-170, minSafeX),
        Math.min(170, maxSafeX)
      )
      const targetX = clamp(dir * 34, minSafeX, maxSafeX)
      const releaseRotate = clamp((releaseX / 200) * 14, -14, 14)

      commitOutgoing({
        dir,
        x: releaseX,
        targetX,
        rotate: releaseRotate,
      })
    },
    [advance, commitOutgoing, markManualInteraction, outgoing, prefersReduced]
  )

  useEffect(() => {
    if (
      prefersReduced ||
      !isDeckInView ||
      !isDocumentVisible ||
      isHovered ||
      isFocused ||
      isDragging ||
      outgoing
    ) {
      return
    }

    const pauseRemaining = Math.max(0, manualPauseUntil - performance.now())
    const timeout = window.setTimeout(
      () => cycleForward({ auto: true }),
      pauseRemaining > 0 ? pauseRemaining : AUTO_SWIPE_INTERVAL
    )

    return () => window.clearTimeout(timeout)
  }, [
    cycleForward,
    isDeckInView,
    isDocumentVisible,
    isDragging,
    isFocused,
    isHovered,
    manualPauseUntil,
    outgoing,
    prefersReduced,
  ])

  const handleDragEnd = useCallback(
    (_e: unknown, info: PanInfo) => {
      setIsDragging(false)

      const offX = info.offset.x
      const velX = info.velocity.x
      const committed = Math.abs(offX) > THRESHOLD || Math.abs(velX) > V_THRESHOLD
      if (!committed) {
        animate(x, 0, {
          type: "spring",
          stiffness: 260,
          damping: 30,
          velocity: velX,
        })
        return
      }

      const dir = (offX || velX) < 0 ? -1 : 1
      const deckRect = deckRef.current?.getBoundingClientRect()
      const minSafeX = deckRect ? -deckRect.left + 2 : -170
      const maxSafeX = deckRect ? window.innerWidth - deckRect.right - 2 : 170
      const releaseX = clamp(x.get() || offX || dir * THRESHOLD, Math.max(-170, minSafeX), Math.min(170, maxSafeX))
      const targetX = clamp(dir * 34, minSafeX, maxSafeX)
      const releaseRotate = clamp((releaseX / 200) * 14, -14, 14)

      commitOutgoing({
        dir,
        x: releaseX,
        targetX,
        rotate: releaseRotate,
      })
    },
    [commitOutgoing, x]
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "Enter":
          e.preventDefault()
          cycleForward()
          break
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          markManualInteraction()
          prev()
          break
        case "Home":
          e.preventDefault()
          markManualInteraction()
          goTo(0)
          break
      }
    },
    [cycleForward, markManualInteraction, prev, goTo]
  )

  const active = STEPS[index]

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Heading + intro — first in DOM (above the deck on mobile), right column on desktop */}
        <div className="order-1 max-w-[640px] space-y-4 lg:order-2">
          <h2 className="type-section-title text-foreground">
            Approach
          </h2>
          <p className="type-section-intro text-muted-foreground">
            A practical way to turn ambiguity into clear product decisions teams can build from.
          </p>
        </div>

        {/* Deck column */}
        <div className="order-2 flex flex-col items-center gap-6 lg:order-1">
          <div
            ref={deckRef}
            role="group"
            tabIndex={0}
            aria-roledescription="Card deck"
            aria-label="Approach steps — use the left and right arrow keys to browse"
            onKeyDown={onKeyDown}
            onPointerDown={() => {
              pointerFocusRef.current = true
              window.setTimeout(() => {
                pointerFocusRef.current = false
              }, 0)
            }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onFocus={() => {
              if (pointerFocusRef.current) {
                pointerFocusRef.current = false
                return
              }

              setIsFocused(true)
            }}
            onBlur={(event) => {
              const nextTarget = event.relatedTarget
              if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                setIsFocused(false)
              }
            }}
            onClick={() => {
              if (draggedRef.current) {
                draggedRef.current = false
                return
              }
              cycleForward()
            }}
            className="relative h-[320px] w-full max-w-[382px] cursor-pointer rounded-[1.5rem] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:h-[330px] md:h-[340px]"
          >
            {STEPS.map((step, i) => {
              const pos = (i - index + COUNT) % COUNT
              const isFront = pos === 0
              const slot = SLOTS[Math.min(pos, SLOTS.length - 1)]

              if (isFront) {
                return (
                  <motion.div
                    key={step.num}
                    animate={{
                      y: slot.y,
                      scale: slot.scale,
                      opacity: slot.opacity,
                    }}
                    transition={SLOT_TRANSITION}
                    drag={prefersReduced ? false : "x"}
                    dragElastic={0.6}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragDirectionLock
                    onDragStart={() => {
                      draggedRef.current = true
                      setIsDragging(true)
                      markManualInteraction()
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
                <motion.div
                  key={step.num}
                  aria-hidden
                  initial={false}
                  animate={{
                    x: slot.x,
                    y: slot.y,
                    scale: slot.scale,
                    rotate: slot.rotate,
                    opacity: slot.opacity,
                  }}
                  transition={SLOT_TRANSITION}
                  className="absolute inset-0 motion-reduce:transition-none"
                  style={{
                    zIndex: slot.z,
                  }}
                >
                  <StepCard step={step} faded />
                </motion.div>
              )
            })}

            {outgoing && (
              <motion.div
                key={`outgoing-${outgoing.id}`}
                aria-hidden
                initial={{
                  x: outgoing.x,
                  y: 0,
                  scale: 1,
                  rotate: outgoing.rotate,
                  opacity: 1,
                }}
                animate={{
                  x: outgoing.targetX,
                  y: SLOTS[3].y,
                  scale: SLOTS[3].scale,
                  rotate: outgoing.dir * 3,
                  opacity: 0,
                }}
                transition={TUCK_TRANSITION}
                onAnimationComplete={() => {
                  setOutgoing((current) => (current?.id === outgoing.id ? null : current))
                }}
                className="pointer-events-none absolute inset-0"
                style={{ zIndex: 15 }}
              >
                <StepCard step={outgoing.step} faded />
              </motion.div>
            )}
          </div>

          {/* Hint */}
          <p className="type-caption select-none text-muted-foreground">
            Tap, drag, or use arrow keys to browse
          </p>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  markManualInteraction()
                  goTo(i)
                }}
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
