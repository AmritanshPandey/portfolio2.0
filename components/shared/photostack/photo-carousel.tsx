"use client"

import { useRef } from "react"
import PhotoStackCarousel, {
  CarouselRef,
} from "./photo-stack"

export default function PhotoCarousel() {

  const photos = [
    "/assets/images/1.png",
    "/assets/images/2.png",
    "/assets/images/3.png",
    "/assets/images/4.png",
    "/assets/images/5.png",
  ]

  const carouselRef = useRef<CarouselRef | null>(null)

  return (
    <div className="relative flex justify-center lg:justify-start py-6 md:py-0">

      <div className="relative group">

        {/* base glow */}
        <div className="absolute -inset-10 bg-gradient-to-tr from-red-100/25 via-neutral-200/20 to-transparent blur-3xl rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]" />

        {/* subtle radial highlight (adds depth) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_60%)] rounded-3xl pointer-events-none opacity-70" />

        {/* carousel */}
        <div className="relative transition-all duration-500 ease-out group-hover:-translate-y-[2px]">
          <PhotoStackCarousel
            ref={carouselRef}
            photos={photos}
          />
        </div>

      </div>

    </div>
  )
}