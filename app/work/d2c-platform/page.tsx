import { CsHeroShell } from "@/components/case-study/cs-hero-shell"
import { CsProvenance } from "@/components/case-study/cs-provenance"
import { CsSummary } from "@/components/case-study/cs-summary"
import { DeviceScene } from "@/components/case-study/device-scene"
import { AddLater } from "@/components/shared/add-later"
import { WorkSpecimen } from "@/components/sections/work/work-specimens"
import { StudyChapter, StudyFigure, StudyScreen } from "@/components/study/study-chapter"
import {
  StudyBars,
  StudyCalls,
  StudyFanout,
  StudyFigures,
  StudyLayers,
  StudyOptions,
  StudyReflection,
} from "@/components/study/study-blocks"

// The real storefront accents: the token layer that varies per brand
// (mockup palettes, DESIGN.md §2).
const BRAND = {
  mamaearth: "#00AFEF",
  dermaco: "#217A6E",
  aqualogica: "#0066CC",
} as const

const BRANDS = [
  { name: "Mamaearth", short: "Mamaearth", color: BRAND.mamaearth, radius: "14px", font: "DM Sans", tagline: "Natural · Toxin Free", product: "Vitamin C" },
  { name: "The Derma Co.", short: "Derma Co.", color: BRAND.dermaco, radius: "8px", font: "Inter", tagline: "Clinically Tested", product: "AHA · BHA" },
  { name: "Aqualogica", short: "Aqualogica", color: BRAND.aqualogica, radius: "12px", font: "Figtree", tagline: "Glow · Hydrate", product: "Glow+ Dew" },
]

