import { CsHeroShell } from "@/components/case-study/cs-hero-shell"
import { CsBrandSkinCompare, type BrandSkin } from "@/components/case-study/cs-brand-skin-compare"
import { CsProvenance } from "@/components/case-study/cs-provenance"
import { CsSummary } from "@/components/case-study/cs-summary"
import { WorkSpecimen } from "@/components/sections/work/work-specimens"
import { StudyChapter, StudyFigure } from "@/components/study/study-chapter"
import {
  StudyBars,
  StudyCalls,
  StudyFanout,
  StudyFigures,
  StudyLayers,
  StudyOptions,
  StudyReflection,
} from "@/components/study/study-blocks"
import { partnerBankBanks, partnerBankLayers } from "@/lib/data/partnerbank"

// Anonymised prospects: mockup palettes (DESIGN.md §2).
const BRAND_SKINS: BrandSkin[] = [
  { id: "north",    bank: "North Bank",     primary: "#E11D48", deep: "#9F1239", radius: "12px", fontLabel: "Onest",       fontStack: "var(--ff-sans), ui-sans-serif, system-ui, sans-serif" },
  { id: "heritage", bank: "Heritage Trust", primary: "#8A6420", deep: "#6E4E12", radius: "4px",  fontLabel: "Serif",       fontStack: "\"Iowan Old Style\", Georgia, \"Times New Roman\", serif" },
  { id: "verde",    bank: "Verde Bank",     primary: "#25785C", deep: "#1C5A45", radius: "18px", fontLabel: "System sans", fontStack: "ui-sans-serif, system-ui, -apple-system, sans-serif" },
]

const BANKS = partnerBankBanks.map((b) => ({ name: b.name.split(" ")[0], color: b.to }))

