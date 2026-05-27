"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import clsx from "clsx"

const DEFAULT_PHOTOS = [
  "/assets/images/1.png",
  "/assets/images/2.png",
  "/assets/images/3.png",
  "/assets/images/4.png",
  "/assets/images/5.png",
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

export default function PhotoCarousel({
  photos = DEFAULT_PHOTOS,
  captions = DEFAULT_CAPTIONS,
  interval = 3500,
  altPrefix = "Photo",
}: Props) {
  const [index, setIndex] = useState(0)
  const count = photos.length

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % count)
  }, [count])

  useEffect(() => {
    const id = setInterval(advance, interval)
    return () => clearInterval(id)
  }, [advance, interval])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[360px]">

      {/* ── STACK ── */}
      <div
        className="relative w-full aspect-[3/4] cursor-pointer"
        onClick={advance}
        title="Click to advance"
      >
        {photos.map((src, i) => {
          const pos = (i - index + count) % count

          let transform = "rotate(0deg) scale(1) translate(0px, 0px)"
          let zIndex = 0
          let opacity = 1

          if (pos === 0) {
            transform = "rotate(-1deg) scale(1) translate(0px, 0px)"
            zIndex = 30
          } else if (pos === 1) {
            transform = "rotate(3deg) scale(0.97) translate(14px, 8px)"
            zIndex = 20
            opacity = 0.9
          } else if (pos === 2) {
            transform = "rotate(6.5deg) scale(0.94) translate(28px, 16px)"
            zIndex = 10
            opacity = 0.55
          } else {
            opacity = 0
            zIndex = 0
          }

          const isActive = pos === 0
          const caption = captions[i % captions.length]

          return (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform, zIndex, opacity }}
            >
              <div className={clsx(
                "w-full h-full rounded-lg overflow-hidden",
                "bg-white dark:bg-neutral-900",
                "border border-black/[0.08] dark:border-white/[0.08]",
                "shadow-[0_4px_20px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]",
                "flex flex-col",
                isActive && "hover:-translate-y-1 transition-transform duration-300"
              )}>

                {/* IMAGE — fills most of the card */}
                <div className="flex-1 overflow-hidden m-2.5 mb-0 rounded-md">
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={`${altPrefix} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* CAPTION — handwritten style */}
                <div className="h-[46px] flex items-center justify-center px-3">
                  {isActive && (
                    <span
                      className="text-[19px] text-black/60 dark:text-white/50 select-none"
                      style={{
                        fontFamily: "var(--font-caveat)",
                        transform: "rotate(-1.5deg)",
                        display: "inline-block",
                      }}
                    >
                      {caption}
                    </span>
                  )}
                </div>

              </div>
            </div>
          )
        })}
      </div>

      {/* ── DOT INDICATORS ── */}
      <div className="flex items-center gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to photo ${i + 1}`}
            className={clsx(
              "rounded-full transition-all duration-300",
              i === index
                ? "w-4 h-1.5 bg-foreground/50"
                : "w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/35"
            )}
          />
        ))}
      </div>

    </div>
  )
}