/** One product card, configured three ways: the same markup, three token sets. */
function BrandCards() {
  return (
    <div className="grid gap-x-[var(--col-gap)] gap-y-10 md:grid-cols-3">
      {BRANDS.map((b, i) => (
        <div key={b.name} data-settle style={{ ["--i" as string]: i }}>
          {/* The storefront's own card: someone else's interface. */}
          <div
            data-keep-radius
            className="overflow-hidden border border-[#e4e2dc] bg-white text-[#1a1a1a]"
            style={{ borderRadius: b.radius, fontFamily: "var(--ff-sans), ui-sans-serif, system-ui, sans-serif" }}
          >
            <div className="grid h-36 place-items-center" style={{ background: b.color }}>
              <div className="h-20 w-12 rounded-[6px] bg-white/90" />
            </div>
            <div className="p-4">
              <p className="text-[11px] text-[#6b6862]">{b.tagline}</p>
              <p className="mt-1 text-[15px] font-semibold">{b.product}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[14px] font-semibold">₹ 549</span>
                <span className="px-4 py-2 text-[12px] font-semibold text-white" style={{ background: b.color, borderRadius: b.radius }}>
                  Add to Cart
                </span>
              </div>
            </div>
          </div>
          <dl className="mt-4 border-b border-border">
            {[
              ["primary", b.color],
              ["radius", b.radius],
              ["font", b.font],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-t border-border py-2">
                <dt className="ledger-label">{k}</dt>
                <dd className="ledger-label text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen">
      <CsHeroShell
        transitionName="case-d2c-platform"
        breadcrumb={{ kind: "Case Study", category: "D2C Commerce", client: "Honasa Consumer" }}
        keywords={["First In-House UX Designer", "0→1 Commerce Foundations", "Multi-Brand Scale"]}
        title={
          <>
            One System. <em className="not-italic text-accent">Three Brands.</em> Eight Weeks.
          </>
        }
        lede={
          <>
            Built first-party storefronts for Mamaearth, <strong>The Derma Co., and Aqualogica</strong> on one{" "}
            <strong>shared commerce system</strong>.
          </>
        }
        meta={{
          role: "First In-House UX Designer",
          organisation: "Honasa Consumer Limited",
          timeline: "8 Weeks",
          platform: "Web + Mobile",
          scope: "PDP · Cart · Checkout",
        }}
        readTime="3 min read"
        aside={<WorkSpecimen slug="d2c-platform" />}
      >
        <CsProvenance kind="shipped" label="Shipped to production, 2022" />
      </CsHeroShell>

      <div className="ledger ledger-offset pb-8">
        <CsSummary
          problem="Three brands sold almost entirely through Amazon and Nykaa. Honasa needed its own storefronts before the next seasonal sale, with no design system and eight weeks."
          role="First in-house UX designer. Ran research, defined the shared architecture and tokens, designed PDP, cart, and checkout for all three brands, and owned handoff."
          outcome={
            <>
              All three storefronts shipped in the window with no critical post-launch bugs.{" "}
              <AddLater note="which brand onboarded next, in three weeks. The page names Aqualogica, but Aqualogica was one of the three launch brands." />
            </>
          }
        />
      </div>

      <StudyChapter
        id="problem"
        index={1}
        label="Problem"
        title="Three brands, no owned channel, and a tight window."
        lede="Every sale went through Amazon or Nykaa, along with the commission and the customer data. The real problem was the math: two designers, four engineers, three brands, eight weeks, and no design process, component library or handoff workflow to start from."
        aside={
          <StudyFigure caption="Before: revenue without ownership. The marketplaces kept the commission and the data.">
            <StudyFanout
              tone="before"
              source="Amazon · Nykaa"
              sourceNote="3rd party"
              targets={BRANDS.map((b) => ({ name: b.short }))}
              targetNote="no data"
            />
          </StudyFigure>
        }
      />

      <StudyChapter
        id="the-call"
        index={2}
        label="The call"
        ink
        title="One backbone, three token skins."
        lede="The five-day research sprint found that all three brands shared identical commerce logic. They diverged only in visual language. So commerce shipped once, and each brand became a configuration on top."
      >
        <StudyOptions
          question="The math only worked one way."
          options={[
            {
              title: "Three independent storefronts",
              verdict: "Three times the effort, then every improvement made three times. Impossible in the window.",
            },
            {
              title: "One backbone, three token skins",
              verdict: "Brand teams gave up bespoke layouts in v1, which caused friction. But it shipped, and improvements now reach all three brands.",
              chosen: true,
            },
          ]}
        />
        <div className="ledger-grid items-center gap-y-12">
          <StudyFigure className="col-span-12 lg:col-span-7" caption="A shared backbone below, brand identity as a token layer above.">
            <StudyLayers
              layers={[
                { ref: "L4", title: "Brand Storefront", body: "Campaign imagery and art direction, brand-specific only where it matters." },
                { ref: "L3", title: "Brand Token Layer", body: "Colour, type, radius, and elevation. A new skin is one configuration change.", key: true },
                { ref: "L2", title: "Shared Component Library", body: "Product card, line item, quantity control, CTA: one set of components." },
                { ref: "L1", title: "Core Commerce Logic", body: "PDP, cart, checkout, and post-purchase, shared by all three storefronts." },
              ]}
            />
          </StudyFigure>
          <StudyFigure className="col-span-12 lg:col-span-4 lg:col-start-9" caption="After: owned channel, owned data.">
            <StudyFanout
              tone="after"
              source="Token + Components"
              sourceNote="Shared system"
              targets={BRANDS.map((b) => ({ name: b.short, color: b.color }))}
              targetNote="owned data"
            />
          </StudyFigure>
        </div>
      </StudyChapter>

      <StudyChapter
        id="the-work"
        index={3}
        label="The work"
        title="PDP, cart and checkout, designed once for three brands."
        lede="V1 was the revenue-critical flows only. Each one is the same component in every storefront, themed by tokens."
      >
        <StudyScreen
          refLabel="01 · Product page"
          title="The purchase decision happens here."
          note="68% of drop-offs happened at the PDP, not checkout. So: ingredient transparency, trust signals, and a sticky CTA."
        >
          <DeviceScene kind="iphone" screen="/assets/images/honasa/placeholder-phone.png" alt="Placeholder for Mamaearth's product page on an iPhone." />
        </StudyScreen>
        <StudyScreen
          refLabel="02 · Cart"
          title="A single cart component, themed three ways."
          note="Thumbnail, quantity, cross-sell and summary: a brand token swap, no structural duplication."
        >
          <DeviceScene kind="duo" screen="/assets/images/honasa/placeholder-duo.png" alt="Placeholder for the cart and checkout on an iPhone Duo, unfolding as you scroll." />
        </StudyScreen>
        <StudyScreen
          refLabel="03 · Checkout"
          title="From six steps to three."
          note="Single-page checkout cut form steps from 6 to 3, with address autocomplete and a persistent summary."
        >
          <DeviceScene kind="macbook" screen="/assets/images/honasa/placeholder-desktop.png" alt="Placeholder for Mamaearth's storefront on a MacBook Air, opening as you scroll." />
        </StudyScreen>
        <StudyScreen
          refLabel="04 · Tokens"
          title="Same system. Three distinct brands."
          note="A single product card component, configured through three brand token sets. No structural change, just a token swap."
        >
          <BrandCards />
        </StudyScreen>
      </StudyChapter>

      <StudyChapter id="decisions" index={4} label="Decisions" title="Two calls that decided what shipped.">
        <StudyCalls
          calls={[
            {
              title: "Revenue-critical flows only",
              call: "Stakeholders wanted wishlists, recommendations, loyalty, and bundles in v1, which would miss the sale window. I kept only PDP, cart, checkout, and confirmation, with a written reason for every deferral.",
              cost: "Personalisation waited a quarter, which frustrated some stakeholders.",
              changed: "An on-time launch, and the deferred list became the funded v2 roadmap.",
            },
            {
              title: "Trust signals as system components",
              call: "Ingredient transparency drove Mamaearth purchases, so I built ingredient highlights, trust badges, and certifications as shared PDP components.",
              cost: "More upfront design and spec work.",
              changed: (
                <>
                  All three brands used them in v1, and Mamaearth&apos;s PDP-to-cart conversion improved.{" "}
                  <AddLater note="how much Mamaearth's PDP-to-cart conversion improved, if you can share it." />
                </>
              ),
            },
          ]}
        />
      </StudyChapter>

      <StudyChapter
        id="impact"
        index={5}
        label="Impact"
        title="A system that kept paying back."
        lede="Each later brand and improvement was faster than the one before."
      >
        <StudyFigures
          items={[
            { figure: "8 weeks", label: "Three storefronts, inside the sale deadline." },
            { figure: "3 weeks", label: "To onboard the next brand." },
            { figure: "Zero", label: "Ramp-up for two designers who joined later; the docs were the onboarding." },
          ]}
        />
        <StudyFigure width="column">
          <StudyBars
            title="Time to launch a new brand on the system"
            bars={[
              { label: "Initial (v1)", value: "8 weeks", width: 100 },
              { label: "Next brand", value: "3 weeks", width: 37, after: true },
            ]}
          />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="reflection"
        index={6}
        label="Reflection"
        title="Separate what varies from what doesn't, on day one."
        lede="Scalable systems come from separating what varies from what doesn't, explicitly, on day one. Every hard call here was that principle under pressure."
      >
        <StudyReflection
          next="Set up Storybook and the final tokens before launch. The post-launch refactor cost a cycle."
          open="Whether the no-bespoke-layouts rule survives a brand team with time, budget, and a strong opinion."
        />
      </StudyChapter>
    </div>
  )
}
