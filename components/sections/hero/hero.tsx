"use client"

import Image from "next/image"
import { useRef, useCallback } from "react"
import { CTA } from "@/components/shared/section-cta"
import { TypingWord } from "@/components/shared/typing-effect"
import { ShaderGrid } from "@/components/shared/shader-grid"

import { Pill } from "@/components/shared/pill"

export default function Hero() {
  const cardRef  = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const tiltRaf  = useRef(0)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    // Capture coords now (cheap); batch the layout read + style writes into a
    // single rAF, throttled to one per frame — avoids a style recalc per event.
    const cx = e.clientX
    const cy = e.clientY
    if (tiltRaf.current) return

    tiltRaf.current = requestAnimationFrame(() => {
      tiltRaf.current = 0
      const glare = glareRef.current
      const rect = card.getBoundingClientRect()
      const x = (cx - rect.left) / rect.width   // 0→1
      const y = (cy - rect.top)  / rect.height  // 0→1

      const rX = -(y - 0.5) * 16   // tilt up/down  ±8°
      const rY =  (x - 0.5) * 16   // tilt left/right ±8°

      card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.03,1.03,1.03)`

      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.16) 0%, transparent 65%)`
      }
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    if (tiltRaf.current) { cancelAnimationFrame(tiltRaf.current); tiltRaf.current = 0 }

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
      {/* Dot grid — cursor-reactive WebGL shader (static CSS fallback inside) */}
      <ShaderGrid spacing={18} dotSize={0.07} radius={0.13} drag={1.35} maxDrag={0.01} />

      {/* Soft vignette — fades later so the dot grid stays readable in the centre */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 95% 80% at 50% 42%, transparent 55%, transparent 76%, var(--background) 100%)" }}
      />

      {/* Warm pool — a single, subtle ember light, top-left. The "Warm Studio"
          North Star: one warm light on the work, not ambient tint everywhere. */}
      <div
        className="pointer-events-none absolute -top-48 -left-44 w-[640px] h-[640px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(232,98,26,0.08) 0%, rgba(232,98,26,0.03) 45%, transparent 72%)" }}
      />

      {/* Top + bottom depth fades — single smooth gradient, grounds the section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to bottom, var(--background) 0%, transparent 16%, transparent 84%, var(--background) 100%)" }}
      />
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 py-16 md:py-24 lg:py-28 grid lg:grid-cols-[1.5fr_1fr] gap-12 md:gap-14 items-center">

        {/* Left */}
        <div className="flex flex-col gap-5 md:gap-6 lg:gap-7 w-full max-w-[620px] md:max-w-[680px] lg:max-w-[620px] items-start text-left">

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-foreground/[0.03] text-[12px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              Product Thinker • Mastercard
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-foreground/[0.03] text-[12px] text-muted-foreground">
              7 years in product
            </div>
          </div>

          <h1 className="type-page-title max-w-[620px]">
            <span className="block">
              Designing <span className="shimmer-accent">fintech</span>
            </span>
            <div className="py-2">
              <span className="inline-block min-w-[10ch]">
                <TypingWord />
              </span>
            </div>
            <span className="block">
              that scale globally.
            </span>
          </h1>

          <div className="mb-6">
            <p className="type-section-intro w-full max-w-[420px] text-muted-foreground lg:max-w-[480px]">
              <span className="text-foreground font-medium">
                At Mastercard&apos;s Creative Studio,
              </span>{" "}
              designing systems and platforms that power global banking partnerships
              <span className="text-foreground font-medium">
                {" "}from early demos to production-ready experiences.
              </span>
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
                  src="/assets/images/pic.png"
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
                  {["Fintech", "Product Strategy", "Systems Builder"].map(tag => <Pill key={tag}>{tag}</Pill>)}
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
