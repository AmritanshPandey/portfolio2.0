"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import Image from "next/image"
import { CTA } from "@/components/shared/section-cta"
import { TypingWord } from "@/components/shared/typing-effect"
import { usePerformanceMode } from "@/hooks/use-performance-mode"
import clsx from "clsx"
import { Pill } from "@/components/shared/pill"

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const { isHigh } = usePerformanceMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // ── ENTRY ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return
    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", { y: 10, opacity: 0, duration: 0.5 })
      gsap.from(".hero-line", { y: 20, opacity: 0, stagger: 0.06, duration: 0.7, delay: 0.1 })
      gsap.from(".hero-sub", { y: 12, opacity: 0, delay: 0.35 })
      gsap.from(".hero-cta", { y: 10, opacity: 0, delay: 0.5 })
      gsap.from(".hero-image", { y: 26, opacity: 0, delay: 0.1 })
    }, heroRef)
    return () => ctx.revert()
  }, [mounted])

  // ── TILT — Safari-safe (scale3d, willChange, no state) ────
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHigh) return

    const el = cardRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()

    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // ✅ ADD HERE
    el.style.setProperty("--x", `${x * 100}%`)
    el.style.setProperty("--y", `${y * 100}%`)

    // existing transform
    el.style.transform = `
    perspective(1000px)
    rotateX(${(y - 0.5) * -4}deg)
    rotateY(${(x - 0.5) * 4}deg)
    scale3d(1.015,1.015,1.015)
  `
  }, [isHigh])

  const handleLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
  }, [])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative overflow-hidden bg-background text-foreground"
    >

      {/* ══════════════════════════════════════════════════
          BACKGROUND LAYERS  (bottom → top)

          1. Dot grid           always visible, no blend mode
          2. Grid edge vignette fades dots at edges
          3. Orange bloom       warm ambient, top-left
          4. Edge fades         blends into surrounding sections
      ══════════════════════════════════════════════════ */}

      {/* 1a. DOT GRID — light mode
              rgba(0,0,0,0.22) gives clearly visible dark dots
              on the light background. No mix-blend needed.
              24px grid = premium density, not too busy.        */}
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 1b. DOT GRID — dark mode
              rgba(255,255,255,0.10) = subtle but readable dots.
              Separate element avoids Tailwind dark: + inline
              style conflicts that trip Safari up.               */}
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 2. GRID EDGE VIGNETTE
              Fades the dot grid at all four edges so it doesn't
              compete with content or bleed into other sections.
              radial-gradient is Safari GPU-composited — safe.   */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, hsl(var(--background)) 100%)",
        }}
      />

      {/* 3. ORANGE BLOOM — top-left warm atmosphere
              blur-3xl is GPU-composited on Safari.
              Only renders on high-perf devices.                 */}
      {isHigh && (
        <div
          className="pointer-events-none absolute -top-40 -left-40 w-[580px] h-[580px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(232,98,26,0.09) 0%, transparent 70%)" }}
        />
      )}

      {/* 4a. TOP EDGE FADE */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-20"
        style={{ background: "linear-gradient(to bottom, hsl(var(--background)), transparent)" }}
      />

      {/* 4b. BOTTOM EDGE FADE */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
        style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }}
      />

      {/* 4c. LEFT EDGE FADE */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-20"
        style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
      />

      {/* 4d. RIGHT EDGE FADE */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 right-0 w-20"
        style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
      />

      {/* ══════════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════════ */}
      <div className="
  relative z-10 max-w-6xl mx-auto
  px-5 sm:px-6
  py-16 md:py-24 lg:py-28

  grid lg:grid-cols-[1.5fr_1fr]

  gap-12 md:gap-14  
  items-center
">

        {/* ── LEFT ─────────────────────────────────────── */}
        <div className="
  flex flex-col gap-6

  w-full
  max-w-[620px]

  lg:items-start
">

          {/* Badge */}
          <div className="
            hero-badge w-fit
            flex items-center gap-2 px-3 py-1.5 rounded-full
            border border-border/60 bg-muted/40
            text-[12px] text-muted-foreground
          ">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Senior Product Designer • Mastercard
          </div>

          {/* Headline */}
          <h1 className="font-medium tracking-[-0.02em] leading-[1.02] max-w-[620px]">
            <span className="hero-line block text-[clamp(36px,5vw,60px)]">
              Designing fintech
            </span>
            <div className="py-2">
              <span className="hero-line block text-[clamp(36px,5vw,60px)] text-orange-500/90">
                <TypingWord />
              </span>
            </div>

            <span className="hero-line block text-[clamp(36px,5vw,60px)]">
              that scale globally.
            </span>
          </h1>

          {/* Sub */}
          <div className="
  bg-gradient-to-r
  from-background/90 via-background/70 to-background/90 mb-[24px]
  
  ">
      <p className="
  hero-sub
  text-[15px] md:text-[16px]
  leading-[1.7]
  text-muted-foreground

  w-full max-w-[420px] lg:max-w-[520px]

  px-4 py-3
  rounded-xl

  bg-background/60
  backdrop-blur-md

  border border-border/50

  shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
">
  <span className="text-foreground font-medium">
    At Mastercard's Creative Studio,
  </span>{" "}
  designing systems and platforms that power global banking partnerships
  <span className="text-foreground font-medium">
    {" "}from early demos to production-ready experiences.
  </span>
</p>
          </div>
          {/* CTAs */}
          <div className="
  hero-cta
  flex flex-col gap-2.5   /* 👈 better rhythm */

w-full max-w-[420px] lg:max-w-[520px]

  md:grid md:grid-cols-2
">
            <CTA
              label="View work"
              href="#work"
              className="w-full justify-center shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
            />
            <CTA
              label="Resume"
              href="/resume.pdf"
              variant="secondary"
              className="w-full justify-center"
            />
          </div>

        </div>

        {/* RIGHT */}
        <div className="
  hero-image
  flex justify-center lg:justify-end

  mt-6 md:mt-0   /* 👈 FIX */
">
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