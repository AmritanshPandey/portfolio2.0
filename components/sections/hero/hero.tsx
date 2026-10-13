import Image from "next/image"
import { CTA } from "@/components/shared/section-cta"
import { RollingWord } from "@/components/shared/rolling-word"
import { EMAIL_HREF, RESUME_HREF } from "@/lib/contact"
import { AddLater } from "@/components/shared/add-later"
import { HeroField } from "./hero-field"

const PROOF = [
  { text: "PartnerBank · configurable RFP demos", note: "turnaround number, once confirmed" },
  { text: "Email Builder · 50+ modular components" },
  { text: "6+ years · fintech, commerce, 0→1" },
]

/**
 * Ledger hero: one statement set across the whole sheet, then the evidence
 * laid out underneath like a statement of account. The headline rule draws
 * and the lines land on load (pure CSS, transform-only, so the text is
 * legible even if the animation never runs).
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate bg-background text-foreground"
      style={{ paddingTop: "calc(var(--nav-h) + clamp(40px, 7vw, 120px))" }}
    >
      <div className="ledger">
        {/* Meta line: availability is also the way in. */}
        <div data-hero-fade className="flex items-baseline justify-between gap-6 pb-4">
          <a
            href={EMAIL_HREF}
            aria-label="Open to conversations. Email Amritansh"
            className="ledger-label group/avail inline-flex items-center gap-2 text-foreground"
          >
            <span aria-hidden className="h-[7px] w-[7px] bg-accent" />
            <span className="underline decoration-foreground/30 underline-offset-[0.3em] transition-[text-decoration-color] duration-200 group-hover/avail:decoration-accent">
              Open to conversations
            </span>
          </a>
        </div>

        <div aria-hidden data-hero-rule className="rule-ink" />

        {/* Everything under the rule sits on one sheet of dots. */}
        <div className="relative pt-6 md:pt-10">
          <HeroField />

          <h1 className="hero-statement">
            <span data-hero-line="1" className="block">Product design for</span>
            <span data-hero-line="2" className="block whitespace-nowrap">
              <RollingWord words={["complex systems", "fintech", "AI agents", "payments", "enterprise"]} />
            </span>
            <span data-hero-line="3" className="block">
              people can trust<span className="text-accent">.</span>
            </span>
          </h1>

          <div className="ledger-grid mt-14 gap-y-12 md:mt-24">
            {/* Portrait: a plate on the sheet, captioned like a figure. */}
            <figure
              data-hero-card
              className="col-span-12 grid grid-cols-[42%_minmax(0,1fr)] items-end gap-x-4 sm:col-span-4 sm:block lg:col-span-3"
            >
              <div className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden bg-surface-2">
                <Image
                  src="/assets/images/pic.webp"
                  alt="Amritansh Pandey"
                  fill
                  priority
                  sizes="(max-width: 639px) 42vw, (max-width: 1023px) 30vw, 22vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="max-w-[320px] space-y-1 sm:mt-3">
                <p className="text-[15px] font-semibold tracking-[-0.01em]">Amritansh Pandey</p>
                <p className="ledger-label flex flex-col gap-y-0.5 lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-3">
                  <span className="whitespace-nowrap text-[11px] sm:text-xs">Fintech · Systems Builder</span>
                  <span aria-hidden>usually mid-demo</span>
                </p>
              </figcaption>
            </figure>

            {/* Intro and the two actions. */}
            <div data-hero-fade className="col-span-12 sm:col-span-8 lg:col-span-5 lg:col-start-5">
              <p className="text-[clamp(1.125rem,1.45vw,1.5rem)] leading-[1.42] tracking-[-0.012em] text-muted-foreground text-pretty">
                <span className="font-semibold text-foreground">Senior UX Designer at Mastercard.</span>{" "}
                I combine product thinking, visual systems, and front-end
                prototyping to make fintech, AI, and enterprise workflows
                clearer and more trustworthy.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CTA label="View selected work" href="#work" />
                <CTA label="View resume" href={RESUME_HREF} newTab variant="secondary" />
              </div>

              <AddLater
                block
                className="mt-8"
                note="the headline rotates “AI agents” and this intro says “AI”, but no case study shows AI work. Add the locked Agent Pay card, or drop AI from here."
              />
            </div>

            {/* Proof, set as line items. */}
            <ul data-hero-proof className="col-span-12 lg:col-span-3 lg:col-start-10">
              {PROOF.map((item, i) => (
                <li
                  key={item.text}
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline gap-x-2 border-t border-border py-3 last:border-b"
                >
                  <span className="ledger-label">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] leading-snug tracking-[-0.005em]">
                    {item.text}
                    {item.note && (
                      <>
                        {" "}
                        <AddLater note={item.note} />
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
