import AboutSection from "@/components/sections/about/about"
import AdvisorySection from "@/components/sections/about/mentorship"
import InsightsSection from "@/components/sections/articles/insights"
import Hero from "@/components/sections/hero/hero"
import ProductDesignApproachSection from "@/components/sections/thinking/product-design"
import CaseStudy from "@/components/sections/work/case-study"
import ExplorationsSection from "@/components/sections/work/exploration"
import { SystemStack } from "@/components/sections/systems/system-stack"
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
        title="Systems that shipped."
        description="Four case studies across enterprise demo systems, multi-brand commerce, design systems, and a 0→1 pivot. Each one names the options considered and what actually changed."
        headerAnimated={false}
      >
        <CaseStudy />
      </Section>

      {/* ───────────────── SYSTEMS ───────────────── */}
      <Section
        id="systems"
        bg="default"
        title="One system, taken apart."
        description="PartnerBank, layer by layer: why the brand lives in exactly one layer, what that cost, and what it bought."
      >
        <SystemStack />
      </Section>

      {/* ───────────────── EXPLORATIONS ───────────────── */}
      <Section
        id="explorations"
        bg="muted"
        title="Explorations"
        description="Self-directed work: product ideas and reusable systems, outside client constraints."
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

      {/* ───────────────── ADVISORY ───────────────── */}
      <Section
        id="advisory"
        bg="default"
        title="Advisory, on the side"
        description="Product direction, UX critique, and mentoring for a small number of teams and designers."
        headerVariant="quiet"
      >
        <AdvisorySection />
      </Section>

      {/* ───────────────── ABOUT ───────────────── */}

      <AboutSection />


    </>
  )
}
