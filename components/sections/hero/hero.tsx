"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Image from "next/image"
import { CTA } from "@/components/shared/section-cta"
import { TypingWord } from "@/components/shared/typing-effect"

export default function Hero() {
  const heroRef   = useRef(null)
  const cardRef   = useRef<HTMLDivElement>(null)
  const glowRef   = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  // ── GSAP entrance ───────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", {
        y: 16, opacity: 0, duration: 0.6, ease: "power3.out",
      })
      gsap.from(".hero-line", {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.1, delay: 0.15, ease: "power3.out",
      })
      gsap.from(".hero-sub", {
        y: 20, opacity: 0, duration: 0.7, delay: 0.55, ease: "power3.out",
      })
      gsap.from(".hero-image", {
        y: 40, opacity: 0, duration: 1.1, delay: 0.1, ease: "power3.out",
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // ── 3D tilt on photo card ────────────────────────────────────────
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5   // -0.5 → 0.5
    const y = (e.clientY - top)  / height - 0.5

    setTilt({ x: y * -12, y: x * 12 })

    // Move glow to follow cursor
    if (glowRef.current) {
      glowRef.current.style.left = `${(e.clientX - left)}px`
      glowRef.current.style.top  = `${(e.clientY - top)}px`
    }
  }

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  const onMouseEnter = () => setHovered(true)

  return (
  
    <section ref={heroRef} id="hero" className="relative bg-neutral-950 text-white overflow-hidden">

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(255,255,255,0.5) 80px), repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(255,255,255,0.5) 80px)",
        }}
      />

      {/* Ambient radial bloom */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_60%_70%_at_80%_30%,rgba(255,255,255,0.035)_0%,transparent_70%)]" />

      <div className="
        relative max-w-6xl mx-auto px-6
        pt-12 md:pt-32 lg:pt-40 pb-24
        grid lg:grid-cols-[1.6fr_1fr]
        gap-8 lg:gap-12 items-center
      ">

        {/* ── LEFT ─────────────────────────────── */}
        <div className="flex flex-col gap-5 max-w-2xl">

          {/* BADGE */}
          <div className="hero-badge self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-white/50 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Product Designer · Mastercard
          </div>

          {/* HEADING */}
          <h1 className="font-medium tracking-tight leading-[1.08]">
            <span className="hero-line block text-[clamp(36px,5.5vw,64px)] text-white">
              Designing fintech
            </span>
            <span className="hero-line block text-[clamp(36px,5.5vw,64px)] text-white/35 min-h-[1.2em]">
              <TypingWord />
            </span>
            <span className="hero-line block text-[clamp(36px,5.5vw,64px)] text-white">
              that scale globally.
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="hero-sub text-base md:text-lg text-white/50 leading-relaxed max-w-[440px]">
            At Mastercard, from design systems to{" "}
            <span className="text-white/90 font-medium">
              interactive demos for billion-dollar bank deals.
            </span>
          </p>

          {/* CTA ROW */}
          <div className="hero-sub flex flex-wrap items-center gap-3">
            <CTA variant="primary"   label="View work"        href="#work"       tone="light" />
            <CTA variant="secondary" label="Download resume"  href="/resume.pdf" icon="download" tone="light" />
          </div>

        </div>

        {/* ── RIGHT ────────────────────────────── */}
        <div className="hero-image flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[340px]">

            {/* Tilt wrapper — no overflow, no border-radius here to avoid GPU clipping bug */}
            <div
              ref={cardRef}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              onMouseEnter={onMouseEnter}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.015 : 1})`,
                transition: hovered
                  ? "transform 0.15s ease-out"
                  : "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
                willChange: "transform",
                borderRadius: "1rem",
                // Border here — outside the mask, always visible
                boxShadow: `0 0 0 1px rgba(255,255,255,${hovered ? "0.2" : "0.12"}), 0 24px 48px rgba(0,0,0,0.5)`,
              }}
              className="cursor-pointer"
            >
              <div
                className="relative bg-neutral-900"
                style={{
                  borderRadius: "1rem",
                  WebkitMaskImage: "radial-gradient(white, white)",
                  maskImage: "radial-gradient(white, white)",
                }}
              >

                {/* Cursor glow */}
                <div
                  ref={glowRef}
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 300ms ease",
                  }}
                />

                <div className="relative aspect-[2/3]">
                  <Image
                    src="/assets/images/pic.jpg"
                    alt="Amritansh Pandey"
                    fill
                    priority
                    className="object-cover object-top"
                    style={{
                      filter: hovered ? "brightness(1.06)" : "brightness(1)",
                      transition: "filter 300ms ease",
                    }}
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent" />

                {/* Name + tags */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-4">
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {["Mastercard", "Advisor", "Mentor"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.12] border border-white/20 text-white backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-white/60 mb-0.5 tracking-wide">Product Designer</p>
                  <p className="text-sm font-semibold text-white">Amritansh Pandey</p>
                </div>

              </div>
            </div>

            {/* Floating chips — bottom-right corner, overlapping card edge */}
            <div className="absolute -right-4 top-[30%] hidden lg:flex flex-col gap-0.5 bg-neutral-900/95 backdrop-blur-md border border-white/[0.12] rounded-xl px-3.5 py-2.5 min-w-[110px] z-10 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] uppercase tracking-wide text-white/35">Experience</span>
              <span className="text-sm font-semibold text-white">7+ years</span>
            </div>

            <div className="absolute -right-4 top-[30%] mt-[64px] hidden lg:flex flex-col gap-0.5 bg-neutral-900/95 backdrop-blur-md border border-white/[0.12] rounded-xl px-3.5 py-2.5 min-w-[110px] z-10 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <span className="text-[10px] uppercase tracking-wide text-white/35">Based in</span>
              <span className="text-sm font-semibold text-white">Gurgaon, IN</span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom border fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

    </section>
  )
}