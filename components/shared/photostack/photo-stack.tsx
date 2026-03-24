"use client"

import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import Image from "next/image"

type Props = {
  photos?: string[]
}

export type CarouselRef = {
  next: () => void
  prev: () => void
}

const PhotoStackCarousel = forwardRef<CarouselRef, Props>(
  ({ photos = [] }, ref) => {
    const [index, setIndex] = useState(0)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)

    // ── Auto rotate
    useEffect(() => {
      if (!photos.length) return

      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % photos.length)
      }, 3800)

      return () => clearInterval(interval)
    }, [photos.length])

    // ── Controls
    useImperativeHandle(ref, () => ({
      next: () => setIndex((prev) => (prev + 1) % photos.length),
      prev: () =>
        setIndex((prev) => (prev - 1 + photos.length) % photos.length),
    }))

    // ── Mouse parallax
    const handleMove = (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      setOffset({
        x: x * 8,
        y: y * 8,
      })
    }

    const resetOffset = () => setOffset({ x: 0, y: 0 })

    if (!photos.length) return null

    const transforms = [
      "translate-x-0 translate-y-0 rotate-0 scale-100 z-30",
      "translate-x-3 translate-y-1 rotate-[2deg] scale-[0.97] z-20",
      "translate-x-6 translate-y-2 rotate-[4deg] scale-[0.95] z-10",
      "translate-x-8 translate-y-3 rotate-[6deg] scale-[0.93] z-0 opacity-40",
    ]

    return (
      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={resetOffset}
        className="relative w-[220px] sm:w-[260px] md:w-[300px] lg:w-[320px] aspect-square sm:aspect-[3/4]"
      >
        {photos.map((src, i) => {
          const position = (i - index + photos.length) % photos.length
          const isActive = position === 0

          return (
            <div
              key={i}
              className={`
                absolute inset-0 origin-bottom
                transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${position < transforms.length ? transforms[position] : "opacity-0"}
              `}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px)`,
              }}
            >
              {/* CARD */}
              <div
                className={`
                  relative w-full h-full rounded-xl p-2.5 md:p-3

                  bg-card
                  dark:bg-gradient-to-b dark:from-white/[0.05] dark:to-white/[0.015]

                  border border-black/[0.06]
                  dark:border-white/[0.08]

                  ${isActive ? "dark:border-white/[0.14] border-black/[0.08]" : ""}

                  before:absolute before:inset-0 before:rounded-xl
                  before:ring-1 before:ring-inset
                  before:ring-black/[0.04]
                  dark:before:ring-white/[0.06]

                  ${isActive ? "dark:before:ring-white/[0.10]" : ""}

                  shadow-[0_6px_20px_rgba(0,0,0,0.04)]
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)]

                  ${isActive
                    ? "dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                    : ""}

                  transition-all duration-500
                  ${isActive ? "blur-0 scale-100" : "blur-[0.5px] scale-[0.985]"}
                `}
              >
                {/* IMAGE */}
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  {/* inner edge */}
                  <div className="absolute inset-0 rounded-md pointer-events-none ring-1 ring-inset ring-black/[0.03] dark:ring-white/[0.05]" />

                  <Image
                    src={src}
                    alt="About"
                    fill
                    sizes="(max-width:768px) 70vw, 320px"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

PhotoStackCarousel.displayName = "PhotoStackCarousel"

export default PhotoStackCarousel