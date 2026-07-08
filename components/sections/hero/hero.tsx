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
              className="mb-6 inline-flex w-fit max-w-full items-center gap-3 rounded-full border border-black/[0.07] bg-white/[0.82] px-4 py-2 shadow-[0_16px_40px_rgba(15,23,42,0.12)] ring-1 ring-white/70 backdrop-blur-xl dark:border-white/[0.10] dark:bg-white/[0.04] dark:shadow-none dark:ring-white/[0.04] md:mb-8"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <p className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium leading-6 tracking-normal text-foreground/70 dark:text-muted-foreground/74 sm:text-[13px]">
                <span className="text-foreground/90 dark:text-foreground/74">Senior UX Designer · Mastercard</span>
                <span aria-hidden className="hidden h-3 w-px bg-foreground/16 dark:bg-border sm:inline-block" />
                <span>Open to conversations</span>
              </p>
            </div>

            {/* Lines rise in with a small, non-clipping slide — no overflow
                mask, so the headline is legible even if the entrance animation
                is throttled or never plays (backgrounded-tab load, low-power
                webview). Content-visible-by-default; the motion is enhancement. */}
            <h1 className="type-display-hero relative z-10 w-max max-w-none">
              <span data-hero-line="1" className="block whitespace-nowrap">Product design for</span>
              <span data-hero-line="2" className="block whitespace-nowrap">
                <RollingWord
                  className="shimmer-accent"
                  words={["complex systems", "fintech", "AI agents", "payments", "enterprise"]}
                />
              </span>
              <span data-hero-line="3" className="block whitespace-nowrap">people can trust.</span>
            </h1>

            <div className="mt-8 flex max-w-[560px] flex-col items-start gap-6 md:mt-10">
              <p
                data-hero-fade
                className="type-section-intro text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  Senior UX Designer at Mastercard.
                </span>{" "}
                I combine product thinking, visual systems, and front-end
                prototyping to make fintech, AI, and enterprise workflows
                clearer, more trustworthy, and easier to use.
              </p>

              <div
                data-hero-fade
                className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
              >
                <CTA label="View selected work" href="#work" className="sm:w-auto sm:px-7 shadow-[0_6px_18px_rgba(0,0,0,0.08)]" />
                <CTA label="Explore the Lab" href="/playground" variant="secondary" className="sm:w-auto sm:px-7" />
              </div>

              {/* Proof strip — checkable evidence, not adjectives. */}
              <ul
                data-hero-fade
                className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1 font-mono text-[11px] leading-5 tracking-tight text-muted-foreground/85"
              >
                <li className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-accent/70" />
                  Agent Pay — demoed at Money20/20
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-accent/70" />
                  PartnerBank — same-day RFP demos
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-accent/70" />
                  7 years · fintech, commerce, 0→1
                </li>
              </ul>
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
