import { CTA } from "@/components/shared/section-cta"
import { FadeIn } from "@/components/shared/fade-in"

const EMAIL = "amritansh.pandey6@gmail.com"

/**
 * Closing band — the site's one explicit conversion moment. A short trajectory
 * paragraph (the leadership signal ISB / design-leader readers look for)
 * followed by a specific, non-generic call to action.
 */
export function ClosingCta() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border/50 bg-background"
    >
      <div className="relative mx-auto max-w-5xl px-5 py-24 sm:px-6 md:py-32">
        <FadeIn>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Building toward product leadership
          </p>
        </FadeIn>

        <FadeIn delay={0.06}>
          <p className="mt-6 max-w-3xl text-balance text-[22px] font-medium leading-[1.4] tracking-[-0.01em] text-foreground md:text-[30px]">
            My work has moved from 0→1 startup products to global enterprise
            fintech, where clarity, trust, and scale matter as much as craft.
            I&apos;m most interested in the next question: how we make
            AI-mediated product experiences credible enough to rely on.
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mt-12 flex flex-col gap-6 border-t border-border/50 pt-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.015em] text-foreground md:text-[34px]">
                Building a complex product, platform, or AI experience?
                <span className="text-muted-foreground"> Let&apos;s make it clearer.</span>
              </h2>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <CTA
                label="Start a conversation"
                href={`mailto:${EMAIL}?subject=Let%27s%20talk`}
                className="sm:px-7"
              />
              <CTA
                label="Read my thinking"
                href="/articles"
                variant="secondary"
                className="sm:px-7"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
