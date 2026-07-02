"use client"

import Image from "next/image"
import { type KeyboardEvent, type PointerEvent, type WheelEvent, useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"

import { cn } from "@/lib/utils"

const DEFAULT_CELL_WIDTH = 1920
const DEFAULT_CELL_HEIGHT = 1120
const REPEAT_OFFSETS = [-1, 0, 1] as const

export type InfiniteWallItem = {
  id: string
  title: string
  meta?: string
  src: string
  alt?: string
  href?: string
  x: number
  y: number
  width: number
  height: number
  rotate?: number
  priority?: boolean
  className?: string
  imageClassName?: string
}

type InfiniteImageWallProps = {
  items: InfiniteWallItem[]
  onOpen?: (item: InfiniteWallItem) => void
  cellWidth?: number
  cellHeight?: number
  showCaptions?: boolean
  className?: string
}

function wrap(value: number, size: number) {
  let next = value % size
  if (next > 0) next -= size
  if (next <= -size) next += size
  return next
}

function WallTile({
  item,
  onOpen,
  showCaption,
}: {
  item: InfiniteWallItem
  onOpen?: (item: InfiniteWallItem) => void
  showCaption: boolean
}) {
  const isInteractive = Boolean(onOpen)

  const content = (
    <>
      <Image
        src={item.src}
        alt={item.alt ?? ""}
        fill
        priority={item.priority}
        draggable={false}
        sizes="(min-width: 1280px) 18vw, (min-width: 768px) 28vw, 54vw"
        className={cn("object-cover", item.imageClassName)}
      />

      {isInteractive && showCaption && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-5">{item.title}</p>
                {item.meta && <p className="text-[11px] font-medium text-white/62">{item.meta}</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )

  const className = cn(
    "group absolute overflow-hidden border border-white/10 bg-white/8",
    "rounded-[14px]",
    isInteractive &&
      "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d856] focus-visible:ring-offset-4 focus-visible:ring-offset-black",
    item.className
  )

  const style = {
    left: item.x,
    top: item.y,
    width: item.width,
    height: item.height,
    transform: `rotate(${item.rotate ?? 0}deg)`,
  }

  if (isInteractive) {
    return (
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => onOpen?.(item)}
        aria-label={`Open ${item.title} preview`}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={className} style={style}>
      {content}
    </div>
  )
}

export function InfiniteImageWall({
  items,
  onOpen,
  cellWidth = DEFAULT_CELL_WIDTH,
  cellHeight = DEFAULT_CELL_HEIGHT,
  showCaptions = true,
  className,
}: InfiniteImageWallProps) {
  const reduced = useReducedMotion()
  const x = useMotionValue(-360)
  const y = useMotionValue(-220)
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`
  const velocity = useRef({ x: 0, y: 0 })
  const drag = useRef({ active: false, x: 0, y: 0, time: 0, moved: false })

  useAnimationFrame((_, delta) => {
    const seconds = delta / 1000
    const driftX = reduced ? 0 : -18
    const driftY = reduced ? 0 : -8
    const nextX = x.get() + (driftX + velocity.current.x) * seconds
    const nextY = y.get() + (driftY + velocity.current.y) * seconds

    x.set(wrap(nextX, cellWidth))
    y.set(wrap(nextY, cellHeight))

    const decay = Math.pow(0.88, delta / 16.67)
    velocity.current.x *= decay
    velocity.current.y *= decay
  })

  function moveBy(deltaX: number, deltaY: number) {
    x.set(wrap(x.get() + deltaX, cellWidth))
    y.set(wrap(y.get() + deltaY, cellHeight))
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const target = event.target instanceof Element ? event.target : null
    const startedOnAction = Boolean(target?.closest("button, a"))

    drag.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
      moved: false,
    }

    if (!startedOnAction) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return

    const now = performance.now()
    const deltaX = event.clientX - drag.current.x
    const deltaY = event.clientY - drag.current.y
    const elapsed = Math.max(16, now - drag.current.time)

    if (Math.abs(deltaX) + Math.abs(deltaY) > 5) {
      drag.current.moved = true
    }

    moveBy(deltaX, deltaY)
    velocity.current = {
      x: (deltaX / elapsed) * 1000,
      y: (deltaY / elapsed) * 1000,
    }

    drag.current.x = event.clientX
    drag.current.y = event.clientY
    drag.current.time = now
  }

  function endPointer(event: PointerEvent<HTMLDivElement>) {
    drag.current.active = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    const multiplier = event.deltaMode === 1 ? 16 : 1
    const deltaX = -event.deltaX * multiplier
    const deltaY = -event.deltaY * multiplier

    moveBy(deltaX, deltaY)
    velocity.current = {
      x: deltaX * 10,
      y: deltaY * 10,
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const amount = event.shiftKey ? 120 : 56

    if (event.key === "ArrowLeft") {
      moveBy(amount, 0)
      event.preventDefault()
    } else if (event.key === "ArrowRight") {
      moveBy(-amount, 0)
      event.preventDefault()
    } else if (event.key === "ArrowUp") {
      moveBy(0, amount)
      event.preventDefault()
    } else if (event.key === "ArrowDown") {
      moveBy(0, -amount)
      event.preventDefault()
    }
  }

  function openTile(item: InfiniteWallItem) {
    if (drag.current.moved) {
      drag.current.moved = false
      return
    }

    onOpen?.(item)
  }

  return (
    <div
      role="application"
      aria-label="Infinite interface image wall"
      tabIndex={0}
      className={cn(
        "relative h-full min-h-[680px] w-full overflow-hidden bg-black text-white outline-none touch-pan-y",
        className
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(0,216,86,0.18),transparent_23%),radial-gradient(circle_at_82%_78%,rgba(24,83,255,0.18),transparent_24%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.28),transparent_22%,transparent_72%,rgba(0,0,0,0.62))]"
      />

      <motion.div className="absolute left-0 top-0 will-change-transform" style={{ transform }}>
        {REPEAT_OFFSETS.flatMap((offsetY) =>
          REPEAT_OFFSETS.map((offsetX) => (
            <div
              key={`${offsetX}-${offsetY}`}
              className="absolute left-0 top-0"
              style={{
                width: cellWidth,
                height: cellHeight,
                transform: `translate(${offsetX * cellWidth}px, ${offsetY * cellHeight}px)`,
              }}
            >
              {items.map((item) => (
                <WallTile
                  key={item.id}
                  item={item}
                  onOpen={item.src ? openTile : undefined}
                  showCaption={showCaptions}
                />
              ))}
            </div>
          ))
        )}
      </motion.div>
    </div>
  )
}
