"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { EXPERIMENTS, type Experiment } from "./experiments"
import { PanSheet } from "./pan-sheet"

/* Each experiment is pinned to the sheet once, read left to right in two
   rows: the ones that power a case study or an essay first. Every other
   column hangs half a tile lower, so the sheet reads as a pinboard rather
   than a grid of cards. */
const ROWS = [
  ["brand-skins", "attention", "color-scale", "frontier", "constellation"],
  ["theme-split", "flow-diagram", "info-architecture", "curved-marquee"],
]

const TILE_W = 300
const TILE_H = 340
const POSTER_H = 225
const GAP_X = 64
const GAP_Y = 72
const DROP = (TILE_H + GAP_Y) / 2

const COLUMNS = Math.max(...ROWS.map((row) => row.length))
const SHEET_W = COLUMNS * TILE_W + (COLUMNS - 1) * GAP_X
const SHEET_H = ROWS.length * TILE_H + (ROWS.length - 1) * GAP_Y + DROP

const TILES = ROWS.flatMap((row, r) =>
  row.map((id, c) => {
    const experiment = EXPERIMENTS.find((e) => e.id === id)
    if (!experiment) throw new Error(`No experiment "${id}"`)
    return {
      experiment,
      left: c * (TILE_W + GAP_X),
      top: r * (TILE_H + GAP_Y) + (c % 2 ? DROP : 0),
    }
  }),
)

function Tile({
  experiment,
  index,
  left,
  top,
  onOpen,
}: {
  experiment: Experiment
  index: number
  left: number
  top: number
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-lab-tile={experiment.id}
      data-cursor-card
      data-cursor-label="Open"
      className="group absolute flex flex-col overflow-hidden rounded-[3px] border border-border bg-card text-left transition-[border-color] duration-200 hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      style={{ left, top, width: TILE_W, height: TILE_H }}
    >
      <div className="relative w-full shrink-0 border-b border-border" style={{ height: POSTER_H }}>
        {experiment.poster}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-4">
        <p className="type-meta flex gap-3">
          <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <span>{experiment.kind}</span>
        </p>
        <p className="type-list-title text-foreground transition-colors duration-200 group-hover:text-accent">
          {experiment.title}
        </p>
        {experiment.usedIn && <p className="type-meta mt-auto truncate">Used in {experiment.usedIn.label}</p>}
      </div>
    </button>
  )
}

export function PlaygroundWall() {
  const [experiment, setExperiment] = useState<Experiment | null>(null)

  // Panning sideways on a trackpad must not swipe the browser back a page.
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

    // Only sideways swipes are held back; the sheet handles its own wheel
    // events, and the page above it still scrolls on a short screen.
    const stopTrackpadHistorySwipe = (event: WheelEvent) => {
      if (event.ctrlKey || !event.cancelable) return

      if (Math.abs(event.deltaX) > 12 && Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        lastTrackpadSwipeAt = performance.now()
        armHistoryGuard()
        event.preventDefault()
      }
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
    <Dialog open={Boolean(experiment)} onOpenChange={(open) => !open && setExperiment(null)}>
      <PanSheet width={SHEET_W} height={SHEET_H} padY={40} label="Experiments">
        {TILES.map((tile, i) => (
          <Tile key={tile.experiment.id} {...tile} index={i} onOpen={() => setExperiment(tile.experiment)} />
        ))}
      </PanSheet>

      {experiment && (
        <DialogContent className="max-h-[calc(100svh-2rem)] max-w-[min(94vw,76rem)] gap-0 overflow-hidden rounded-[4px] border border-border bg-background p-0 text-foreground ring-0 sm:max-w-[min(94vw,76rem)]">
          <div className="grid max-h-[calc(100svh-2rem)] overflow-y-auto md:grid-cols-[minmax(0,1fr)_20rem] md:overflow-hidden">
            {/* Live stage: on the page's own paper, as the piece sits in place. */}
            <div className="min-h-[50vh] overflow-auto bg-background p-4 sm:p-6 md:max-h-[calc(100svh-2rem)]">
              <experiment.Live />
            </div>

            <div className="flex min-h-0 flex-col justify-between gap-8 border-t border-border bg-card p-6 md:border-l md:border-t-0 md:p-8">
              <DialogHeader className="gap-4">
                <p className="type-meta">{experiment.kind}</p>
                <DialogTitle className="text-[clamp(1.75rem,2.6vw,2.375rem)] font-[750] leading-none tracking-[-0.03em] text-foreground [font-variation-settings:'wdth'_110] [text-wrap:balance]">
                  {experiment.title}
                </DialogTitle>
                <DialogDescription className="type-card-body text-muted-foreground">
                  {experiment.note}
                </DialogDescription>
              </DialogHeader>

              {experiment.usedIn && (
                <div className="border-t border-border pt-5">
                  <p className="type-meta">Used in</p>
                  <Link
                    href={experiment.usedIn.href}
                    className="link-underline type-cta mt-2 inline-block text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {experiment.usedIn.label}
                    <IconArrowUpRight size={14} aria-hidden className="ml-1 inline-block align-[-1px]" />
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
