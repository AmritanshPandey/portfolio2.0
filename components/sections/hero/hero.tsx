"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import Image from "next/image"
import clsx from "clsx"
import { CTA } from "@/components/shared/section-cta"
import { TypingWord } from "@/components/shared/typing-effect"
import { Pill } from "@/components/shared/pill"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { isHigh } = usePerformanceMode()

  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // ── GSAP ENTRY
  useEffect(() => {
    if (!mounted) return

    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", { y: 12, opacity: 0, duration: 0.5 })
      gsap.from(".hero-line", {
        y: 28,
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

  // ── TILT (DOM based)
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHigh) return

    const el = cardRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()

    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const tiltX = (y - 0.5) * -8
    const tiltY = (x - 0.5) * 8

    el.style.transform = `
      perspective(1200px)
      rotateX(${tiltX * 0.6}deg)
      rotateY(${tiltY * 0.6}deg)
      scale(1.02)
    `

    el.style.setProperty("--x", `${x * 100}%`)
    el.style.setProperty("--y", `${y * 100}%`)
  }, [isHigh])

  const handleLeave = () => {
    const el = cardRef.current
    if (!el) return

    el.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `
  }

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-background text-foreground"
    >

      {/* ── DOT GRID */}
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 [background-size:22px_22px]",
          isHigh
            ? "[background-image:radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)]"
            : "[background-image:radial-gradient(rgba(0,0,0,0.08)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)]"
        )}
      />

      {/* ── AMBIENT GLOW */}
      {isHigh && (
        <div className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(500px_250px_at_25%_20%,rgba(255,120,40,0.08),transparent_60%)]
          dark:bg-[radial-gradient(420px_220px_at_25%_20%,rgba(255,120,40,0.22),transparent_65%)]
        " />
      )}

      {/* ── EDGE FADE */}
      <div className="
        pointer-events-none absolute inset-0
        bg-gradient-to-b
        from-white/80 via-transparent to-white/80
        dark:from-black/80 dark:via-transparent dark:to-black/80
      " />

      <div className="
        pointer-events-none absolute inset-0
        bg-gradient-to-r
        from-white/70 via-transparent to-white/70
        dark:from-black/70 dark:via-transparent dark:to-black/70
      " />

      {/* ── CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24 lg:py-28 grid lg:grid-cols-[1.5fr_1fr] gap-16 items-center">

        {/* LEFT */}
        <div className="flex flex-col gap-6 max-w-2xl">

          <div className="hero-badge flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-xs text-muted-foreground w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400  animate-pulse" />
            Senior Product Designer • Mastercard
          </div>

          <h1 className="font-medium tracking-tight leading-[1.05] text-center lg:text-left">

            <span className="hero-line block text-[clamp(36px,5vw,62px)]">
              Designing fintech
            </span>

            {/* stable typing */}
            <span className="
              hero-line relative block
              text-[clamp(36px,5vw,62px)]
              text-muted-foreground
              h-[1.2em]
              flex items-center justify-center lg:justify-start
            ">
              <span className="opacity-0">experiences</span>
              <span className="absolute inset-0 flex items-center justify-center lg:justify-start">
                <TypingWord />
              </span>
            </span>

            <span className="hero-line block text-[clamp(36px,5vw,62px)]">
              that scale globally.
            </span>
          </h1>

            <p className="relative hero-sub text-base md:text-lg text-muted-foreground leading-[1.7]">
            At Mastercard{"'"}s Creative Studio, {" "}
            <span className="text-foreground font-medium">
              designing systems, demos, and platforms that power
              global banking partnerships.
            </span>
          </p>

          <div className="hero-cta flex flex-col gap-3 w-full max-w-[420px] md:grid md:grid-cols-[60%_40%]">
            <CTA label="View work" href="#work" className="w-full justify-center" />
            <CTA label="Resume" href="/resume.pdf" variant="secondary" className="w-full justify-center" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-image flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[320px]">

            <div
              ref={cardRef}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              className="relative group"
            >
              <div
                className={clsx(
                  "relative rounded-2xl overflow-hidden border border-border/60",

                  isHigh
                    ? "bg-background/60 backdrop-blur-xl"
                    : "bg-background/80",

                  "shadow-[0_10px_30px_rgba(0,0,0,0.1)]",
                  "dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)]",

                  "[transform:translateZ(0)] [backface-visibility:hidden] [contain:paint]"
                )}
              >

                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src="/assets/images/pic.jpg"
                    alt="Amritansh Pandey"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

                <div className="absolute bottom-0 p-4 space-y-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {["Fintech", "Advisor", "Mentor"].map(tag => (
                      <Pill key={tag}>{tag}</Pill>
                    ))}
                  </div>

                  <p className="text-base font-semibold text-white">
                    Amritansh Pandey
                  </p>
                </div>

                {/* light reflection */}
                {isHigh && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `
                        radial-gradient(
                          280px circle at var(--x, 50%) var(--y, 50%),
                          rgba(255,255,255,0.18),
                          transparent 60%
                        )
                      `,
                    }}
                  />
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}