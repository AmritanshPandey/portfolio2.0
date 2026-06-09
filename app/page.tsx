import AboutSection from "@/components/sections/about/about"
import LeadershipSection from "@/components/sections/about/leadership"
import AdvisorySection from "@/components/sections/about/mentorship"
import InsightsSection from "@/components/sections/articles/insights"
import Hero from "@/components/sections/hero/hero"
import ProductDesignApproachSection from "@/components/sections/thinking/product-design"
import ProductThinkingSection from "@/components/sections/thinking/product-thinking"
import CaseStudy from "@/components/sections/work/case-study"
import ExplorationsSection from "@/components/sections/work/exploration"
import { FancyDivider } from "@/components/shared/divider"
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
        description="Case studies across fintech, commerce, and early-stage products. Each one traces the constraint, the decision it forced, and the outcome that followed."
        transition="The same systems thinking shows up in personal experiments and product builds."
      >
        <CaseStudy />
      </Section>

      {/* ───────────────── APPROACH ───────────────── */}
      <Section
        id="approach"
        bg="muted"
        title="How I Think"
        transition="Thinking feeds into side projects, where ideas get tested outside of client constraints."
      >
        <ProductDesignApproachSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <ProductThinkingSection />
      </Section>

      {/* ───────────────── EXPLORATION ───────────────── */}
      <Section
        id="exploration"
        bg="default"
        title="Building and Testing Ideas Outside of Work"
        description="Personal products and design systems built to test ideas outside the usual constraints."
        transition="Writing is where I pressure-test the same ideas in a more direct form."
      >
        <ExplorationsSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <InsightsSection />
      </Section>

      {/* ───────────────── IMPACT (ANCHOR) ───────────────── */}
      {/* <Section
        id="impact"
        bg="muted"
        title="Driving Outcomes Beyond Product Design"
        transition="Beyond work and impact, here's more about how I think and what I focus on."
      >
        <LeadershipSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <AdvisorySection />
      </Section> */}

      {/* ───────────────── ABOUT ───────────────── */}
  
        <AboutSection />
   

    </main>
  )
}
