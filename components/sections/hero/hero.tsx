"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Image from "next/image"
import { CTA } from "@/components/shared/section-cta"

export default function Hero() {

  const heroRef = useRef(null)

  useEffect(() => {

    const ctx = gsap.context(() => {

      gsap.from(".hero-line", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      })

      gsap.from(".hero-image", {
        y: 20,
        opacity: 0,
        duration: 0.9,
        delay: 0.2,
        ease: "power3.out"
      })

    }, heroRef)

    return () => ctx.revert()

  }, [])

  return (

    <section ref={heroRef} className="bg-[var(--bg1)]">

      <div className="max-w-7xl mx-auto px-6 pt-10 md:pt-14 pb-20 grid lg:grid-cols-[1.8fr_1fr] gap-10 lg:gap-12 items-start">

        {/* LEFT */}

        <div className="space-y-4 max-w-2xl">

          <p className="hero-line text-xs tracking-[0.2em] font-semibold uppercase text-neutral-400">
            Product Designer
          </p>

          <h1 className="hero-line text-[36px] md:text-[48px] lg:text-[56px] font-semibold leading-[1.15] tracking-tight">

            Designing Scalable  
            <br />

            <span className="text-red-600">
              Product Systems
            </span>

            <br />

            for Complex Fintech Platforms

          </h1>

          <p className="hero-line text-base md:text-lg text-neutral-600 max-w-md leading-[1.6]">
            I design product systems that simplify complexity, scale across markets,
            and enable better decision-making in financial products.
          </p>

          <div className="hero-line text-sm text-neutral-500 flex gap-3 pt-1">
            <span>Mastercard</span>
            <span>•</span>
            <span>Advisor</span>
            <span>•</span>
            <span>Mentor</span>
          </div>


          {/* CTA */}

          <div className="hero-line flex flex-col sm:flex-row gap-3 pt-4">

            <CTA
              variant="primary"
              label="View Work"
              href="#work"
            />

            <CTA
              variant="secondary"
              label="Resume"
              href="/resume.pdf"
              icon="download"
            />

          </div>

        </div>


        {/* RIGHT */}

        <div className="hero-image flex justify-center lg:justify-end w-full">

          <div className="relative w-full max-w-[380px]">

            {/* subtle glow */}
            <div className="absolute -inset-3 bg-neutral-200 rounded-2xl blur-lg opacity-30"></div>

            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-200">

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