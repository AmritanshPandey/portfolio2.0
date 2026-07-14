import { FadeIn } from "@/components/shared/fade-in"

/**
 * Career trajectory — the leadership signal. A four-stage arc from 0→1 startup
 * to global enterprise fintech to AI-mediated commerce, plus the operating
 * model underneath it. Facts only (role, domain, what the stage built); no
 * invented metrics or confidential detail.
 */

const STAGES = [
  {
    period: "2016–2019",
    org: "DROR Labs",
    role: "0→1 product design",
    line: "Built an early-stage citizen-safety product from ambiguity to real-world use: startup constraints, rapid iteration, product strategy under pressure.",
    tag: "Startup · 0→1",
  },
  {
    period: "2019–2021",
    org: "Mamaearth · Honasa",
    role: "Consumer & commerce UX",
    line: "Designed multi-brand D2C commerce experiences that balance consistency with distinct consumer identities across a fast-scaling platform.",
    tag: "Consumer · Commerce",
  },
  {
    period: "2021–now",
    org: "Mastercard · Creative Studio",
    role: "Senior UX Designer",
    line: "Enterprise fintech, payments, and agentic commerce: product systems, demos, and RFP experiences, built with product, brand, engineering, and senior VP/SVP stakeholders.",
    tag: "Enterprise · Fintech",
    current: true,
  },
  {
    period: "Next",
    org: "AI-mediated products",
    role: "Where I'm heading",
    line: "The systems that make AI agents credible enough to act on your behalf: trust, control, and clarity in the moments that carry real stakes.",
    tag: "AI · Agentic",
  },
]

const PROCESS = [
  "Understand the system",
  "Frame the opportunity",
  "Simplify the journey",
  "Prototype the future",
  "Align stakeholders",
  "Make it real",
]

export function TrajectorySection() {
  return (
    <div>
      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <ol className="relative grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((s, i) => (
          <FadeIn key={s.org} delay={i * 0.06} y={20} className="h-full">
            <li className="group relative flex h-full flex-col gap-4 bg-background p-6 md:p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {s.period}
                </span>
                {s.current && (
                  <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/[0.08] px-2 py-0.5 text-[10px] font-medium text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Now
                  </span>
                )}
              </div>

              <div className="mt-auto">
                <h3 className="text-[19px] font-semibold leading-tight tracking-[-0.01em] text-foreground">
                  {s.org}
                </h3>
                <p className="mt-1 text-[13px] font-medium text-accent">{s.role}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                  {s.line}
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {s.tag}
                </p>
              </div>
            </li>
          </FadeIn>
        ))}
      </ol>

      {/* ── How I work ───────────────────────────────────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="mt-10 flex flex-col gap-4 border-t border-border/50 pt-8 md:flex-row md:items-center md:gap-6">
          <span className="shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            How I work
          </span>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[13.5px] text-foreground/80">
            {PROCESS.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span>{step}</span>
                {i < PROCESS.length - 1 && (
                  <span aria-hidden className="text-accent/60">→</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </FadeIn>
    </div>
  )
}
