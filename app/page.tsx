import AboutSection from "@/components/sections/about/about"
import LeadershipSection from "@/components/sections/about/leadership"
import AdvisorySection from "@/components/sections/about/mentorship"
import InsightsSection from "@/components/sections/articles/insights"
import Hero from "@/components/sections/hero/hero"
import ProductDesignApproachSection from "@/components/sections/thinking/product-design"
import ProductThinkingSection from "@/components/sections/thinking/product-thinking"
import CaseStudy from "@/components/sections/work/case-study"
import ExplorationsSection from "@/components/sections/work/exploration"
import SystemsSection from "@/components/sections/work/system"
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

      {/* ───────────────── SYSTEMS ───────────────── */}
      <Section
        id="systems"
        bg="dark"
        title="Systems"
        description="Reusable foundations for product logic, theming, governance, and handoff. The goal is to reduce repeated decisions without flattening context."
        transition="Those system choices shape how I approach new work."
        transitionVariant="highlight"
      >
        <SystemsSection />
      </Section>

      {/* ───────────────── APPROACH ───────────────── */}
      <Section
        id="approach"
        bg="muted"
        title="Approach"
        description="A practical operating model for moving from ambiguity to a decision teams can build from."
        transition="The same approach turns into a sharper set of decision frameworks."
      >
        <ProductDesignApproachSection />
      </Section>

      {/* ───────────────── THINKING ───────────────── */}
      <Section
        id="thinking"
        bg="default"
        title="Thinking"
        description="Frameworks I use when a product problem is unclear, political, technical, or easy to over-design."
        transition="Writing is where I test these ideas in public."
      >
        <ProductThinkingSection />
      </Section>

      {/* ───────────────── INSIGHTS ───────────────── */}
      <Section
        id="insights"
        bg="muted"
        title="Insights"
        description="Short essays on systems, incentives, risk, AI trust, and decision-making."
        transition="Explorations are where those ideas become working prototypes."
      >
        <InsightsSection />
      </Section>

      {/* ───────────────── EXPLORATIONS ───────────────── */}
      <Section
        id="explorations"
        bg="default"
        title="Explorations"
        description="Personal builds that test product and system questions outside client constraints."
        transition="Some of the same habits show up in how I lead, mentor, and align teams."
      >
        <ExplorationsSection />
      </Section>

      {/* ───────────────── LEADERSHIP ───────────────── */}
      <Section
        id="leadership"
        bg="muted"
        title="Leadership"
        description="Influence through decision framing, stakeholder alignment, documentation, critique, and making product quality easier to repeat."
        transition="Advisory work is a smaller, more direct version of the same pattern."
      >
        <LeadershipSection />
      </Section>

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
