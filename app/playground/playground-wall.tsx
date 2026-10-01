"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

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

import { EXPERIMENTS } from "./experiments"

const WALL_CELL_WIDTH = 1680
const WALL_CELL_HEIGHT = 1000
const TILE_SIZE = 210
const GRID_X = [140, 420, 700, 980, 1260, 1540] as const
const GRID_Y = [130, 380, 630, 880] as const

function grid(row: number, col: number) {
  return {
    x: GRID_X[col] - TILE_SIZE / 2,
    y: GRID_Y[row] - TILE_SIZE / 2,
    width: TILE_SIZE,
    height: TILE_SIZE,
  }
}

/* Offsetting each row by two keeps the same experiment from stacking in a
   column (9 experiments over a 6-wide grid would otherwise line up). */
const WALL_ITEMS: InfiniteWallItem[] = Array.from(
  { length: GRID_Y.length * GRID_X.length },
  (_, index) => {
    const row = Math.floor(index / GRID_X.length)
    const col = index % GRID_X.length
    const experiment = EXPERIMENTS[(index + row * 2) % EXPERIMENTS.length]
    return {
      id: `wall-${experiment.id}-${index}`,
      title: experiment.title,
      meta: experiment.kind,
      cover: experiment.poster,
      ...grid(row, col),
    }
  }
)

const experimentFor = (item: InfiniteWallItem) =>
  EXPERIMENTS.find((e) => item.id.startsWith(`wall-${e.id}-`))

export function PlaygroundWall() {
  const [activeItem, setActiveItem] = useState<InfiniteWallItem | null>(null)
  const experiment = activeItem ? experimentFor(activeItem) : undefined

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
        showCaptions
        className="h-full min-h-full"
      />

      {experiment && (
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[min(94vw,76rem)] gap-0 overflow-hidden rounded-[2rem] border border-white/12 bg-[#050505] p-0 text-white ring-1 ring-white/10 sm:max-w-[min(94vw,76rem)]">
          <div className="grid max-h-[calc(100vh-2rem)] overflow-y-auto md:grid-cols-[minmax(0,1fr)_20rem] md:overflow-hidden">
            {/* Live stage — site-themed so the component renders as it does in place */}
            <div className="min-h-[50vh] overflow-auto bg-background p-4 text-foreground sm:p-6 md:max-h-[calc(100vh-2rem)]">
              <experiment.Live />
            </div>

            <div className="flex min-h-0 flex-col justify-between gap-8 border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8">
              <DialogHeader className="gap-4">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                  {experiment.kind}
                </p>
                <DialogTitle className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[0.98] tracking-tight text-white">
                  {experiment.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-white/62">
                  {experiment.note}
                </DialogDescription>
              </DialogHeader>

              {experiment.usedIn && (
                <div className="border-t border-white/10 pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
                    Used in
                  </p>
                  <Link
                    href={experiment.usedIn.href}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white/85 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                  >
                    {experiment.usedIn.label}
                    <IconArrowUpRight size={14} aria-hidden />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
