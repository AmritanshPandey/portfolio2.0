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

      <Hero />

      <Section
        id="work"
        bg="subtle"
        eyebrow="Work"
        title="Selected Work & Systems"
        transition="Behind these systems is a structured way of thinking and decision-making."
        transitionEyebrow="Looking Beyond Products"
      >
        <CaseStudy />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <SystemsSection />
      </Section>

      <Section
        id="approach"
        bg="light"
        eyebrow="Approach"
        title="How I Design & Make Product Decisions"
        transition="The way I approach design and product decisions is rooted in a structured way of thinking."
        transitionEyebrow="Designing for Impact"
      >
        <ProductDesignApproachSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <ProductThinkingSection />
      </Section>


      <Section
        id="exploration"
           bg="subtle"
        eyebrow="Exploration"
        title="Building, Testing, and Learning Beyond Core Work"
        transition="The way I approach design and product decisions is rooted in a structured way of thinking."
        transitionEyebrow="Exploration"
      >
        <ExplorationsSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <InsightsSection />
      </Section>

      <Section
        id="impact"
           bg="light"
        eyebrow="Impact"
        title="Driving Outcomes Beyond Product Design"
        transition="Applying product thinking across teams, influencing strategy, and contributing beyond core product work."
        transitionEyebrow="Imoact"
      >
        <LeadershipSection />
        <FancyDivider variant="gradient" className="my-8 md:my-12" />
        <AdvisorySection />
      </Section>

      <AboutSection />
    </main>
  )
}