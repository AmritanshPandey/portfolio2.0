"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import Image from "next/image"
import { CTA } from "@/components/shared/section-cta"
import { TypingWord } from "@/components/shared/typing-effect"
import { Pill } from "@/components/shared/pill"

type Vec2 = { x: number; y: number }

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const [tilt, setTilt] = useState<Vec2>({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // ── Entrance ─────────────────
  useEffect(() => {
    if (!mounted) return

    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", { y: 12, opacity: 0, duration: 0.5 })
      gsap.from(".hero-line", {
        y: 32,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        delay: 0.1,
      })
      gsap.from(".hero-sub", { y: 16, opacity: 0, delay: 0.4 })
      gsap.from(".hero-cta", { y: 12, opacity: 0, delay: 0.55 })
      gsap.from(".hero-image", { y: 40, opacity: 0, delay: 0.1 })
    }, heroRef)

    return () => ctx.revert()
  }, [mounted])

  // ── Tilt (reduced + premium) ─────────────────
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setTilt({
      x: y * -6,
      y: x * 6,
    })
  }, [])

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-background text-foreground"
    >

      {/* ── DOT GRID ───────────────── */}
      <div
        className="
          pointer-events-none absolute inset-0
          [background-size:22px_22px]
          [background-image:radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)]
          dark:[background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)]
        "
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
        }}
      />

      {/* ── AMBIENT ───────────────── */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(800px_400px_at_20%_10%,rgba(232,98,26,0.04),transparent_60%)]
          dark:bg-[radial-gradient(800px_400px_at_20%_10%,rgba(232,98,26,0.06),transparent_60%)]
        "
      />

      {/* ── CONTENT ───────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24 lg:py-28 grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center">

        {/* LEFT */}
        <div className="flex flex-col gap-6 max-w-2xl">

          {/* BADGE */}
          <div className="hero-badge flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-xs text-muted-foreground w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Product Designer · Mastercard
          </div>

          {/* HEADING */}
          <h1 className="font-medium tracking-tight leading-[1.05]">
            <span className="hero-line block text-[clamp(36px,5vw,62px)]">
              Designing fintech
            </span>

            <span className="hero-line block text-[clamp(36px,5vw,62px)] text-muted-foreground min-h-[1.4em]">
              <TypingWord />
            </span>

            <span className="hero-line block text-[clamp(36px,5vw,62px)]">
              that scale globally.
            </span>
          </h1>

          {/* SUBTEXT */}
          <div className="relative max-w-[560px]">

            <div
              className="
                pointer-events-none absolute -inset-2 rounded-xl
                opacity-60
                bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.35),transparent_70%)]
                dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35),transparent_70%)]
                backdrop-blur-[1.5px]
              "
            />

            <p className="relative hero-sub text-base md:text-lg text-muted-foreground leading-relaxed">
              At Mastercard, from design systems to{" "}
              <span className="text-foreground font-medium">
                interactive demos for billion-dollar bank deals
              </span>.
            </p>
          </div>

          {/* CTA */}
          <div className="
            hero-cta
            flex flex-col gap-3
            w-full max-w-[420px]
            md:grid md:grid-cols-[60%_40%]
          ">
            <CTA label="View work" href="#work" className="w-full justify-center" />
            <CTA label="Resume" href="/resume.pdf" variant="secondary" className="w-full justify-center" />
          </div>

        </div>

        {/* RIGHT */}
        <div className="hero-image flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[320px]">

            {/* CARD */}
            <div
              ref={cardRef}
              onMouseMove={handleMove}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={handleLeave}
              className="relative rounded-2xl will-change-transform"
              style={{
                transform: `
                  perspective(1000px)
                  rotateX(${tilt.x * 0.45}deg)
                  rotateY(${tilt.y * 0.45}deg)
                  scale(${hovered ? 1.015 : 1})
                `,
                transition: hovered
                  ? "transform 0.18s ease-out"
                  : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}
            >

              <div className="
                relative rounded-2xl overflow-hidden
                bg-card border border-border/60
                shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]
              ">

                <div className="relative aspect-[2/3]">
                  <Image
                    src="/assets/images/pic.jpg"
                    alt="Amritansh Pandey"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="
                  absolute bottom-0 left-0 right-0 h-2/5
                  bg-gradient-to-t from-black/70 via-black/40 to-transparent
                " />

                <div className="absolute bottom-0 p-4 space-y-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {["Systems", "Advisor", "Mentor"].map(tag => (
                      <Pill key={tag}>{tag}</Pill>
                    ))}
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Amritansh Pandey
                  </p>
                </div>

                {/* subtle top edge */}
                <div className="
                  pointer-events-none absolute inset-x-0 top-0 h-px
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                " />
              </div>
            </div>

            {/* FLOATING INFO */}
            <div className="
  hidden lg:flex flex-col gap-3
  absolute right-[-18px] top-1/2 -translate-y-1/2
">
              {/* EXPERIENCE */}
              <div className="
    rounded-xl px-3 py-2 min-w-[120px]

    bg-background/70 backdrop-blur-xl
    border border-border/50

    shadow-[0_6px_18px_rgba(0,0,0,0.08)]
    dark:shadow-[0_12px_30px_rgba(0,0,0,0.45)]

    transition-all duration-300
    hover:-translate-x-[1px]
  ">
                <span className="text-[9px] uppercase tracking-wider text-foreground/50">
                  Experience
                </span>
                <span className="block text-sm font-semibold">
                  7+ years
                </span>
              </div>

              {/* LOCATION */}
              <div className="
    rounded-xl px-3 py-2 min-w-[120px]

    bg-background/70 backdrop-blur-xl
    border border-border/50

    shadow-[0_6px_18px_rgba(0,0,0,0.08)]
    dark:shadow-[0_12px_30px_rgba(0,0,0,0.45)]

    transition-all duration-300
    hover:-translate-x-[1px]
  ">
                <span className="text-[9px] uppercase tracking-wider text-foreground/50">
                  Based in
                </span>
                <span className="block text-sm font-semibold">
                  Gurgaon, IN
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* SEPARATOR */}
      <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-b from-transparent to-background" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />

    </section>
  )
}