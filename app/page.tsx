import AboutSection from "@/components/sections/about/about"
import { TrajectorySection } from "@/components/sections/about/trajectory"
import AdvisorySection from "@/components/sections/about/mentorship"
import InsightsSection from "@/components/sections/articles/insights"
import Hero from "@/components/sections/hero/hero"
import ProductDesignApproachSection from "@/components/sections/thinking/product-design"
import CaseStudy from "@/components/sections/work/case-study"
import ExplorationsSection from "@/components/sections/work/exploration"
import { Section } from "@/components/shared/section"

export default function Page() {
  return (
    <>

      {/* ───────────────── HERO ───────────────── */}
      <Hero />

      {/* ───────────────── WORK ───────────────── */}
      <Section
        id="work"
        bg="default"
        title="Selected Work"
        description="Case studies across AI payments, enterprise systems, D2C commerce, and early-stage product work."
        headerAnimated={false}
      >
        <CaseStudy />
      </Section>

      {/* ───────────────── EXPLORATIONS ───────────────── */}
      <Section
        id="explorations"
        bg="muted"
        title="Explorations"
        description="Self-directed work outside client constraints — testing product ideas and building reusable system foundations."
      >
        <ExplorationsSection />
      </Section>

      {/* ───────────────── APPROACH ───────────────── */}
      {/* Heading + intro live inside the deck (two-column), so no Section header here. */}
      <Section id="approach" bg="approach">
        <ProductDesignApproachSection />
      </Section>

      {/* ───────────────── THINKING ───────────────── */}
  

      {/* ───────────────── INSIGHTS ───────────────── */}
      <Section
        id="insights"
        bg="muted"
        title="Insights"
        description="Short essays on systems, incentives, risk, AI trust, and decision-making."
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

      {/* ───────────────── TRAJECTORY ───────────────── */}
      <Section
        id="trajectory"
        bg="default"
        title="Trajectory"
        description="From 0→1 startup product to global enterprise fintech, and where the work is heading next."
      >
        <TrajectorySection />
      </Section>

      {/* ───────────────── ADVISORY ───────────────── */}
      <Section
        id="advisory"
        bg="muted"
        title="Advisory"
        description="Teams, founders, and designers I've advised on product direction, UX critique, and portfolio growth."
      >
        <AdvisorySection />
      </Section>

      {/* ───────────────── ABOUT ───────────────── */}

      <AboutSection />


    </>
  )
}
