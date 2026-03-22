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

        {/* Ambient glow (theme-aware, subtle) */}
        <div className="
          absolute -inset-12 rounded-3xl
          opacity-40 blur-3xl
          transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-[1.03]
          
          bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.08),transparent_70%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_70%)]
        " />

        {/* Soft edge highlight */}
        <div className="
          absolute inset-0 rounded-3xl pointer-events-none
          ring-1 ring-inset ring-border/50
        " />

        {/* Carousel */}
        <div className="
          relative
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:-translate-y-[2px]
        ">
          <PhotoStackCarousel
            ref={carouselRef}
            photos={photos}
          />
        </div>

      </div>

    </div>
  )
}