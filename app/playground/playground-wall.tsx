"use client"

import Image from "next/image"
import { type PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import {
  InfiniteImageWall,
  type InfiniteWallItem,
} from "@/components/gallery/infinite-image-wall"
import { cn } from "@/lib/utils"

const WALL_CELL_WIDTH = 1680
const WALL_CELL_HEIGHT = 1000
const TILE_SIZE = 210
const GRID_X = [140, 420, 700, 980, 1260, 1540] as const
const GRID_Y = [130, 380, 630, 880] as const

const PLACEHOLDER_IMAGES = [
  {
    title: "Agent commerce",
    src: "/assets/images/work/agent-commerce.jpg",
    group: "client-work",
  },
  {
    title: "White label platform",
    src: "/assets/images/work/white-label-platform.jpg",
    group: "client-work",
  },
  {
    title: "Commerce platform",
    src: "/assets/images/work/commerce-platform.jpg",
    group: "client-work",
  },
  {
    title: "Fintech AI system",
    src: "/assets/images/work/fintech-ai-system.jpg",
    group: "systems",
  },
  {
    title: "Sneaker commerce",
    src: "/assets/images/work/sneaker-commerce.jpg",
    group: "explorations",
  },
  {
    title: "Skincare planner",
    src: "/assets/images/work/skincare-planner.jpg",
    group: "explorations",
  },
  {
    title: "Execution system",
    src: "/assets/images/work/execution-system.jpg",
    group: "explorations",
  },
  {
    title: "Design tokens",
    src: "/assets/images/work/design-tokens.jpg",
    group: "systems",
  },
  {
    title: "AI decision engine",
    src: "/assets/images/work/ai-decision-engine.jpg",
    group: "systems",
  },
] as const

type PlaygroundImage = (typeof PLACEHOLDER_IMAGES)[number]

const CAROUSEL_SLOTS = [
  {
    offset: -2,
    x: "clamp(-50rem, -52vw, -25rem)",
    y: "0rem",
    z: "-220px",
    width: "clamp(11rem, 18vw, 18rem)",
    rotateY: 34,
    rotateZ: -11,
    scale: 0.78,
    opacity: 0.48,
    zIndex: 6,
  },
  {
    offset: -1,
    x: "clamp(-25rem, -26vw, -14rem)",
    y: "0.25rem",
    z: "-80px",
    width: "clamp(16rem, 24vw, 23rem)",
    rotateY: 17,
    rotateZ: 12,
    scale: 0.94,
    opacity: 0.92,
    zIndex: 14,
  },
  {
    offset: 0,
    x: "0rem",
    y: "0rem",
    z: "0px",
    width: "clamp(15rem, 23vw, 19rem)",
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    opacity: 1,
    zIndex: 22,
  },
  {
    offset: 1,
    x: "clamp(14rem, 26vw, 25rem)",
    y: "0.4rem",
    z: "-80px",
    width: "clamp(16rem, 24vw, 23rem)",
    rotateY: -17,
    rotateZ: -12,
    scale: 0.94,
    opacity: 0.92,
    zIndex: 14,
  },
  {
    offset: 2,
    x: "clamp(25rem, 52vw, 50rem)",
    y: "0rem",
    z: "-220px",
    width: "clamp(11rem, 18vw, 18rem)",
    rotateY: -34,
    rotateZ: 11,
    scale: 0.78,
    opacity: 0.48,
    zIndex: 6,
  },
] as const

function wrapIndex(index: number, length: number) {
  return (index + length) % length
}

function grid(row: number, col: number) {
  return {
    x: GRID_X[col] - TILE_SIZE / 2,
    y: GRID_Y[row] - TILE_SIZE / 2,
    width: TILE_SIZE,
    height: TILE_SIZE,
  }
}

const WALL_ITEMS: InfiniteWallItem[] = Array.from(
  { length: GRID_Y.length * GRID_X.length },
  (_, index) => {
    const row = Math.floor(index / GRID_X.length)
    const col = index % GRID_X.length
    const image = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]

    return {
      id: `wall-image-${index + 1}`,
      title: image.title,
      src: image.src,
      alt: "",
      ...grid(row, col),
      priority: index < 6,
    }
  }
)

function relatedItems(startIndex: number) {
  const active = PLACEHOLDER_IMAGES[startIndex]
  return PLACEHOLDER_IMAGES.filter((image) => image.group === active.group)
}

function relatedIndex(items: readonly PlaygroundImage[], sourceIndex: number) {
  const source = PLACEHOLDER_IMAGES[sourceIndex]
  return Math.max(0, items.findIndex((item) => item.src === source.src))
}

function GridViewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
      className="fixed bottom-8 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-3 rounded-xl border border-white/10 bg-white/18 px-5 py-3 text-sm font-semibold uppercase tracking-normal text-white backdrop-blur transition-colors hover:bg-white/24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <span className="grid size-7 grid-cols-2 gap-1" aria-hidden="true">
        <span className="rounded-[3px] border border-white/40 bg-white/18" />
        <span className="rounded-[3px] border border-white/40 bg-white/18" />
        <span className="rounded-[3px] border border-white/40 bg-white/18" />
        <span className="rounded-[3px] border border-white/40 bg-white/18" />
      </span>
      Grid view
    </button>
  )
}

function CarouselNavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "previous" | "next"
  onClick: () => void
  disabled?: boolean
}) {
  const Icon = direction === "previous" ? IconArrowLeft : IconArrowRight

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
      disabled={disabled}
      aria-label={direction === "previous" ? "Previous related image" : "Next related image"}
      className={cn(
        "flex size-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/80 backdrop-blur-md transition-colors",
        "hover:border-white/24 hover:bg-white/[0.12] hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/12 disabled:hover:bg-white/[0.05]"
      )}
    >
      <Icon className="size-5" stroke={1.8} aria-hidden />
    </button>
  )
}

export function PlaygroundWall() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const dragStart = useRef<number | null>(null)
  const dragged = useRef(false)
  const carouselItems = useMemo(
    () => relatedItems(activeIndex ?? 0),
    [activeIndex]
  )
  const carouselStageItems = useMemo(
    () =>
      CAROUSEL_SLOTS.map((slot) => {
        const itemIndex = wrapIndex(carouselIndex + slot.offset, carouselItems.length)
        return {
          slot,
          item: carouselItems[itemIndex],
          itemIndex,
        }
      }),
    [carouselIndex, carouselItems]
  )
  const canNavigate = carouselItems.length > 1

  const goToCarouselIndex = useCallback((nextIndex: number) => {
    if (carouselItems.length === 0) return

    setCarouselIndex(wrapIndex(nextIndex, carouselItems.length))
  }, [carouselItems.length])

  const previous = useCallback(() => {
    goToCarouselIndex(carouselIndex - 1)
  }, [carouselIndex, goToCarouselIndex])

  const next = useCallback(() => {
    goToCarouselIndex(carouselIndex + 1)
  }, [carouselIndex, goToCarouselIndex])

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null)
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        previous()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        next()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeIndex, next, previous])

  function openCarousel(item: InfiniteWallItem) {
    const index = PLACEHOLDER_IMAGES.findIndex((image) => image.src === item.src)
    const nextActiveIndex = index >= 0 ? index : 0
    const nextItems = relatedItems(nextActiveIndex)

    setActiveIndex(nextActiveIndex)
    setCarouselIndex(relatedIndex(nextItems, nextActiveIndex))
  }

  function onCarouselPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragStart.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onCarouselPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = dragStart.current
    dragStart.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (start === null || !canNavigate) return

    const delta = event.clientX - start
    if (Math.abs(delta) < 42) return

    dragged.current = true
    if (delta > 0) previous()
    else next()
  }

  if (activeIndex !== null) {
    return (
      <div
        className="relative h-full min-h-full overflow-hidden bg-black text-white"
        onPointerDown={onCarouselPointerDown}
        onPointerUp={onCarouselPointerUp}
        onPointerCancel={() => {
          dragStart.current = null
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.055),transparent_26%),linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.72)_82%)]"
        />
        <div aria-hidden className="absolute left-1/2 top-[14%] z-20 size-6 -translate-x-1/2 rounded-full bg-white/90" />

        <div className="absolute inset-x-0 top-[24%] h-[46vh] min-h-[22rem] [perspective:1400px] sm:top-[23%] lg:top-[21%]">
          {carouselStageItems.map(({ item, itemIndex, slot }) => {
            const isActive = slot.offset === 0
            return (
              <button
                key={`${slot.offset}-${item.src}`}
                type="button"
                onClick={() => {
                  if (dragged.current) {
                    dragged.current = false
                    return
                  }

                  setCarouselIndex(itemIndex)
                }}
                aria-label={`View ${item.title}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "absolute left-1/2 top-1/2 aspect-[4/3] -translate-x-1/2 -translate-y-1/2 overflow-hidden border bg-white/[0.08] transition-[opacity,transform,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                  isActive ? "rounded-[1.4rem] border-white/24" : "rounded-[1.25rem] border-white/10 hover:border-white/22"
                )}
                style={{
                  width: slot.width,
                  opacity: slot.opacity,
                  transform: [
                    `translate3d(calc(-50% + ${slot.x}), calc(-50% + ${slot.y}), ${slot.z})`,
                    `rotateY(${slot.rotateY}deg)`,
                    `rotateZ(${slot.rotateZ}deg)`,
                    `scale(${slot.scale})`,
                  ].join(" "),
                  zIndex: slot.zIndex,
                }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  draggable={false}
                  sizes="(min-width: 1280px) 24vw, (min-width: 768px) 34vw, 62vw"
                  className="object-cover"
                  priority={Math.abs(slot.offset) <= 1}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.28),transparent_46%)]"
                />
              </button>
            )
          })}
        </div>

        <div className="fixed inset-x-0 bottom-24 z-30 flex items-center justify-center gap-3 px-5 md:top-1/2 md:bottom-auto md:-translate-y-1/2 md:justify-between md:gap-0 md:px-6">
          <CarouselNavButton direction="previous" onClick={previous} disabled={!canNavigate} />
          <CarouselNavButton direction="next" onClick={next} disabled={!canNavigate} />
        </div>

        <GridViewButton onClick={() => setActiveIndex(null)} />
      </div>
    )
  }

  return (
    <InfiniteImageWall
      items={WALL_ITEMS}
      onOpen={openCarousel}
      cellWidth={WALL_CELL_WIDTH}
      cellHeight={WALL_CELL_HEIGHT}
      showCaptions={false}
      className="h-full min-h-full"
    />
  )
}
