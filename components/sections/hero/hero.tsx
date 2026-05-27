"use client"

import Image from "next/image"
import { useRef, useCallback } from "react"
import { CTA } from "@/components/shared/section-cta"
import { TypingWord } from "@/components/shared/typing-effect"

import { Pill } from "@/components/shared/pill"

export default function Hero() {
  const cardRef  = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card  = cardRef.current
    const glare = glareRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width   // 0→1
    const y = (e.clientY - rect.top)  / rect.height  // 0→1

    const rX = -(y - 0.5) * 16   // tilt up/down  ±8°
    const rY =  (x - 0.5) * 16   // tilt left/right ±8°

    card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.03,1.03,1.03)`

    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.16) 0%, transparent 65%)`
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    const card  = cardRef.current
    const glare = glareRef.current
    if (!card) return

    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"

    if (glare) glare.style.background = "transparent"
  }, [])
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-background text-foreground"
    >
      {/* Dot grid — light */}
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Dot grid — dark */}
      <div
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, var(--background) 100%)" }}
      />

      {/* Orange bloom — static */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[580px] h-[580px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,98,26,0.09) 0%, transparent 70%)" }}
      />

      {/* Edge fades */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-20" style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }} />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20" style={{ background: "linear-gradient(to top, var(--background), transparent)" }} />
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-20" style={{ background: "linear-gradient(to right, var(--background), transparent)" }} />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-20" style={{ background: "linear-gradient(to left, var(--background), transparent)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-24 lg:py-28 grid lg:grid-cols-[1.5fr_1fr] gap-12 md:gap-14 items-center">

        {/* Left */}
        <div className="flex flex-col gap-5 md:gap-6 lg:gap-7 w-full max-w-[620px] md:max-w-[680px] lg:max-w-[620px] items-start text-left">

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-[12px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Senior Product Designer • Mastercard
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-muted/40 text-[12px] text-muted-foreground">
              8 years in product
            </div>
          </div>

          <h1 className="font-medium tracking-[-0.02em] leading-[1.02] max-w-[620px]">
            <span className="block text-[clamp(36px,5vw,60px)]">Designing fintech</span>
            <div className="py-2">
              <span className="block text-[clamp(36px,5vw,60px)] inline-block min-w-[10ch]">
                <TypingWord />
              </span>
            </div>
            <span className="block text-[clamp(36px,5vw,60px)]">that scale globally.</span>
          </h1>

          <div className="mb-[24px]">
            <p className="text-[15px] md:text-[16px] leading-[1.7] text-muted-foreground w-full max-w-[420px] lg:max-w-[480px] px-4 py-3 rounded-xl bg-background/40 backdrop-blur-md border border-border/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <span className="text-foreground font-medium">At Mastercard&apos;s Creative Studio,</span>{" "}
              designing systems and platforms that power global banking partnerships
              <span className="text-foreground font-medium"> from early demos to production-ready experiences.</span>
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full max-w-[420px] lg:max-w-[520px] md:grid md:grid-cols-2">
            <CTA label="View work" href="#work" className="w-full justify-center shadow-[0_6px_18px_rgba(0,0,0,0.08)]" />
            <CTA label="Resume" href="/resume.pdf" variant="secondary" className="w-full justify-center" />
          </div>
        </div>

        {/* Right — image card with cursor tilt */}
        <div className="flex justify-center lg:justify-end mt-6 md:mt-0">
          <div className="relative w-full max-w-[320px]">
            <div
              ref={cardRef}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              className="relative rounded-2xl overflow-hidden border border-border/60 bg-background/80 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              style={{ willChange: "transform", transition: "transform 0.15s ease-out" }}
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                  src="/assets/images/pic.jpg"
                  alt="Amritansh Pandey"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
              <div className="absolute bottom-0 p-4 space-y-3">
                <div className="flex gap-1.5 flex-wrap">
                  {["Fintech", "Advisor", "Mentor"].map(tag => <Pill key={tag}>{tag}</Pill>)}
                </div>
                <p className="text-base font-semibold text-white">Amritansh Pandey</p>
              </div>
              {/* Specular glare — follows cursor */}
              <div
                ref={glareRef}
                className="pointer-events-none absolute inset-0 z-10"
                style={{ background: "transparent" }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
