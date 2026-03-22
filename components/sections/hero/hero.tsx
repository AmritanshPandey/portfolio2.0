"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Image from "next/image"
import { CTA } from "@/components/shared/section-cta"
import { TypingWord } from "@/components/shared/typing-effect"
import { Pill } from "@/components/shared/pill"

export default function Hero() {
  const heroRef = useRef(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  // ─── ENTRY ─────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", { y: 40, opacity: 0, stagger: 0.1 })
      gsap.from(".hero-sub", { y: 20, opacity: 0, delay: 0.4 })
      gsap.from(".hero-image", { y: 40, opacity: 0, duration: 1 })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // ─── TILT ─────────────────
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setTilt({
      x: y * -8,
      y: x * 8,
    })

    if (glowRef.current) {
      glowRef.current.style.left = `${e.clientX - rect.left}px`
      glowRef.current.style.top = `${e.clientY - rect.top}px`
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative bg-background text-foreground overflow-hidden"
    >

      {/* ✨ Ambient (clean + consistent) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="
          absolute -top-32 -left-32 w-[420px] h-[420px]
          bg-[radial-gradient(circle,rgba(249,115,22,0.06),transparent_70%)]
          dark:bg-[radial-gradient(circle,rgba(249,115,22,0.10),transparent_70%)]
          blur-3xl
        " />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-[1.6fr_1fr] gap-12 items-center">

        {/* LEFT */}
        <div className="space-y-6 max-w-2xl">

          <h1 className="font-medium leading-[1.08]">
            <span className="hero-line block text-[clamp(36px,5.5vw,64px)]">
              Designing fintech
            </span>

            <span className="hero-line block text-[clamp(36px,5.5vw,64px)] text-muted-foreground">
              <TypingWord />
            </span>

            <span className="hero-line block text-[clamp(36px,5.5vw,64px)]">
              that scale globally.
            </span>
          </h1>

          <p className="hero-sub text-lg text-muted-foreground max-w-[440px]">
            At Mastercard, from design systems to{" "}
            <span className="text-foreground font-medium">
              enterprise product demos.
            </span>
          </p>

          <div className="hero-sub flex gap-3">
            <CTA label="View work" href="#work" />
            <CTA label="Resume" href="/resume.pdf" variant="secondary" />
          </div>

        </div>

        {/* RIGHT */}
        <div className="hero-image flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px]">

            {/* CARD */}
            <div
              ref={cardRef}
              onMouseMove={handleMove}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="group relative rounded-2xl"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
                transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
            >

              <div className="
                relative rounded-2xl overflow-hidden
                bg-card
                border border-border
                shadow-lg
              ">

                {/* Glow */}
                <div
                  ref={glowRef}
                  className="
                    absolute z-10 w-40 h-40 rounded-full
                    -translate-x-1/2 -translate-y-1/2
                    pointer-events-none
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    blur-xl
                    bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_70%)]
                    dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]
                  "
                />

                {/* IMAGE */}
                <div className="relative aspect-[2/3]">
                  <Image
                    src="/assets/images/pic.jpg"
                    alt="profile"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="
                  absolute bottom-0 left-0 right-0 h-2/5
                  bg-gradient-to-t
                  from-card via-card/70 to-transparent
                " />

                {/* CONTENT */}
                <div className="absolute bottom-0 p-4 space-y-3">

                  {/* FIXED PILLS */}
                  <div className="flex gap-2 flex-wrap">
                    {["Mastercard", "Advisor", "Mentor"].map((tag) => (
                      <Pill key={tag}>{tag}</Pill>
                    ))}
                  </div>

                  <div className="space-y-[4px]">
                    <p className="text-xs text-muted-foreground">
                      Product Designer
                    </p>

                    <p className="text-base font-semibold leading-tight">
                      Amritansh Pandey
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* FLOATING INFO */}
            <div className="absolute -right-6 top-[30%] hidden lg:flex flex-col gap-3 z-20">

              <div className="
                rounded-xl px-4 py-3
                bg-card/80 backdrop-blur-md
                border border-border
                shadow-sm
              ">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-semibold">7+ years</p>
              </div>

              <div className="
                rounded-xl px-4 py-3
                bg-card/80 backdrop-blur-md
                border border-border
                shadow-sm
              ">
                <p className="text-xs text-muted-foreground">Based in</p>
                <p className="font-semibold">Gurgaon, IN</p>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Bottom separator */}
      <div className="
        pointer-events-none absolute bottom-0 left-0 w-full h-px
        bg-gradient-to-r
        from-transparent via-foreground/10 to-transparent
        dark:via-white/10
      " />

    </section>
  )
}