export default function Page() {
  return (
    <div className="min-h-screen">
      <CsHeroShell
        transitionName="case-white-label-rfp"
        breadcrumb={{ kind: "Case Study", category: "Enterprise Systems", client: "Mastercard · PartnerBank" }}
        keywords={["Enterprise Systems", "RFP Enablement", "Design Lead"]}
        title={
          <>
            Modular Systems for <em className="not-italic text-accent">Enterprise</em> RFP Velocity.
          </>
        }
        lede={
          <>
            Decoupled core UX from brand across PartnerBank, Mastercard&apos;s white-label banking platform,
            so a <strong>rigid template</strong> became a <strong>configurable system</strong> for RFP demos.
          </>
        }
        meta={{
          role: "Design Lead",
          organisation: "Mastercard · PartnerBank",
          timeline: "2023 – 2024",
          team: "Product · Eng · Sales",
          scope: "White-label RFP System",
        }}
        readTime="3 min read"
        aside={<WorkSpecimen slug="white-label-rfp" />}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <CsProvenance kind="shipped" label="In production, live RFP cycles" />
          <CsProvenance kind="anonymised" label="Bank brands anonymised" />
        </div>
      </CsHeroShell>

      <div className="ledger ledger-offset pb-8">
        <CsSummary
          problem="Demos decide enterprise RFPs, but every new bank needed manual design work, so effort grew with every deal."
          role="Led the design side: decoupled core UX from brand, standardised the component library, and introduced token theming so a re-skin became a configuration pass."
          outcome="A four-layer configurable architecture that made prospect re-skins a config swap, and cut a per-deal demo from about 10 days to about 3."
        />
      </div>

      <StudyChapter
        id="problem"
        index={1}
        label="Problem"
        title="A system built for consistency, not customization."
        lede="PartnerBank demos decide enterprise RFPs with major banks, but the platform was built to look the same everywhere. Each bank wanted its own look, so every deal meant hand edits, and design effort grew one for one with deal volume."
        aside={
          <StudyFigure caption="Before: one template, copied and edited by hand for every bank.">
            <StudyFanout tone="before" source="Static UI" sourceNote="Single template" targets={BANKS} targetNote="manual edits" />
          </StudyFigure>
        }
      />

      <StudyChapter
        id="the-call"
        index={2}
        label="The call"
        ink
        title="Brand became a layer above the components."
        lede="Keeping the template simple didn't remove the cost. It moved it into manual work on every RFP, at the worst moment in the deal. So I separated brand from architecture: four layers, each with one job, so brand changes never touch UX logic."
      >
        <StudyOptions
          question="Stay simple, or get fast?"
          options={[
            {
              title: "Preserve rigidity for system simplicity",
              verdict: "The cost didn't disappear. It moved into manual work on every RFP, at the worst moment in the deal.",
            },
            {
              title: "Introduce modular customization",
              verdict: "Brand-layer customisation didn't weaken the system once it was modular, and demos got faster.",
              chosen: true,
            },
          ]}
        />
        <div className="ledger-grid items-center gap-y-12">
          <StudyFigure className="col-span-12 lg:col-span-7" caption="The four layers. The brand token layer is the one the system turns on.">
            <StudyLayers
              layers={partnerBankLayers.map((l) => ({ ref: l.num, title: l.title, body: l.body, key: l.isCore }))}
            />
          </StudyFigure>
          <StudyFigure className="col-span-12 lg:col-span-4 lg:col-start-9" caption="After: every bank inherits the system.">
            <StudyFanout tone="after" source="Tokens + Components" sourceNote="Config engine" targets={BANKS} targetNote="config swap" />
          </StudyFigure>
        </div>
      </StudyChapter>

      <StudyChapter
        id="the-work"
        index={3}
        label="The work"
        title="Same component. Three brand skins."
        lede="One banking screen, three token sets. Drag the divider: colour, radius and type change; structure doesn't."
      >
        <StudyFigure caption="A coded recreation of the configured demo. Bank brands are anonymised; real prospect demos are confidential.">
          <CsBrandSkinCompare base={BRAND_SKINS[0]} alternates={BRAND_SKINS.slice(1)} />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="decisions"
        index={4}
        label="Decisions"
        title="Three calls that made the system configurable."
      >
        <StudyCalls
          calls={[
            {
              title: "Banking screens as swappable parts",
              call: "Broke every screen into independent units with variants and props.",
              cost: "Two sprints of upfront work before the payoff showed in demo build times.",
              changed: "New deals composed screens from the library, which grew from 8 to 31 components in six months.",
            },
            {
              title: "One config file, one brand skin",
              call: "Moved brand identity into one token configuration: colour, type, radius, elevation.",
              cost: "The schema took more definition than expected, and some bespoke requests still needed manual overrides.",
              changed: "A new bank's re-skin became a configuration pass, so design stopped being the blocker.",
            },
            {
              title: "Collapsing the time-critical steps",
              call: "Built a configuration layer that does brand application and component selection in one pass from the prospect's parameters.",
              cost: "One more layer for engineering to maintain, and highly bespoke requests still needed custom work.",
              changed: "The team could answer demo requests on timelines that weren't possible before, and sales cited it as a differentiator in competitive RFPs.",
            },
          ]}
        />
      </StudyChapter>

      <StudyChapter
        id="impact"
        index={5}
        label="Impact"
        title="A system built for sales velocity."
        lede="The new flexibility strengthened Mastercard's position in high-value RFP cycles."
      >
        <StudyFigures
          items={[
            { figure: "~10 → ~3", label: "Days to build a per-deal demo." },
            { figure: "8 → 31", label: "Components in the library, in six months." },
            { figure: "1 file", label: "To re-skin the platform for a new bank." },
          ]}
        />
        <StudyFigure width="column">
          <StudyBars
            title="Per-deal demo turnaround"
            bars={[
              { label: "Before", value: "~10 days", width: 100 },
              { label: "After", value: "~3 days", width: 30, after: true },
            ]}
          />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="reflection"
        index={6}
        label="Reflection"
        title="Customisation and consistency aren't a trade-off. They're a layering problem."
        lede="Once brand became a layer above components instead of a property of them, the system got fast without getting fragile."
      >
        <StudyReflection
          next="Scope the token schema with engineering before promising it. It took more definition than anyone expected, and that surprise cost credibility."
          open="How far tokens stretch. The model holds only while bespoke overrides stay the exception."
        />
      </StudyChapter>
    </div>
  )
}
