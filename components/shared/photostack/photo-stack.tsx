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
    const containerRef = useRef<HTMLDivElement>(null)

    // magnetic state
    const [offset, setOffset] = useState({ x: 0, y: 0 })

    useEffect(() => {
      if (!photos.length) return

      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % photos.length)
      }, 3800)

      return () => clearInterval(interval)
    }, [photos.length])

    useImperativeHandle(ref, () => ({
      next: () => setIndex((prev) => (prev + 1) % photos.length),
      prev: () =>
        setIndex((prev) =>
          (prev - 1 + photos.length) % photos.length
        ),
    }))

    // magnetic hover
    const handleMove = (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      setOffset({
        x: x * 10, // strength
        y: y * 10,
      })
    }

    const resetOffset = () => {
      setOffset({ x: 0, y: 0 })
    }

    if (!photos.length) return null

    return (
      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={resetOffset}
        className="relative w-[220px] sm:w-[260px] md:w-[300px] lg:w-[320px] aspect-square sm:aspect-[3/4]"
      >

        {photos.map((src, i) => {
          const position = (i - index + photos.length) % photos.length

          const transforms = [
            "translate-x-0 translate-y-0 rotate-0 scale-100 z-30",
            "translate-x-3 translate-y-1 rotate-[3deg] scale-[0.97] z-20",
            "translate-x-6 translate-y-2 rotate-[6deg] scale-[0.94] z-10",
            "translate-x-9 translate-y-3 rotate-[8deg] scale-[0.92] z-0 opacity-40",
          ]

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
                transform: `
                  translate(${offset.x}px, ${offset.y}px)
                `,
              }}
            >
              <div
                className={`
                  w-full h-full bg-white p-2.5 md:p-3 rounded-xl
                  shadow-[0_10px_24px_rgba(0,0,0,0.08)]
                  transition-all duration-500
                  ${isActive ? "blur-0 scale-100" : "blur-[1.5px] scale-[0.98]"}
                `}
              >

                <div className="relative w-full h-full overflow-hidden rounded-md">

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