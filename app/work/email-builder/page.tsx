import { CsHeroShell } from "@/components/case-study/cs-hero-shell"
import { CsProvenance } from "@/components/case-study/cs-provenance"
import { CsSummary } from "@/components/case-study/cs-summary"
import { WorkSpecimen } from "@/components/sections/work/work-specimens"
import { StudyChapter, StudyFigure } from "@/components/study/study-chapter"
import {
  StudyBars,
  StudyCalls,
  StudyFigures,
  StudyLayers,
  StudyOptions,
  StudyReflection,
} from "@/components/study/study-blocks"
import { BuilderShift, EmailAnatomy, EmailClients, OutlookTable } from "@/components/study/email-visuals"

export default function Page() {
  return (
    <div className="min-h-screen">
      <CsHeroShell
        transitionName="case-email-builder"
        breadcrumb={{ kind: "Case Study", category: "Design Systems", client: "Mastercard · Creative Studio" }}
        keywords={["Design System Lead", "Email Infrastructure", "No-Code Tooling"]}
        title={
          <>
            From <em className="not-italic text-accent">HTML dependency</em> to no-code email infrastructure.
          </>
        }
        lede={
          <>
            Owned the component architecture and design system for Mastercard&apos;s global email builder,
            defining <strong>what got built, why, and in what order</strong>. The constraint wasn&apos;t brand.
            It was <strong>Outlook</strong>.
          </>
        }
        meta={{
          role: "Design System Lead",
          organisation: "Mastercard · Creative Studio",
          duration: "6–8 months",
          scope: "50+ Components · 28 Templates",
          adoption: "Mastercard-wide",
        }}
        readTime="3 min read"
        aside={<WorkSpecimen slug="email-builder" />}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <CsProvenance kind="shipped" label="In production, Mastercard-wide" />
          <CsProvenance kind="anonymised" label="Visuals anonymised" />
        </div>
      </CsHeroShell>

      <div className="ledger ledger-offset pb-8">
        <CsSummary
          problem="Custom emails needed HTML, so teams waited on agencies or fell back to outdated templates, and after the rebrand the gap showed."
          role="Owned the component architecture, standards, governance, and roadmap. An engineer owned the HTML and builder; another designer owned the builder UI."
          outcome="A no-code builder on 50+ Outlook-safe components and 28 templates, adopted Mastercard-wide. Teams build branded emails without HTML."
        />
      </div>

      <StudyChapter
        id="problem"
        index={1}
        label="Problem"
        title="Mastercard's brand evolved. Its email system hadn't."
        lede="Custom emails needed HTML, so teams relied on slow, costly agencies or skipped custom emails for outdated templates. Even good HTML broke in Outlook Desktop, still dominant in enterprise. Simplicity wasn't a design preference. It was an engineering requirement."
        aside={
          <StudyFigure caption="Every design decision was filtered through: will this render in Outlook Desktop?">
            <EmailClients />
          </StudyFigure>
        }
      />

      <StudyChapter
        id="the-call"
        index={2}
        label="The call"
        ink
        title="Components, not templates."
        lede="A template needs re-editing on every brand update. A component propagates. So the system became 50+ modular pieces in four levels, and a change at the bottom reaches every template above it."
      >
        <StudyOptions
          question="What should the system be made of?"
          options={[
            { title: "Keep the agency model", verdict: "Slow, costly, inconsistent: the status quo that caused the problem." },
            { title: "Build 28 bespoke templates", verdict: "The fastest visible launch, but every brand update would mean editing all 28 by hand." },
            {
              title: "Build a component library",
              verdict: "More upfront work, but a brand update now changes one component and reaches every template.",
              chosen: true,
            },
          ]}
        />
        <StudyFigure width="column" caption="Four levels. The components are where the Outlook work lives.">
          <StudyLayers
            layers={[
              { ref: "L4", title: "Templates", body: "28 templates across 9 categories, each built from L2 components." },
              { ref: "L3", title: "Patterns", body: "Recurring structures: campaigns, launches, newsletters, invitations." },
              { ref: "L2", title: "Components", body: "50+ Outlook-safe blocks: heroes, CTAs, cards, editorial, events, legal footers.", key: true },
              { ref: "L1", title: "Foundations", body: "Spacing, type, colour tokens, grid, and accessibility standards. These rarely change." },
            ]}
          />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="the-work"
        index={3}
        label="The work"
        title="Anyone can build a branded email."
        lede="Pick components, fill in content, ship. The system owns the HTML underneath, including every Outlook workaround."
      >
        <StudyFigure caption="A coded, anonymised recreation of an email built from four library blocks. The builder itself is an internal Mastercard tool.">
          <EmailAnatomy />
        </StudyFigure>
        <StudyFigure caption="The barrier wasn't capability. It was confidence.">
          <BuilderShift />
        </StudyFigure>
        <StudyFigure width="column" caption="Six times the modern answer lost to the one that renders everywhere.">
          <OutlookTable />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter id="decisions" index={4} label="Decisions" title="Two calls that kept it simple.">
        <StudyCalls
          calls={[
            {
              title: "Design within the Outlook constraint",
              call: "Stakeholders wanted multi-column layouts, custom fonts, and dynamic CTAs that Outlook couldn't render reliably. I simplified the design instead of hacking around Outlook.",
              cost: "Saying no, repeatedly, with Global Brand backing the line.",
              changed: "More durable emails. In enterprise inboxes, the simplest emails tend to perform best.",
            },
            {
              title: "Simple enough for anyone to use",
              call: "Anyone without HTML can build a branded email: pick components, fill content, ship.",
              cost: "Power users lost pixel-level control and export options, on purpose.",
              changed: "Teams that had avoided custom emails started sending them more often.",
            },
          ]}
        />
      </StudyChapter>

      <StudyChapter
        id="impact"
        index={5}
        label="Impact"
        title="A system the whole organisation adopted."
        lede="The measure wasn't components shipped; it was how many people stopped needing HTML."
      >
        <StudyFigures
          items={[
            { figure: "50+", label: "Outlook-safe, on-brand components." },
            { figure: "28", label: "Templates across 9 categories." },
            { figure: "Zero", label: "HTML needed to send a branded email." },
          ]}
        />
        <StudyFigure width="column">
          <StudyBars
            title="What it took to send a branded, Outlook-safe email"
            bars={[
              { label: "Before", value: "HTML + agency", width: 100 },
              { label: "After", value: "Zero code", width: 8, after: true },
            ]}
          />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="reflection"
        index={6}
        label="Reflection"
        title="Constrained enough to work in Outlook. Flexible enough that teams wanted it."
        lede="Design systems need political backing, not just good design. And the Outlook constraint I fought at the time is why the system lasted."
      >
        <StudyReflection
          next="Instrument usage from launch. Knowing which templates and components teams used would have sharpened every prioritisation call."
          open="Whether simplicity holds as power users push for pixel-level control."
        />
      </StudyChapter>
    </div>
  )
}
