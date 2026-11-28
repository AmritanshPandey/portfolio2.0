import { CsHeroShell } from "@/components/case-study/cs-hero-shell"
import { CsProvenance } from "@/components/case-study/cs-provenance"
import { CsSummary } from "@/components/case-study/cs-summary"
import { AddLater } from "@/components/shared/add-later"
import { WorkSpecimen } from "@/components/sections/work/work-specimens"
import { StudyChapter, StudyFigure, StudyScreen } from "@/components/study/study-chapter"
import { StudyCalls, StudyFigures, StudyOptions, StudyReflection } from "@/components/study/study-blocks"
import {
  DashboardMock,
  DrorTimeline,
  ProductCompare,
  RevenueChart,
  SosSketch,
  WhatWasCut,
} from "@/components/study/dror-visuals"

const GAPS = [
  { finding: "Connectivity assumption", change: "Life360 needed constant internet. Patchy connectivity in smaller cities broke it when it mattered." },
  { finding: "English-first UI", change: "English-heavy onboarding. Our users needed icon-first, low-literacy design." },
  { finding: "Family tracking ≠ safety in India", change: "‘Track your family’ felt invasive. We made it an opt-in, mutual safety circle." },
  { finding: "68% drop-off in Life360 onboarding", change: "Tested Life360 with 15 Indian users. They dropped off at permissions, the English UI, and the smartphone assumption." },
]

