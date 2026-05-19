"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const DEFAULT_PHOTOS = [
  "/assets/images/1.png",
  "/assets/images/2.png",
  "/assets/images/3.png",
  "/assets/images/4.png",
  "/assets/images/5.png",
]

const DEFAULT_CAPTIONS = ["Moments", "Travel", "Life", "Stories", "Memories"]

type Props = {
  photos?: string[]
  captions?: string[]
  interval?: number
  /** Alt text prefix; each photo gets "{altPrefix} {n}" */
  altPrefix?: string
}

export default function PhotoCarousel({
  photos = DEFAULT_PHOTOS,
  captions = DEFAULT_CAPTIONS,
  interval = 3000,
  altPrefix = "Photo",
}: Props) {
  const [index, setIndex] = useState(0)
  const count = photos.length

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, interval)
    return () => clearInterval(id)
  }, [count, interval])

  return (
    <div className="flex justify-center py-12">
      <div className="relative w-[260px] md:w-[300px] aspect-[4/5]">

        {photos.map((src, i) => {
          const position = (i - index + count) % count
          const isActive = position === 0
          const activeCaption = captions[index % captions.length]

          let transform = ""
          let zIndex = 0
          let opacity = 1

          if (position === 0) {
            transform = "rotate(0deg) scale(1)"
            zIndex = 30
          } else if (position === 1) {
            transform = "rotate(4deg) scale(0.96) translate(16px,8px)"
            zIndex = 20
          } else if (position === 2) {
            transform = "rotate(8deg) scale(0.92) translate(32px,16px)"
            zIndex = 10
            opacity = 0.7
          } else {
            opacity = 0
          }

          return (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-500 ease-out"
              style={{ transform, zIndex, opacity }}
            >
              <div className="w-full h-full transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]">

                <div className="w-full h-full bg-white rounded-md border border-black/10 shadow-lg">

                  {/* IMAGE */}
                  <div className="p-3 pb-0">
                    <div className="relative w-full aspect-square overflow-hidden rounded-sm">
                      <Image
                        src={src}
                        alt={`${altPrefix} ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* CAPTION */}
                  <div className="h-[52px] flex items-center justify-center">
                    {isActive && (
                      <span
                        className="text-xl text-black/70 italic"
                        style={{ transform: "rotate(-1deg)", display: "inline-block" }}
                      >
                        {activeCaption}
                      </span>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}
