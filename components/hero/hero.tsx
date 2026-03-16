"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { IconArrowUpRight, IconDownload } from "@tabler/icons-react"

export default function Hero() {

  const heroRef = useRef(null)

  useEffect(() => {

    const ctx = gsap.context(() => {

      gsap.from(".hero-line", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out"
      })

      gsap.from(".hero-image", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.25,
        ease: "power3.out"
      })

    }, heroRef)

    return () => ctx.revert()

  }, [])

  return (

    <section ref={heroRef} className="bg-[var(--bg1)]">

      <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-12 pb-20 grid lg:grid-cols-[1.9fr_1fr] gap-10 lg:gap-14 items-start">

        {/* LEFT COLUMN */}

        <div className="space-y-3 max-w-2xl">

          <p className="hero-line text-md tracking-[0.16em] font-semibold uppercase text-muted-foreground">
            Product Designer
          </p>

          <h1 className="hero-line text-[36px] md:text-[48px] lg:text-[56px] font-semibold leading-[1.2] tracking-tight text-balance">

            Designing Scalable
            <br />

            <span className="bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
              Product Systems
            </span>

            <br />

            for Global Fintech Platforms

          </h1>

          <p className="hero-line text-lg text-muted-foreground max-w-lg">
            Designing fintech product systems used across global payment networks.
            Turning complex capabilities into scalable product experiences.
          </p>

          <div className="hero-line text-sm text-muted-foreground/80 flex gap-3 pt-2">
            <span>Mastercard</span>
            <span>•</span>
            <span>Startup Advisor</span>
            <span>•</span>
            <span>Mentor</span>
          </div>


          {/* CTA Buttons */}

          <div className="hero-line flex flex-col sm:flex-row gap-3 pt-4">

            <Button
              size="lg"
              className="group w-full sm:w-auto gap-2 px-10 py-6 text-base bg-black text-white hover:bg-neutral-800 transition-all duration-200 hover:-translate-y-[2px]"
            >
              Explore Work
              <IconArrowUpRight
                size={24}
                className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group w-full sm:w-auto gap-2 px-10 py-6 text-base bg-transparent border-2 border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition-all duration-200 hover:-translate-y-[2px]"
            >
              Download Résumé
              <IconDownload
                size={24}
                className="text-inherit transition-transform duration-300 ease-out group-hover:translate-y-[4px]"
              />
            </Button>

          </div>

        </div>


        {/* RIGHT COLUMN — PORTRAIT */}

        <div className="hero-image flex justify-center lg:justify-end w-full">

          <div className="relative w-full max-w-[420px]">

            <div className="absolute -inset-4 bg-neutral-200 rounded-3xl blur-xl opacity-40"></div>

            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-100">

              <Image
                src="/assets/images/pic.jpg"
                alt="Amritansh Pandey"
                fill
                priority
                className="object-cover object-[60%_35%]"
              />

            </div>

          </div>

        </div>

      </div>

    </section>

  )
}