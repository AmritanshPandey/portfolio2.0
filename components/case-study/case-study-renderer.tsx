import type { CaseStudy } from "@/lib/types/case-study"
import {
  CsHero,
  CsSection,
  CsList,
  CsDecision,
  CsSystem,
  CsFlow,
  CsImage,
  CsTimeline,
} from "@/components/case-study"

interface Props {
  data: CaseStudy
}

export function CaseStudyRenderer({ data }: Props) {
  return (
    <div className="min-h-screen">

      {/* ── 1. HERO ──────────────────────────────── */}
      <CsHero
        eyebrow={data.hero.eyebrow}
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        meta={data.hero.meta}
      />

      {/* ── 2. CONTEXT ───────────────────────────── */}
      <CsSection id="context" label="Context" variant="default">
        <CsList items={data.context.points} />
      </CsSection>

      {/* ── 3. PROBLEM ───────────────────────────── */}
      <CsSection id="problem" label="Problem" variant="muted">
        <blockquote className="border-l-2 border-accent/50 pl-6">
          <p className="text-xl md:text-2xl font-medium text-foreground leading-[1.5]">
            {data.problem.statement}
          </p>
        </blockquote>
      </CsSection>

      {/* ── 4. CONSTRAINTS ───────────────────────── */}
      <CsSection id="constraints" label="Constraints" variant="default">
        <CsList items={data.constraints.points} />
      </CsSection>

      {/* ── 5. ROLE ──────────────────────────────── */}
      <CsSection id="my-role" label="My Role" variant="muted">
        <div className="space-y-10">
          <div>
            <p className="
              text-[10px] font-semibold uppercase tracking-[0.18em]
              text-muted-foreground mb-5
            ">
              Ownership
            </p>
            <CsList items={data.role.ownership} variant="numbered" />
          </div>
          <div>
            <p className="
              text-[10px] font-semibold uppercase tracking-[0.18em]
              text-muted-foreground mb-5
            ">
              Collaboration
            </p>
            <CsList items={data.role.collaboration} />
          </div>
        </div>
      </CsSection>

      {/* ── 6. APPROACH ──────────────────────────── */}
      <CsSection id="approach" label="Approach" variant="default">
        <div className="space-y-12">
          <div>
            <p className="
              text-[10px] font-semibold uppercase tracking-[0.18em]
              text-muted-foreground mb-5
            ">
              Research Inputs
            </p>
            <CsList items={data.approach.inputs} />
          </div>
          <div>
            <p className="
              text-[10px] font-semibold uppercase tracking-[0.18em]
              text-muted-foreground mb-5
            ">
              Key Insights
            </p>
            <CsList items={data.approach.insights} variant="numbered" />
          </div>
          <div>
            <p className="
              text-[10px] font-semibold uppercase tracking-[0.18em]
              text-muted-foreground mb-5
            ">
              Design Implications
            </p>
            <CsList items={data.approach.implications} />
          </div>
        </div>
      </CsSection>

      {/* ── 7. KEY DECISIONS ─────────────────────── */}
      <CsSection id="key-decisions" label="Key Decisions" variant="dark">
        <div className="space-y-5">
          {data.decisions.map((decision, i) => (
            <CsDecision key={i} {...decision} index={i} />
          ))}
        </div>
      </CsSection>

      {/* ── 8. SYSTEM DESIGN ─────────────────────── */}
      <CsSection id="system-design" label="System Design" variant="dark" withDivider={false}>
        <div className="space-y-10">
          <CsSystem
            shared={data.system.shared}
            brandSpecific={data.system.brandSpecific}
          />
          {data.visuals?.architecture && (
            <CsImage
              src={data.visuals.architecture}
              alt="System architecture diagram"
              caption="Shared commerce platform with brand-level token overrides"
              dark
            />
          )}
        </div>
        {/* Closing dark separator */}
        <div className="h-px w-full bg-white/[0.06] mt-24" />
      </CsSection>

      {/* ── 9. SOLUTION ──────────────────────────── */}
      <CsSection id="solution" label="Solution" variant="default">
        <div className="space-y-10">
          <div>
            <p className="
              text-[10px] font-semibold uppercase tracking-[0.18em]
              text-muted-foreground mb-6
            ">
              User Flow
            </p>
            <CsFlow steps={data.solution.flows} />
          </div>
          <div>
            <p className="
              text-[10px] font-semibold uppercase tracking-[0.18em]
              text-muted-foreground mb-5
            ">
              Design Highlights
            </p>
            <CsList items={data.solution.highlights} />
          </div>
          {data.visuals?.flow && (
            <CsImage
              src={data.visuals.flow}
              alt="User flow diagram"
              caption="End-to-end purchase flow across five core commerce stages"
            />
          )}
        </div>
      </CsSection>

      {/* ── 10. IMPACT ───────────────────────────── */}
      <CsSection id="impact" label="Impact" variant="muted">
        <CsList items={data.impact.points} variant="numbered" />
      </CsSection>

      {/* ── 11. TRADEOFFS & LEARNINGS ────────────── */}
      <CsSection id="tradeoffs-learnings" label="Tradeoffs & Learnings" variant="default">
        <CsList items={data.tradeoffs} />
      </CsSection>

      {/* ── 12. TIMELINE ─────────────────────────── */}
      <CsSection id="timeline" label="Timeline" variant="muted">
        <CsTimeline items={data.evolution.timeline} />
      </CsSection>

      {/* ── 13. TAKEAWAY ─────────────────────────── */}
      <CsSection id="takeaway" label="Takeaway" variant="default">
        <blockquote className="border-l-2 border-accent/60 pl-6">
          <p className="text-xl md:text-2xl font-medium text-foreground leading-[1.5]">
            {data.takeaway}
          </p>
        </blockquote>
      </CsSection>

    </div>
  )
}
