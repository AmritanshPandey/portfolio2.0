"use client"

import Image from "next/image"
import { useRef, useCallback, useEffect } from "react"
import { CTA } from "@/components/shared/section-cta"
import { RollingWord } from "@/components/shared/rolling-word"
import { ShaderGrid } from "@/components/shared/shader-grid"
import { Pill } from "@/components/shared/pill"
import { gsap, prefersReducedMotion } from "@/lib/gsap"

/* Short, checkable proof — the strip under the hero leads with shipped
   outcomes, not adjectives. */
const PROOF = [
  "Agent Pay — demoed at Money20/20",
  "PartnerBank — same-day RFP demos",
  "7 years building fintech end to end",
]

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const tiltRaf = useRef(0)

  /* ── Entrance choreography — one orchestrated page-load ─────────────── */
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      // 135% (not ~110) because the reveal masks carry extra descender
      // slack below the line box — the line must clear that window too.
      tl.from("[data-hero-line]", {
        yPercent: 135,
        duration: 1.05,
        stagger: 0.1,
      })
        .from(
          "[data-hero-fade]",
          {
            y: 18,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          0.45
        )
        .from(
          "[data-hero-card]",
          {
            y: 28,
            rotate: -3,
            scale: 0.97,
            autoAlpha: 0,
            duration: 1.0,
            ease: "power3.out",
            // rotate/scale must clear, or the tilt handler's perspective
            // transform fights a leftover gsap transform.
            clearProps: "all",
          },
          0.55
        )
        .from(
          "[data-hero-proof]",
          {
            y: 12,
            autoAlpha: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          0.85
        )
    }, root)

    return () => ctx.revert()
  }, [])

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
      className="relative overflow-hidden bg-background text-foreground"
    >
      {/* Cursor-reactive dot field — the pointer drags the dots like water
          and pools an ember glow around itself. Fine-pointer desktops only;
          the static-grid fallback + reduced-motion handling live inside. */}
      <div className="hidden lg:block">
        <ShaderGrid
          spacing={18}
          dotSize={0.07}
          radius={0.13}
          drag={1.35}
          maxDrag={0.01}
          fallbackClassName="hidden lg:block"
        />
      </div>

      {/* Ground the section into the page bg, top and bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to bottom, var(--background) 0%, transparent 18%, transparent 78%, var(--background) 100%)" }}
      />

      {/* Stage vignette — eases the haze off at the edges so the light
          reads as pooled on the work, not wallpapered across the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 42%, transparent 52%, color-mix(in srgb, var(--background) 72%, transparent) 100%)" }}
      />

      {/* Low warm pool anchoring the proof strip — the second, quieter
          light of the studio scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[-8%] h-[420px] w-[640px] rounded-full opacity-60 dark:opacity-100"
        style={{ background: "radial-gradient(closest-side, rgba(249,115,22,0.07), transparent 70%)" }}
      />

      <div className="hero-vh relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 sm:px-6 pt-28 md:pt-32">
        <div className="relative flex flex-1 flex-col justify-center pb-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-14">

          {/* ── Left column: statement + supporting row ─────────────── */}
          <div className="flex min-w-0 flex-col">
            <p
              data-hero-fade
              className="mb-6 flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground md:mb-8"
            >
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
              Product Thinker · Mastercard · 7 yrs in product
            </p>

            {/* Each reveal mask carries 0.22em of bottom slack (pulled back
                with a negative margin) so descenders — g, y, p — never get
                cropped by the overflow clip at tight line-height. */}
            <h1 className="type-display-hero relative z-10 max-w-[14ch]">
              <span className="block overflow-hidden pt-[0.08em] -mt-[0.08em] pb-[0.22em] -mb-[0.22em]">
                <span data-hero-line className="block">Designing fintech</span>
              </span>
              <span className="block overflow-hidden pt-[0.08em] -mt-[0.08em] pb-[0.22em] -mb-[0.22em]">
                <span data-hero-line className="block">
                  <RollingWord className="shimmer-accent" />
                </span>
              </span>
              <span className="block overflow-hidden pt-[0.08em] -mt-[0.08em] pb-[0.22em] -mb-[0.22em]">
                <span data-hero-line className="block">that scale globally.</span>
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
                designing systems and platforms that power global banking
                partnerships
                <span className="font-medium text-foreground">
                  {" "}from early demos to production-ready experiences.
                </span>
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
            className="relative mx-auto mt-12 w-[240px] rotate-[-2deg] lg:mx-0 lg:mt-0 lg:w-[clamp(216px,19vw,280px)] lg:justify-self-end lg:rotate-[2.5deg]"
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
                  sizes="(max-width: 1024px) 240px, 290px"
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

        {/* ── Proof strip — outcomes first, then the scroll cue ───────── */}
        <div className="relative mt-14 flex items-center justify-between gap-6 border-t border-border/60 py-6 md:py-7">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {PROOF.map((item) => (
              <li
                key={item}
                data-hero-proof
                className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
          <div data-hero-proof className="scroll-cue hidden h-9 w-px shrink-0 sm:block" aria-hidden />
        </div>
      </div>
    </section>
  )
}
