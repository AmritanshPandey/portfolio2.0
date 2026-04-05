"use client"

import {
  CaseStudyHero,
  CaseStudySection,
  CaseStudyGrid,
  CaseStudyDecision,
  CaseStudyMetrics,
  CaseStudyArchitecture,
  CaseStudyFlow,
  CaseStudyImpact,
  CaseStudyTradeoffs,
} from "@/components/casestudy"

export default function CaseStudyExample() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <CaseStudyHero
        title="D2C Platform Redesign"
        subtitle="Increased conversion by 42% and reduced checkout abandonment from 68% to 32% through strategic product redesign and user-centric flows."
        meta={{
          role: "Lead Product Designer",
          duration: "6 months",
          platform: "Web & Mobile",
        }}
      />

      {/* Problem & Research */}
      <CaseStudySection
        title="Challenge"
        subtitle="The existing platform suffered from high friction and poor user retention, particularly at critical conversion moments."
      >
        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
          After analyzing user behavior, we identified three core issues: overly complex checkout flows, poor mobile experience, and unintuitive product discovery. These bottlenecks were costing the business 34% of potential revenue annually.
        </p>
      </CaseStudySection>

      {/* Research Insights */}
      <CaseStudySection title="Research Insights">
        <CaseStudyGrid
          items={[
            {
              title: "User Interviews",
              description: "Conducted 20+ interviews revealing that 68% abandoned carts due to checkout complexity",
            },
            {
              title: "Usability Testing",
              description: "Found 4 critical friction points in the product discovery and purchase flow",
            },
            {
              title: "Analytics Review",
              description: "Mobile traffic represented 62% of sessions but only 28% of conversions",
            },
          ]}
        />
      </CaseStudySection>

      {/* Key Decisions */}
      <CaseStudySection title="Strategic Decisions" variant="dark">
        <div className="space-y-12">
          <CaseStudyDecision
            title="One-Click Checkout"
            problem="Users were abandoning carts due to multi-step forms requiring excessive information"
            decision="Implemented progressive form with pre-filled data and guest checkout option, reducing form fields by 60%"
            tradeoff="Required investment in address verification APIs, but reduced friction by 3x and increased mobile conversions"
          />

          <CaseStudyDecision
            title="Mobile-First Architecture"
            problem="Mobile experience was an afterthought, causing high bounce rates on phones"
            decision="Rebuilt product discovery with touch-friendly navigation and bottom sheet controls optimized for mobile"
            tradeoff="Desktop experience initially remained unchanged, requiring parallel design efforts, but mobile conversion doubled"
          />

          <CaseStudyDecision
            title="Personalization Engine"
            problem="Users couldn't find products relevant to them, leading to poor engagement"
            decision="Built ML-powered recommendation system that learns from user behavior and displays contextual suggestions"
            tradeoff="Increased infrastructure complexity and costs by 15%, but improved user engagement by 89%"
          />
        </div>
      </CaseStudySection>

      {/* Product Flow */}
      <CaseStudySection title="User Journey">
        <div className="mb-8">
          <p className="text-gray-600 mb-6">New checkout flow optimized for conversion:</p>
          <CaseStudyFlow
            steps={[
              "Browse",
              "Add to Cart",
              "Quick Review",
              "Guest Checkout",
              "Payment",
              "Confirmation",
            ]}
          />
        </div>
      </CaseStudySection>

      {/* Architecture */}
      <CaseStudySection title="Technical Architecture">
        <CaseStudyArchitecture
          title=""
          layers={[
            {
              title: "Frontend",
              items: ["Next.js + React", "TypeScript", "Tailwind CSS"],
              columns: 3,
            },
            {
              title: "Services",
              items: ["API Gateway", "Recommendation Engine", "Payment Processor"],
              columns: 3,
            },
            {
              title: "Data",
              items: ["PostgreSQL", "Redis Cache", "Analytics"],
              columns: 3,
            },
          ]}
        />
      </CaseStudySection>

      {/* Metrics */}
      <CaseStudySection title="Impact Achieved">
        <CaseStudyMetrics
          metrics={[
            { value: "42%", label: "Conversion Rate Increase" },
            { value: "3.2s", label: "Page Load Improvement" },
            { value: "89%", label: "Engagement Growth" },
            { value: "$2.1M", label: "Revenue Impact (Year 1)" },
          ]}
        />
      </CaseStudySection>

      {/* Outcomes */}
      <CaseStudySection title="Business Outcomes">
        <CaseStudyImpact
          points={[
            "Increased conversion rate from 2.4% to 3.4% within 3 months of launch",
            "Reduced cart abandonment from 68% to 38% through streamlined checkout",
            "Improved mobile conversion rate by 156%, matching desktop performance",
            "Generated $2.1M in incremental revenue in the first year",
            "Expanded user base by 15k+ new active users through improved discoverability",
            "Improved NPS score from 28 to 61, signaling stronger product-market fit",
          ]}
        />
      </CaseStudySection>

      {/* Learnings */}
      <CaseStudySection title="Key Learnings & Tradeoffs">
        <CaseStudyTradeoffs
          items={[
            "Mobile-first redesign should have been prioritized earlier; we lost 6 months of optimization opportunity",
            "Personalization implementation was more complex than anticipated, requiring 2x estimated engineering effort",
            "Incremental rollout via A/B testing took longer than expected but prevented costly mistakes",
            "Vendor lock-in with payment processor created technical debt; would recommend multi-provider strategy",
            "Team scaling happened too quickly during implementation, impacting code quality and knowledge transfer",
          ]}
        />
      </CaseStudySection>

      {/* Reflection */}
      <CaseStudySection title="What I'd Do Differently">
        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
          In hindsight, I would have conducted more extensive user testing before committing to the personalization engine. The ROI was strong, but the implementation complexity surprised us. I&apos;d also invest more time in team alignment early on—the disconnect between product and engineering initially slowed our velocity by 30%.
        </p>
      </CaseStudySection>
    </main>
  )
}
