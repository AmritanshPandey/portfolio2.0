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
        eyebrow="Work"
        title="Selected Work & Systems"
        transition="Behind these systems is a structured way of thinking and decision-making."
        transitionEyebrow="The Thinking Behind the Work"
      >
        <CaseStudy />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <SystemsSection />
      </Section>

      {/* ───────────────── APPROACH ───────────────── */}
      <Section
        id="approach"
        bg="muted"
        eyebrow="Approach"
        title="How I Design & Make Product Decisions"
        transition="Beyond structured processes, exploration helps test ideas and refine thinking."
        transitionEyebrow="From Process to Exploration"
      >
        <ProductDesignApproachSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <ProductThinkingSection />
      </Section>

      {/* ───────────────── EXPLORATION ───────────────── */}
      <Section
        id="exploration"
        bg="default"
        eyebrow="Exploration"
        title="Building, Testing, and Learning Beyond Core Work"
        transition="These explorations translate into real-world impact across teams and products."
        transitionEyebrow="From Exploration to Impact"
      >
        <ExplorationsSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <InsightsSection />
      </Section>

      {/* ───────────────── IMPACT (ANCHOR) ───────────────── */}
      <Section
        id="impact"
        bg="muted"   
        eyebrow="Impact"
        title="Driving Outcomes Beyond Product Design"
        transition="Beyond work and impact, here's more about how I think and what I focus on."
        transitionEyebrow="About Me"
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