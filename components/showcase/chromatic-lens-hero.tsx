"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

/**
 * Chromatic-lens hero — a cursor-following disc that reveals a tinted,
 * chromatically-aberrated, halftone copy of the giant type beneath it.
 *
 * The base headline is plain, fully-legible foreground type at all times; the
 * lens is a set of masked overlay layers (glow, halftone, aberrated ghost, rim)
 * that only ADD the distortion inside a circle centred on the pointer. Because
 * legibility never depends on the overlay, no-JS / reduced-motion / crawler
 * renders all still read the headline.
 *
 * Motion is compositor-cheap: one rAF loop lerps the lens toward its target and
 * writes only two CSS custom properties (--lx / --ly). It pauses off-screen and
 * in hidden tabs. Fine pointers follow the cursor; coarse pointers get a slow
 * autonomous drift so touch visitors still see the effect; reduced motion parks
 * the lens over one word.
 */

const LINES = ["Product design", "for fintech", "that can't", "afford to miss"]

/** The headline lines, shared by the base heading and the aberrated ghost so
 *  the two copies stay identical. Hoisted to module scope (not defined in
 *  render) so its identity is stable — satisfies react-hooks/static-components. */
function TypeLines() {
  return (
    <>
      {LINES.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </>
  )
}

export function ChromaticLensHero() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarse = window.matchMedia("(pointer: coarse)").matches

    // Lens position in % of the hero box: t = target, c = current (smoothed).
    let tx = 42
    let ty = 52
    let cx = tx
    let cy = ty
    const write = () => {
      root.style.setProperty("--lx", `${cx}%`)
      root.style.setProperty("--ly", `${cy}%`)
    }
    write()

    // Reduced motion: fixed lens over the accent line, no loop, no listeners.
    if (reduce) return

    let raf = 0
    let running = true
    let last = performance.now()

    const clamp = (v: number) => (v < 0 ? 0 : v > 100 ? 100 : v)
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const r = root.getBoundingClientRect()
      // Clamp to the hero box — the listener is global so the lens keeps
      // following from anywhere, but the target never runs past the edges
      // (which would otherwise send the disc off-screen and snap on re-entry).
      tx = clamp(((e.clientX - r.left) / r.width) * 100)
      ty = clamp(((e.clientY - r.top) / r.height) * 100)
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now

      if (coarse) {
        // Gentle Lissajous drift so touch devices still get the reveal.
        const s = now / 1000
        tx = 50 + Math.sin(s * 0.55) * 26
        ty = 50 + Math.sin(s * 0.9 + 1.1) * 16
      }

      // Frame-rate-independent exponential smoothing.
      const k = 1 - Math.exp(-9 * dt)
      cx += (tx - cx) * k
      cy += (ty - cy) * k
      write()

      raf = running ? requestAnimationFrame(loop) : 0
    }

    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true })

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting
        if (running && !raf) {
          last = performance.now()
          raf = requestAnimationFrame(loop)
        } else if (!running && raf) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { threshold: 0 }
    )
    io.observe(root)

    return () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      io.disconnect()
    }
  }, [])

  return (
    <main className="relative min-h-[100svh] bg-background text-foreground">
      {/* Halftone base grid — the light dotted field behind the type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(currentColor 0.9px, transparent 1px)",
          backgroundSize: "16px 16px",
          color: "color-mix(in srgb, var(--foreground) 22%, transparent)",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, #000 55%, transparent 100%)",
        }}
      />

      {/* Top-left chrome — back link + eyebrow, both on blurred chips so they
          stay legible over the giant type they sit on top of. */}
      <div className="absolute left-5 top-24 z-30 flex flex-wrap items-center gap-2 md:left-8">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-[12px] font-medium text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45"
        >
          <IconArrowLeft size={14} stroke={2} />
          Showcase
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-md">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Kinetic type · Chromatic lens
        </span>
      </div>

      {/* The stage */}
      <section
        ref={rootRef}
        className="clens flex min-h-[100svh] flex-col justify-center px-5 md:px-8"
      >
        {/* 1 — base type, always legible. The page's primary content, so it's
            the document's <h1>; the ghost copy below is aria-hidden. */}
        <h1 className="clens__type text-foreground">
          <TypeLines />
        </h1>

        {/* 2 — accent bloom (unmasked halo) */}
        <div aria-hidden className="clens__layer clens__glow" />

        {/* 3 — the reveal disc: halftone + aberrated ghost, clipped to the circle */}
        <div aria-hidden className="clens__layer clens__reveal">
          <div className="clens__halftone absolute inset-0" />
          <div className="clens__type clens__ghost">
            <TypeLines />
          </div>
        </div>

        {/* 4 — lens rim */}
        <div aria-hidden className="clens__rim" />
      </section>

      {/* Legibility scrim — the type bleeds to the bottom edge, so fade the
          canvas back in under the subhead. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-background via-background/85 to-transparent"
      />

      {/* Subhead + hint, anchored to the base of the viewport */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 px-5 pb-10 md:flex-row md:items-end md:justify-between md:px-8 md:pb-12">
        <p className="max-w-[46ch] text-[15px] leading-relaxed text-foreground/75 md:text-[17px]">
          Seven years shipping payments, platforms, and AI commerce, from the
          first demo to the CPO&apos;s Money20/20 stage.
        </p>
        <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
          Move your cursor
        </p>
      </div>
    </main>
  )
}
