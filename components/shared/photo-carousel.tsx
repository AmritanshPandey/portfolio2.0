"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import clsx from "clsx"

const DEFAULT_PHOTOS = [
  "/assets/images/2.webp",
  "/assets/images/4.webp",
  "/assets/images/3.webp",
  "/assets/images/5.webp",
  "/assets/images/1.webp",
]

const DEFAULT_CAPTIONS = [
  "somewhere new",
  "cooking something",
  "on the road",
  "long bike rides",
  "off the clock",
]

type Props = {
  photos?: string[]
  captions?: string[]
  interval?: number
  altPrefix?: string
}

/**
 * One plate, captioned like a figure. Photos cross-dissolve in place; the
 * caption and a counter sit underneath in the mono. Autoplay pauses off
 * screen and never runs under reduced motion; the ticks pick a photo directly.
 */
export default function PhotoCarousel({
  photos = DEFAULT_PHOTOS,
  captions = DEFAULT_CAPTIONS,
  interval = 4500,
  altPrefix = "Photo",
}: Props) {
  const [index, setIndex] = useState(0)
  // Photos fetched so far: the one showing and the next, then each as it
  // comes up, so the plate loads one photo ahead instead of all at once.
  const [loaded, setLoaded] = useState(() => new Set([0, 1 % photos.length]))
  const rootRef = useRef<HTMLDivElement>(null)
  const count = photos.length

  // Updated while rendering, as soon as the index moves (no extra pass).
  const ahead = (index + 1) % count
  if (!loaded.has(index) || !loaded.has(ahead)) setLoaded(new Set([...loaded, index, ahead]))

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % count)
  }, [count])

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let timer: number | null = null
    const start = () => { if (timer === null) timer = window.setInterval(advance, interval) }
    const stop = () => { if (timer !== null) { window.clearInterval(timer); timer = null } }
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    io.observe(root)
    return () => { io.disconnect(); stop() }
  }, [advance, interval])

  return (
    <div ref={rootRef} className="w-full max-w-[420px]">
      <button
        type="button"
        onClick={advance}
        aria-label="Next photo"
        className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden bg-surface-2"
      >
        {photos.map((src, i) => loaded.has(i) && (
          <Image
            key={src}
            src={src}
            alt={`${altPrefix} ${i + 1}`}
            fill
            sizes="(max-width: 767px) 90vw, 420px"
            className={clsx(
              "object-cover transition-opacity duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </button>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="ledger-label">
          <span className="text-foreground">{String(index + 1).padStart(2, "0")}</span>
          {" / "}
          {String(count).padStart(2, "0")}
          <span className="ml-3">{captions[index % captions.length]}</span>
        </p>

        <div className="flex items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className="group/tick -m-1 p-1"
            >
              <span
                className={clsx(
                  "block h-2 w-2 transition-colors duration-200",
                  i === index ? "bg-foreground" : "bg-foreground/20 group-hover/tick:bg-foreground/45",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
