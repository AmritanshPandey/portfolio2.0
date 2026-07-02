"use client"

import Image from "next/image"
import { useRef, useCallback } from "react"
import { CTA } from "@/components/shared/section-cta"
import { RollingWord } from "@/components/shared/rolling-word"
import { Pill } from "@/components/shared/pill"

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const tiltRaf = useRef(0)

  /* ── Cursor tilt on the photo card (unchanged mechanics) ────────────── */
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const cx = e.clientX
    const cy = e.clientY
    if (tiltRaf.current) return

    tiltRaf.current = requestAnimationFrame(() => {
      tiltRaf.current = 0
      const glare = glareRef.current
      const rect = card.getBoundingClientRect()
      const x = (cx - rect.left) / rect.width
      const y = (cy - rect.top) / rect.height

      const rX = -(y - 0.5) * 14
      const rY = (x - 0.5) * 14

      card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.03,1.03,1.03)`
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.16) 0%, transparent 65%)`
      }
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    if (tiltRaf.current) { cancelAnimationFrame(tiltRaf.current); tiltRaf.current = 0 }
    const card = cardRef.current
    const glare = glareRef.current
    if (!card) return
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
    if (glare) glare.style.background = "transparent"
  }, [])

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative overflow-hidden text-foreground"
    >
      {/* The cursor-reactive dot field is no longer part of the hero — it's a
          standalone, full-viewport layer (see <SiteBackground/> in the root
          layout) that shows through this transparent section. The atmosphere
          overlays below still ground that field at the section's edges. */}

      {/* Ground the section into the page bg, top and bottom */}
      <div
        data-hero-atmosphere
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to bottom, var(--background) 0%, transparent 18%, transparent 78%, var(--background) 100%)" }}
      />

      {/* Stage vignette — eases the haze off at the edges so the light
          reads as pooled on the work, not wallpapered across the section */}
      <div
        data-hero-atmosphere
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 42%, transparent 52%, color-mix(in srgb, var(--background) 72%, transparent) 100%)" }}
      />

      {/* Low warm pool anchoring the studio scene */}
      <div
        data-hero-atmosphere
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[-8%] h-[420px] w-[640px] rounded-full opacity-60 dark:opacity-100"
        style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.07), transparent 70%)" }}
      />

      <div className="hero-vh relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 sm:px-6 pt-28 md:pt-32">
        <div className="relative flex flex-1 flex-col justify-center pb-10 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-x-10 lg:gap-x-14">

          {/* ── Left column: statement + supporting row ─────────────── */}
          <div className="flex min-w-0 flex-col">
            <div
              data-hero-fade
              className="mb-6 flex max-w-[34rem] items-start gap-3 md:mb-8"
            >
              <span className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_14px_rgba(16,185,129,0.5)]" />
              <p className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium leading-6 tracking-normal text-muted-foreground/72 sm:text-[13px]">
                <span className="text-foreground/74">Product thinker at Mastercard</span>
                <span aria-hidden className="hidden h-3 w-px bg-border sm:inline-block" />
                <span>7 yrs in product</span>
              </p>
            </div>

            {/* Each reveal mask carries 0.22em of bottom slack (pulled back
                with a negative margin) so descenders — g, y, p — never get
                cropped by the overflow clip at tight line-height. */}
            <h1 className="type-display-hero relative z-10 max-w-[16ch] md:max-w-[14ch]">
              <span className="block overflow-hidden pt-[0.08em] -mt-[0.08em] pb-[0.22em] -mb-[0.22em]">
                <span data-hero-line="1" className="block">Designing fintech</span>
              </span>
              <span className="block overflow-hidden pt-[0.08em] -mt-[0.08em] pb-[0.22em] -mb-[0.22em]">
                <span data-hero-line="2" className="block">
                  <RollingWord className="shimmer-accent" />
                </span>
              </span>
              <span className="block overflow-hidden pt-[0.08em] -mt-[0.08em] pb-[0.22em] -mb-[0.22em]">
                <span data-hero-line="3" className="block">that scale globally.</span>
              </span>
            </h1>

            <div className="mt-8 flex max-w-[560px] flex-col items-start gap-6 md:mt-10">
              <p
                data-hero-fade
                className="type-section-intro text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  At Mastercard&apos;s Creative Studio,
                </span>{" "}
                designing systems and platforms that power global banking partnerships.
              </p>

              <div
                data-hero-fade
                className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
              >
                <CTA label="View work" href="#work" className="sm:w-auto sm:px-7 shadow-[0_6px_18px_rgba(0,0,0,0.08)]" />
                <CTA label="Resume" href="/resume.pdf" variant="secondary" className="sm:w-auto sm:px-7" />
              </div>
            </div>
          </div>

          {/* ── Right column: the tilted polaroid, in its own lane ──── */}
          <div
            data-hero-card
            className="relative mx-auto mt-12 w-[270px] rotate-[-2deg] md:mx-0 md:mt-0 md:w-[200px] md:justify-self-end md:rotate-[2.5deg] lg:w-[clamp(216px,19vw,280px)]"
          >
            <div
              ref={cardRef}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              className="relative overflow-hidden rounded-[20px] border border-border/60 bg-background/80 shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              style={{ willChange: "transform", transition: "transform 0.15s ease-out" }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/assets/images/pic.png"
                  alt="Amritansh Pandey"
                  fill
                  priority
                  sizes="(max-width: 767px) 270px, (max-width: 1023px) 200px, 280px"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
              <div className="absolute bottom-0 space-y-2.5 p-4">
                <div className="flex flex-wrap gap-1.5">
                  {["Fintech", "Systems Builder"].map(tag => (
                    <Pill key={tag}>{tag}</Pill>
                  ))}
                </div>
                <p className="text-[15px] font-semibold text-white">Amritansh Pandey</p>
              </div>
              {/* Specular glare — follows cursor */}
              <div
                ref={glareRef}
                className="pointer-events-none absolute inset-0 z-10"
                style={{ background: "transparent" }}
              />
            </div>
            {/* One handwritten grace note per surface */}
            <p
              aria-hidden
              className="mt-3 text-right text-[1.15rem] text-muted-foreground"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              usually mid-demo
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
