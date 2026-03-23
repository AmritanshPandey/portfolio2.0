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

      <div className="relative group isolate">

        {/* ✨ AMBIENT GLOW (directional, matches system) */}
        <div className="
          pointer-events-none absolute -inset-16 rounded-[32px]
          opacity-40 blur-3xl
          transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-[1.04]

          bg-[radial-gradient(400px_220px_at_0%_100%,rgba(249,115,22,0.08),transparent_70%)]
          dark:bg-[radial-gradient(400px_220px_at_0%_100%,rgba(249,115,22,0.12),transparent_70%)]
        " />

        {/* ✨ INNER EDGE (glass highlight) */}
        <div className="
          pointer-events-none absolute inset-0 rounded-3xl

          ring-1 ring-inset
          ring-black/[0.06]
          dark:ring-white/[0.06]
        " />

        {/* ✨ TOP EDGE LIGHT (matches cards system) */}
        <div className="
          pointer-events-none absolute inset-x-0 top-0 h-px
          bg-gradient-to-r
          from-transparent via-foreground/10 to-transparent
          dark:via-white/20
        " />

        {/* ✨ SUBTLE INNER GLOW (adds depth on hover) */}
        <div className="
          pointer-events-none absolute inset-0 rounded-3xl
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500

          bg-[radial-gradient(200px_120px_at_20%_80%,rgba(255,255,255,0.04),transparent_70%)]
          dark:bg-[radial-gradient(200px_120px_at_20%_80%,rgba(255,255,255,0.06),transparent_70%)]
        " />

        {/* CAROUSEL */}
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