export default function Page() {
  return (
    <div className="min-h-screen">
      <CsHeroShell
        transitionName="case-citizen-safety"
        breadcrumb={{ kind: "Case Study", category: "Product · 0→1 + Pivot", client: "Dror · 2020–2021" }}
        keywords={["Sole PM + Designer", "0→1 Product", "B2C → B2B Pivot"]}
        title="Two products, one pivot, eleven months"
        lede={
          <>
            Sole PM and designer at Dror: a 0→1 consumer launch, a <strong>COVID-forced B2B pivot</strong>, and a
            lesson in <strong>rented product-market fit</strong>.
          </>
        }
        meta={{
          role: "Sole PM + Designer · Frontend (React)",
          organisation: "DROR Labs (later Lythouse)",
          team: "10 people · sole product owner",
          duration: "11 months · 2020 – 2021",
          platform: "iOS + Android",
        }}
        readTime="3 min read"
        aside={<WorkSpecimen slug="citizen-safety" />}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <CsProvenance kind="shipped" label="Shipped to real users, 2020–2021" />
          <CsProvenance kind="internal" label="Company later wound down" />
        </div>
      </CsHeroShell>

      <div className="ledger ledger-offset pb-8">
        <CsSummary
          problem="A 10-person startup's consumer safety app lost its use case to COVID lockdowns before it could make money."
          role="Sole PM and designer, plus React frontend: PRDs at noon, design at night, code in the afternoons."
          outcome="The B2B pivot shipped in six weeks and reached ₹1.98Cr lifetime revenue, until restrictions lifted and the market went with them."
        />
      </div>

      <StudyChapter
        id="problem"
        index={1}
        label="Problem"
        title="The product didn't fail. The world changed, twice."
        lede="We built the right product twice. Both times, an outside event made the market disappear. In a 10-person team, I was the PM, the designer, and part of the frontend, in three blocks a day."
        aside={
          <StudyFigure caption="Three acts, two forcing functions.">
            <DrorTimeline />
          </StudyFigure>
        }
      />

      <StudyChapter
        id="the-call"
        index={2}
        label="The pivot"
        ink
        title="The decision that changed everything."
        lede="Near-zero revenue and an erased use case. Enterprises with essential workers needed what we'd built, packaged for B2B, so we prototyped in days, showed it to clients, and committed."
      >
        <StudyOptions
          question="Which product would we be?"
          options={[
            {
              title: "Keep iterating on consumer",
              verdict: "Nobody knew when cities would move again. Waiting spent runway on a use case that no longer existed.",
            },
            {
              title: "Pivot to B2B workplace safety",
              verdict: "A six-week rebuild with the same team, but the demand was real and the first contracts signed in the window.",
              chosen: true,
            },
          ]}
        />
        <StudyFigure width="column" caption="The validation before committing.">
          <StudyFigures
            items={[
              { figure: "3 days", label: "Idea to working prototype." },
              { figure: "~5", label: "Enterprises shown the prototype." },
              { figure: "6 weeks", label: "Pivot decision to first B2B product." },
            ]}
          />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="the-work"
        index={3}
        label="The work"
        title="Two products, the same team, eleven months."
        lede="A consumer safety app built for India, then a workplace safety product rebuilt for enterprise, with a dashboard I designed at night and coded in the afternoons."
      >
        <StudyScreen
          refLabel="Act 1 · Consumer app"
          title="India's Life360, built for India."
          note="Life360 existed, but it wasn't built for India. Testing it with Indian users showed where it broke."
        >
          <div className="ledger-grid items-center gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <SosSketch />
              <p className="ledger-label mt-4 text-center">A coded sketch of the V1 idea, not the shipped screen.</p>
            </div>
            <ol className="col-span-12 border-b border-border lg:col-span-7 lg:col-start-6">
              {GAPS.map((g, i) => (
                <li key={g.finding} data-settle style={{ ["--i" as string]: i }} className="grid gap-x-[var(--col-gap)] gap-y-1 border-t border-border py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                  <p className="text-[16px] font-semibold leading-snug text-foreground">{g.finding}</p>
                  <p className="text-[15px] leading-snug text-muted-foreground">{g.change}</p>
                </li>
              ))}
              <li className="border-t border-border py-3">
                <AddLater block note="confirm the 68% Life360 drop-off. The Honasa study also cites “68%” for a different finding, so a reader may question both." />
              </li>
            </ol>
          </div>
        </StudyScreen>
        <StudyScreen
          refLabel="Act 3 · Enterprise rebuild"
          title="A compliance view for factory managers."
          note="Smart cards and phones detected when workers got too close for too long. Managers saw active workers, proximity events, compliance and at-risk zones, with weekly PDF reports added after the first client asked."
        >
          <StudyFigure caption="The factory manager dashboard, recreated with illustrative figures. React.js, designed and coded by me.">
            <DashboardMock />
          </StudyFigure>
        </StudyScreen>
        <StudyFigure width="column" caption="What changed between the two products.">
          <ProductCompare />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter id="decisions" index={4} label="Decisions" title="In a trust product, one failure loses the user.">
        <StudyCalls
          calls={[
            {
              title: "One reliable action, not a safety suite",
              call: "V1 requests included community reporting, live tracking, emergency calls, and driving tools. I shipped one action: one-tap SOS plus safety-circle setup.",
              cost: "A thinner V1 than stakeholders expected.",
              changed: "Zero critical failures in emergency response, and SOS reliability became the trust foundation.",
            },
            {
              title: "No confirmation screen for SOS",
              call: "A confirmation step tripled completion time under simulated stress in usability tests. One tap sends the SOS: speed over precision.",
              cost: "More accidental triggers, accepted for the seconds saved in real emergencies.",
            },
          ]}
        />
        <StudyFigure width="column" caption="What we cut from V1. Prioritisation is what you don't build.">
          <WhatWasCut />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="impact"
        index={5}
        label="Impact"
        title="Revenue tracked COVID, not product quality."
        lede="Company lifetime numbers, not just my 11 months. ₹1.98Cr sounds like a success. It isn't, against $494K (~₹4Cr) raised. We proved we could sell. We didn't prove the market would last."
      >
        <StudyFigures
          items={[
            { figure: "₹1.98Cr", label: "Lifetime revenue, mostly B2B." },
            { figure: "$494K", label: "Raised over 4 rounds, seed." },
            { figure: "23rd", label: "Of 215 active competitors." },
          ]}
        />
        <StudyFigure width="column" caption="Company revenue by quarter against COVID restrictions. When restrictions lifted, revenue fell.">
          <RevenueChart />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="reflection"
        index={6}
        label="Reflection"
        title="We built the right product for a temporary world."
        lede="Product-market fit that depends on an outside event isn't durable. Happy clients didn't matter once the reason to buy was gone. Now I ask what happens when the forcing function goes away."
      >
        <StudyReflection
          next="Look for the non-emergency version of the product in parallel, from early 2021."
          open="Whether the do-everything rhythm translates. It's a survival posture; leading through other people is a different skill."
        />
      </StudyChapter>
    </div>
  )
}
