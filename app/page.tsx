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
        transition="How I approach systems, structure decisions, and design for scale under real-world constraints."
      >
        <CaseStudy />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <SystemsSection />
      </Section>

      {/* ───────────────── APPROACH ───────────────── */}
      <Section
        id="approach"
        bg="muted"
        title="How I Think"
        transition="Thinking feeds into side projects — where ideas get tested outside of client constraints."
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
        transition="Personal projects that feed directly into how I think about systems and product decisions."
      >
        <ExplorationsSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <InsightsSection />
      </Section>

      {/* ───────────────── IMPACT (ANCHOR) ───────────────── */}
      <Section
        id="impact"
        bg="muted"
        title="Driving Outcomes Beyond Product Design"
        transition="Beyond work and impact, here's more about how I think and what I focus on."
      >
        <LeadershipSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <AdvisorySection />
      </Section>

      {/* ───────────────── ABOUT ───────────────── */}
  
        <AboutSection />
   

    </main>
  )
}