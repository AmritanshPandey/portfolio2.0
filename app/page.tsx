import AboutSection from "@/components/sections/about/about"
import LeadershipSection from "@/components/sections/about/leadership"
import AdvisorySection from "@/components/sections/about/mentorship"
import InsightsSection from "@/components/sections/articles/insights"
import Hero from "@/components/sections/hero/hero"
import ProductDesignApproachSection from "@/components/sections/thinking/product-design"
import ProductThinkingSection from "@/components/sections/thinking/product-thinking"
import CaseStudy from "@/components/sections/work/case-study"
import ExplorationsSection from "@/components/sections/work/exploration"
import { Section } from "@/components/shared/section"

export default function Page() {
  return (
    <main>

      {/* ───────────────── HERO ───────────────── */}
      <Hero />

      {/* ───────────────── WORK ───────────────── */}
      <Section
        id="work"
        bg="default"
        title="Selected Work"
        description="Case studies across AI payments, enterprise demo systems, commerce infrastructure, and early-stage product work. Each one is framed around the constraint, the decision, and what changed after the work shipped."
        transition="The strongest work was not only screen-level. It created reusable foundations teams could keep using."
      >
        <CaseStudy />
      </Section>

      {/* ───────────────── EXPLORATIONS ───────────────── */}
      <Section
        id="explorations"
        bg="muted"
        title="Explorations"
        description="Self-directed work outside client constraints — from a reusable fintech interface system to live product prototypes — where I test product and system ideas and leave behind a clearer point of view."
        transition="Those system choices shape how I approach new work."

      >
        <ExplorationsSection />
      </Section>

      {/* ───────────────── APPROACH ───────────────── */}
      <Section
        id="approach"
        bg="grid"
        title="Approach"
        description="A practical operating model for moving from ambiguity to a decision teams can build from."
        transition="The same approach turns into a sharper set of decision frameworks."
      >
        <ProductDesignApproachSection />
      </Section>

      {/* ───────────────── THINKING ───────────────── */}
  

      {/* ───────────────── INSIGHTS ───────────────── */}
      <Section
        id="insights"
        bg="muted"
        title="Insights"
        description="Short essays on systems, incentives, risk, AI trust, and decision-making."
        transition="Some of the same habits show up in how I lead, mentor, and align teams."
      >
        <InsightsSection />
      </Section>

      {/* ───────────────── LEADERSHIP ───────────────── */}
      {/* <Section
        id="leadership"
        bg="default"
        title="Leadership"
        description="Influence through decision framing, stakeholder alignment, documentation, critique, and making product quality easier to repeat."
        transition="Advisory work is a smaller, more direct version of the same pattern."
      >
        <LeadershipSection />
      </Section> */}

      {/* ───────────────── ADVISORY ───────────────── */}
      <Section
        id="advisory"
        bg="default"
        title="Advisory"
        description="A compact view of the teams, founders, and designers I have helped with product direction, UX critique, and portfolio growth."
        transition="The last section is less about work output and more about what keeps me curious."
      >
        <AdvisorySection />
      </Section>

      {/* ───────────────── ABOUT ───────────────── */}
        
      <AboutSection />

    </main>
  )
}
