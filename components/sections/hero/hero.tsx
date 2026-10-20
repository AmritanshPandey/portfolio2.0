import { CTA } from "@/components/shared/section-cta"
import { RollingWord } from "@/components/shared/rolling-word"
import { EMAIL_HREF, RESUME_HREF } from "@/lib/contact"
import { AddLater } from "@/components/shared/add-later"
import { HeroField } from "./hero-field"
import { GlassPlate } from "./glass-plate"
import { HalftonePortrait } from "./halftone-portrait"
import { cn } from "@/lib/utils"

// The glass plate's reach past its content: it pads by what it extends into
// the gutter, so the content keeps its place on the grid.
const PLATE = "-mx-3 -my-3 p-3 sm:-mx-6 sm:-my-5 sm:px-6 sm:py-5"

/**
 * Ledger hero: one statement set across the whole sheet, then the portrait
 * and the intro with its two actions underneath. The headline rule draws
 * and the lines land on load (pure CSS, transform-only, so the text is
 * legible even if the animation never runs).
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate bg-background text-foreground"
      // Clear of the fixed nav, then a short breath before the meta line.
      style={{ paddingTop: "calc(var(--nav-h) + clamp(24px, 3.5vw, 56px))" }}
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

        {/* Everything under the rule sits on one sheet of dots, which runs
            on past the portrait and intro and fades out into the next section. */}
        <div className="relative pb-[clamp(56px,7vw,112px)] pt-6 md:pt-10">
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

          <div className="@container ledger-grid mt-14 gap-y-12 md:mt-24">
            {/* Portrait: drawn in the sheet's own dot screen on a desktop
                pointer, developing into the photo under the cursor;
                captioned like a figure. */}
            <figure
              data-hero-card
              className="col-span-12 grid grid-cols-[42%_minmax(0,1fr)] items-end gap-x-4 sm:col-span-4 sm:block lg:col-span-3"
            >
              <HalftonePortrait
                src="/assets/images/pic.webp"
                alt="Amritansh Pandey"
                sizes="(max-width: 639px) 42vw, (max-width: 1023px) 30vw, 22vw"
              />
              <figcaption className="max-w-[320px] space-y-1 sm:mt-3">
                <p className="text-[15px] font-semibold tracking-[-0.01em]">Amritansh Pandey</p>
                <p className="ledger-label flex flex-col gap-y-0.5 lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-3">
                  <span className="whitespace-nowrap text-[11px] sm:text-xs">Fintech · Systems Builder</span>
                  <span aria-hidden>usually mid-demo</span>
                </p>
              </figcaption>
            </figure>

            {/* Intro and the two actions, on a pane of glass so the dot grid
                frosts under the text. The plate reaches into the gutter by
                as much as it pads, so nothing on it moves. On wide screens it
                spans the rest of the row and matches the photo's height
                (.hero-intro): the intro hangs from the photo's top, the
                actions sit level with its foot. */}
            <div data-hero-fade className="hero-intro col-span-12 sm:col-span-8 lg:col-span-8 lg:col-start-5">
              <GlassPlate className={cn(PLATE, "lg:flex lg:h-[calc(100%+2.5rem)] lg:flex-col lg:justify-between")}>
                <p className="text-[clamp(1.125rem,2.5vw,2.375rem)] leading-[1.26] tracking-[-0.02em] text-muted-foreground text-pretty">
                  <span className="font-semibold text-foreground">Senior UX Designer at Mastercard.</span>{" "}
                  I combine product thinking, visual systems, and front-end
                  prototyping to make fintech, AI, and enterprise workflows
                  clearer and more trustworthy.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <CTA label="View selected work" href="#work" />
                  <CTA label="View resume" href={RESUME_HREF} newTab variant="secondary" />
                </div>
              </GlassPlate>
            </div>

            <AddLater
              block
              className="col-span-12 lg:col-span-8 lg:col-start-5"
              note="the headline rotates “AI agents” and this intro says “AI”, but no case study shows AI work. Add the locked Agent Pay card, or drop AI from here."
            />
          </div>
        </div>
      </div>
    </section>
  )
}
