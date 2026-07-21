"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import {
  InfiniteImageWall,
  type InfiniteWallItem,
} from "@/components/gallery/infinite-image-wall"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const WALL_CELL_WIDTH = 1680
const WALL_CELL_HEIGHT = 1000
const TILE_SIZE = 210
const GRID_X = [140, 420, 700, 980, 1260, 1540] as const
const GRID_Y = [130, 380, 630, 880] as const

const PLACEHOLDER_IMAGES = [
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

function formatGroup(group?: PlaygroundImage["group"]) {
  if (!group) return "Playground"

  return group
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function PlaygroundWall() {
  const [activeItem, setActiveItem] = useState<InfiniteWallItem | null>(null)
  const activeImage = activeItem
    ? PLACEHOLDER_IMAGES.find((image) => image.src === activeItem.src)
    : null

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const previousRootOverscroll = root.style.overscrollBehavior
    const previousRootOverscrollX = root.style.overscrollBehaviorX
    const previousBodyOverscroll = body.style.overscrollBehavior
    const previousBodyOverscrollX = body.style.overscrollBehaviorX

    root.style.overscrollBehavior = "none"
    root.style.overscrollBehaviorX = "none"
    body.style.overscrollBehavior = "none"
    body.style.overscrollBehaviorX = "none"

    let historyGuardArmed = false
    let lastTrackpadSwipeAt = 0

    const guardedHistoryState = () => {
      const currentState = window.history.state
      const state =
        currentState && typeof currentState === "object" ? currentState : {}

      return {
        ...state,
        __playgroundBackGestureGuard: true,
      }
    }

    const armHistoryGuard = () => {
      if (historyGuardArmed) return

      window.history.pushState(guardedHistoryState(), "", window.location.href)
      historyGuardArmed = true
    }

    const onPopState = () => {
      const isRecentTrackpadSwipe = performance.now() - lastTrackpadSwipeAt < 1600

      if (isRecentTrackpadSwipe) {
        window.history.pushState(guardedHistoryState(), "", window.location.href)
        historyGuardArmed = true
        return
      }

      historyGuardArmed = false
      window.removeEventListener("popstate", onPopState)
      window.history.back()
    }

    const stopTrackpadHistorySwipe = (event: WheelEvent) => {
      if (event.ctrlKey || !event.cancelable) return

      if (Math.abs(event.deltaX) > 12 && Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        lastTrackpadSwipeAt = performance.now()
        armHistoryGuard()
      }

      event.preventDefault()
    }

    window.addEventListener("popstate", onPopState)
    window.addEventListener("wheel", stopTrackpadHistorySwipe, {
      capture: true,
      passive: false,
    })

    return () => {
      window.removeEventListener("wheel", stopTrackpadHistorySwipe, {
        capture: true,
      })
      window.removeEventListener("popstate", onPopState)
      root.style.overscrollBehavior = previousRootOverscroll
      root.style.overscrollBehaviorX = previousRootOverscrollX
      body.style.overscrollBehavior = previousBodyOverscroll
      body.style.overscrollBehaviorX = previousBodyOverscrollX
    }
  }, [])

  return (
    <Dialog
      open={Boolean(activeItem)}
      onOpenChange={(open) => {
        if (!open) {
          setActiveItem(null)
        }
      }}
    >
      <InfiniteImageWall
        items={WALL_ITEMS}
        onOpen={setActiveItem}
        cellWidth={WALL_CELL_WIDTH}
        cellHeight={WALL_CELL_HEIGHT}
        showCaptions={false}
        className="h-full min-h-full"
      />

      {activeItem && (
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[min(92vw,56rem)] gap-0 overflow-hidden rounded-[2rem] border border-white/12 bg-[#050505] p-0 text-white ring-1 ring-white/10 sm:max-w-[min(92vw,56rem)]">
          <div className="grid overflow-hidden md:grid-cols-[minmax(0,34rem)_20rem]">
            <div className="relative aspect-square overflow-hidden bg-white/[0.06]">
              <Image
                src={activeItem.src}
                alt={activeItem.title}
                fill
                draggable={false}
                sizes="(min-width: 1024px) 64vw, 92vw"
                className="object-cover"
                priority
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.22),transparent_42%)]"
              />
            </div>

            <div className="flex min-h-0 flex-col justify-between gap-8 border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8">
              <DialogHeader className="gap-4">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                  {formatGroup(activeImage?.group)}
                </p>
                <DialogTitle className="max-w-[11ch] text-[clamp(28px,4vw,46px)] font-semibold leading-[0.98] tracking-tight text-white">
                  {activeItem.title}
                </DialogTitle>
                <DialogDescription className="max-w-[24ch] text-sm leading-relaxed text-white/58">
                  Component preview from the playground wall.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                    Format
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/78">Image card</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                    Source
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/78">Work archive</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
