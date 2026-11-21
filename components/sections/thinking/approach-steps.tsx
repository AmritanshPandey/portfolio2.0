"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { AsciiField } from "@/components/shared/ascii-field"
import { GlassPlate } from "@/components/sections/hero/glass-plate"
import { approachScene, type SceneLayout } from "./approach-scene"

/**
 * Approach: one ASCII stage the width of the screen (approach-scene.ts). An
 * illustration of the method at work fills the left of it, over a busy,
 * moving ground; the six steps sit on the right as a compact list on a pane
 * of glass, so the ground runs on under them, frosted. The heading sits on
 * a patch of quiet paper.
 *
 * The scene is placed from the DOM: the empty "slot" says where the
 * illustration goes and the heading block says where the ground keeps quiet.
 */

const STEPS = [
  { q: "Identify what cannot move", body: "Set the fixed points first, so the team knows where it can move." },
  { q: "Map the moving parts", body: "See flows, handoffs, and edge cases before committing to a screen." },
  { q: "Choose the smallest proof", body: "Build the smallest version that proves the decision." },
  { q: "Prototype the risk", body: "Use the right fidelity for the unknown: sketch, Figma, content, code, or a demo." },
  { q: "Make alignment concrete", body: "Turn debate into a shared artifact: a rule, a flow, a prototype." },
  { q: "Systematize what works", body: "Turn proven decisions into components, templates, and docs." },
]

// The illustration's width and height in its own units, and where its
// visual centre sits (the hand reaches in from the left).
const ART_W = 2.3
const ART_H = 2.05
const ART_SHIFT = 0.3

// A fine shading ramp, light to dense, so the forms model smoothly at a
// small cell size.
const RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"

export function ApproachSteps() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const quietRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  // Built once; the scene reads its layout every frame, so moving it needs
  // no re-render.
  const [{ motifs, place: placeScene }] = useState(() => {
    const scene = approachScene()
    return { motifs: [scene.motif], place: scene.place }
  })

  useLayoutEffect(() => {
    const field = fieldRef.current
    const slot = slotRef.current
    const quiet = quietRef.current
    const card = cardRef.current
    if (!field || !slot || !quiet || !card) return
    const place = () => {
      const f = field.getBoundingClientRect()
      const s = slot.getBoundingClientRect()
      const q = quiet.getBoundingClientRect()
      const c = card.getBoundingClientRect()
      const rect = (r: DOMRect, m: number) => ({
        x0: (r.left - m - f.left) / f.width,
        y0: (r.top - m - f.top) / f.height,
        x1: (r.right + m - f.left) / f.width,
        y1: (r.bottom + m - f.top) / f.height,
      })
      if (!f.width || !f.height) return
      const unit = Math.min(s.width / ART_W, s.height / ART_H)
      // A margin of paper around the heading.
      const m = 16
      const next: SceneLayout = {
        unit: unit / f.height,
        x: (s.left + s.width / 2 + ART_SHIFT * unit - f.left) / f.width,
        y: (s.top + s.height / 2 - f.top) / f.height,
        quiet: [rect(q, m)],
        busy: [rect(c, 0)],
      }
      placeScene(next)
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(field)
    ro.observe(slot)
    ro.observe(quiet)
    ro.observe(card)
    return () => ro.disconnect()
  }, [placeScene])

  return (
    <div className="relative">
      {/* The stage: full bleed, behind everything in the section. */}
      <div
        ref={fieldRef}
        aria-hidden
        // Faded out at the top and foot, so the field rises out of the page
        // and sinks back into it rather than starting at a hard edge.
        className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_84%,transparent)]"
      >
        <AsciiField motifs={motifs} cell={6} ramp={RAMP} fps={20} className="absolute inset-0" />
      </div>

      <div className="pointer-events-none relative ledger-grid gap-y-8 py-10 md:py-14 lg:grid-rows-[auto_1fr] lg:py-16">
        <div ref={quietRef} className="col-span-12 self-start space-y-5 lg:col-span-6">
          <h2 data-settle="title" className="type-section-title text-foreground">
            Approach
          </h2>
          <p data-settle style={{ ["--i" as string]: 1 }} className="type-section-intro max-w-[30ch] text-muted-foreground">
            How I turn ambiguity into decisions teams can build from.
          </p>
        </div>

        {/* Where the illustration is drawn. Empty: the field paints it. */}
        <div ref={slotRef} aria-hidden className="col-span-12 h-[320px] sm:h-[420px] lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:h-[min(72svh,660px)]" />

        <div ref={cardRef} className="pointer-events-auto col-span-12 self-center lg:col-span-5 lg:col-start-8 lg:row-start-2">
          <GlassPlate className="approach-glass p-5 sm:p-6 md:p-7">
            <ol>
              {STEPS.map((s, i) => (
                <li
                  key={s.q}
                  data-settle
                  style={{ ["--i" as string]: i + 2 }}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 border-border py-3.5 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b"
                >
                  <span aria-hidden className="ledger-label pt-[0.3em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold leading-[1.25] tracking-[-0.015em] text-foreground md:text-lg">
                      {s.q}
                    </h3>
                    <p className="mt-1 text-[14px] leading-[1.5] text-muted-foreground text-pretty md:text-[15px]">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </GlassPlate>
        </div>
      </div>
    </div>
  )
}
