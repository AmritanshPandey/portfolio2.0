"use client"

import { motion, easeOut } from "framer-motion"

// ─── Design tokens ─────────────────────────────────────────────
// Orange accent: #E8621A (warm, not harsh)
// Orange light:  #FDF1E8 (background tint)
// Orange mid:    #F5A86E (secondary accent)

// ─── Animation helper ──────────────────────────────────────────
const fadeUp = {
  initial:    { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: easeOut },
  viewport:   { once: true, margin: "-60px" },
}

// ─── Primitives ────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-4 h-px bg-[#E8621A]" />
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#E8621A]">
        {children}
      </p>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-[1.85rem] font-medium tracking-tight text-neutral-900 leading-[1.2] mb-5">
      {children}
    </h2>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-neutral-500 text-base leading-[1.85]">
      {children}
    </p>
  )
}

function Divider() {
  return (
    <div className="relative my-16 md:my-20">
      <hr className="border-neutral-100" />
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-px bg-[#E8621A]" />
    </div>
  )
}

function ImageBlock({
  label,
  description,
  aspect = "aspect-[16/9]",
  dark = false,
}: {
  label: string
  description: string
  aspect?: string
  dark?: boolean
}) {
  return (
    <figure className="w-full my-10">
      <div
        className={`
          w-full ${aspect} rounded-2xl border flex flex-col items-center justify-center gap-3
          relative overflow-hidden
          ${dark ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"}
        `}
      >
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: dark
              ? "repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(255,255,255,0.04) 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(255,255,255,0.04) 32px)"
              : "repeating-linear-gradient(0deg, transparent, transparent 31px, #e8e8e8 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, #e8e8e8 32px)",
          }}
        />
        {/* Orange corner accent */}
        <div className="absolute top-0 left-0 w-12 h-12 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#E8621A] to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-[#E8621A] to-transparent" />
        </div>

        <div className="relative flex flex-col items-center gap-2 px-8 text-center max-w-md">
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#E8621A] opacity-70">
            Image placeholder
          </span>
          <span className={`text-sm font-medium ${dark ? "text-white/70" : "text-neutral-600"}`}>
            {label}
          </span>
          <span className={`text-xs leading-relaxed ${dark ? "text-white/35" : "text-neutral-400"}`}>
            {description}
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-neutral-400 text-center tracking-wide">
        {label}
      </figcaption>
    </figure>
  )
}

function StatCard({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`
      flex flex-col gap-1.5 p-5 rounded-2xl border transition-all duration-200
      ${accent
        ? "bg-[#E8621A] border-[#E8621A] text-white"
        : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
      }
    `}>
      <span className={`text-2xl font-medium ${accent ? "text-white" : "text-neutral-900"}`}>
        {value}
      </span>
      <span className={`text-xs leading-snug ${accent ? "text-white/70" : "text-neutral-400"}`}>
        {label}
      </span>
    </div>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-10 p-6 md:p-8 rounded-2xl bg-[#FDF1E8] border border-[#F5A86E]/30 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E8621A] rounded-full" />
      <p className="text-lg md:text-xl font-medium text-neutral-800 leading-[1.6] pl-2">
        {children}
      </p>
    </div>
  )
}

function DecisionRow({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="group grid grid-cols-[52px_1fr] gap-4 py-6 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 -mx-4 px-4 rounded-xl transition-colors duration-200">
      <span className="text-[11px] font-medium text-[#E8621A] tracking-wide pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
        {number}
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-900">{title}</span>
        <span className="text-sm text-neutral-500 leading-relaxed">{body}</span>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────

export default function D2CCaseStudy() {
  return (
    <main className="bg-white min-h-screen">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          {/* Meta tags */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {["Commerce Platform", "0 → 1 · Multi-Brand Scale", "Honasa Consumer · 2021–2022"].map((tag) => (
              <span key={tag} className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 px-3 py-1.5 rounded-full border border-neutral-200">
                {tag}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-medium tracking-tight text-neutral-900 leading-[1.1] mb-6 max-w-3xl">
            Scaling first-party commerce across{" "}
            <span className="text-[#E8621A]">multiple D2C brands</span>
          </h1>

          <p className="text-lg text-neutral-500 leading-[1.75] max-w-2xl mb-10">
            Joined as the first in-house UX designer at Honasa Consumer to design and launch
            revenue-ready commerce experiences across three fast-growing D2C brands —
            from zero to a multi-brand shared platform.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            <StatCard value="3"      label="D2C brands launched" accent />
            <StatCard value="0 → 1"  label="First in-house UX designer" />
            <StatCard value="12 mo"  label="Solo to multi-designer team" />
            <StatCard value="↑ LTV"  label="Owned-channel margin growth" />
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <ImageBlock
            label="Multi-brand platform overview"
            description="Full-width hero showing Mamaearth, The Derma Co., and Aqualogica storefronts side by side — same underlying architecture, distinct visual identities. Use actual product screenshots or high-quality mockups at desktop viewport."
            aspect="aspect-[16/8]"
          />
        </motion.div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6">

        <Divider />

        {/* CONTEXT */}
        <motion.div {...fadeUp}>
          <SectionLabel>Context</SectionLabel>
          <SectionHeading>The company needed a scalable product experience — and fast</SectionHeading>
          <Body>
            Honasa Consumer had brand identity defined across three D2C labels. What didn't
            exist was a product experience to reduce marketplace dependency, improve
            owned-channel margins, and support long-term growth. No UX foundation,
            no design system, no prior in-house process.
          </Body>
          <Callout>
            Architecture over aesthetics — build once, brand many times. Not three
            separate products.
          </Callout>
        </motion.div>

        <Divider />

        {/* ROLE */}
        <motion.div {...fadeUp}>
          <SectionLabel>Role & ownership</SectionLabel>
          <SectionHeading>Sole UX designer for the first year</SectionHeading>
          <Body>
            As the only designer, I owned the full commerce architecture from discovery
            through post-purchase, structured MVP feature sets with product and engineering,
            and established UX standards adopted by incoming designers as the team scaled.
          </Body>

          <div className="grid md:grid-cols-2 gap-3 mt-8">
            {[
              { title: "Commerce architecture",       body: "Defined the full discovery → checkout → post-purchase flow across all three brands." },
              { title: "System building",              body: "Built reusable commerce components adaptable across brands without duplicating effort." },
              { title: "Cross-functional ownership",   body: "Worked directly with PMs and engineering to align execution speed with usability." },
              { title: "Design standards",             body: "Established early UX patterns adopted by subsequent designers as the team scaled." },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-[#F5A86E]/50 hover:shadow-[0_4px_20px_rgba(232,98,26,0.06)] transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8621A] opacity-60" />
                  <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed pl-3.5">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <Divider />

        {/* PLATFORM ARCHITECTURE */}
        <motion.div {...fadeUp}>
          <SectionLabel>System design</SectionLabel>
          <SectionHeading>One platform. Three brand layers.</SectionHeading>
          <Body>
            Commerce logic is brand-agnostic. Checkout, cart, account, and payment flows
            are identical across brands — only visual expression differs. Systemising the
            backbone meant each new brand was a configuration, not a rebuild.
          </Body>
        </motion.div>

        <ImageBlock
          label="Platform architecture diagram"
          description="Diagram: Honasa Commerce Platform → Shared Commerce Engine → Brand Layer (Mamaearth / The Derma Co. / Aqualogica). Boxes and arrows, no proprietary UI needed. Show the centralized system with brand differentiation layer clearly separated below."
          aspect="aspect-[16/9]"
          dark
        />

        {/* Shared vs custom matrix */}
        <div className="grid md:grid-cols-2 gap-4 my-8">
          <div className="p-6 rounded-2xl border border-neutral-200">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-5">
              Shared across all brands
            </p>
            {["Checkout flow", "Cart logic", "Account module", "Payment integration", "Post-purchase"].map((item) => (
              <div key={item} className="flex items-center gap-3 py-2.5 border-b border-neutral-100 last:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0" />
                <span className="text-sm text-neutral-600">{item}</span>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-[#E8621A]/20 bg-[#FDF1E8]/50">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#E8621A]/70 mb-5">
              Brand-specific
            </p>
            {["Visual theme & typography", "Color token system", "Campaign UI", "Brand-specific PDPs", "Loyalty mechanics"].map((item) => (
              <div key={item} className="flex items-center gap-3 py-2.5 border-b border-[#E8621A]/10 last:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8621A]/40 shrink-0" />
                <span className="text-sm text-neutral-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* STRATEGIC DECISIONS */}
        <motion.div {...fadeUp}>
          <SectionLabel>Strategic decisions</SectionLabel>
          <SectionHeading>Three calls that shaped the outcome</SectionHeading>
          <div className="mt-2">
            <DecisionRow
              number="01"
              title="Standardized commerce backbone across brands"
              body="While visual layers differed, core commerce architecture was systemized to reduce duplication. One codebase, multiple brand skins — not three separate products."
            />
            <DecisionRow
              number="02"
              title="MVP discipline over feature bloat"
              body="Prioritized checkout, cart, and product detail over personalization and advanced features in early versions. Speed to market mattered more than perfection."
            />
            <DecisionRow
              number="03"
              title="Designed for retention from day one"
              body="Structured flows for repeat purchase behaviour and subscription readiness in the MVP — so scaling retention didn't require a redesign later."
            />
          </div>
        </motion.div>

        <Divider />

        {/* FLOW DIAGRAM */}
        <motion.div {...fadeUp}>
          <SectionLabel>Commerce flow</SectionLabel>
          <SectionHeading>Same flow, three brand themes</SectionHeading>
          <Body>
            The modular flow — Discovery → PDP → Cart → Checkout → Post-Purchase — was
            defined once and applied across all three brands. Brand color themes swapped
            at the token layer, not rebuilt per product.
          </Body>
        </motion.div>

        <ImageBlock
          label="Modular commerce flow — 3 brand themes"
          description="Flow diagram showing Discovery → PDP → Cart → Checkout → Post-Purchase repeated three times side by side with different brand color themes: Mamaearth (green), Derma Co. (blue), Aqualogica (teal). Same boxes, same arrows — different colors. This is the strongest proof-of-architecture visual."
          aspect="aspect-[16/9]"
        />

        <Divider />

        {/* BEFORE / AFTER */}
        <motion.div {...fadeUp}>
          <SectionLabel>Before & after</SectionLabel>
          <SectionHeading>From fragmented to unified</SectionHeading>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-5">Before</p>
              {[
                "Independent brand experiences",
                "Redundant engineering effort",
                "No UX standardization",
                "Marketplace dependency",
                "No design system",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 py-2.5 border-b border-neutral-200 last:border-0">
                  <span className="text-neutral-300 mt-0.5 shrink-0 text-sm">—</span>
                  <span className="text-sm text-neutral-500">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#E8621A]/80 mb-5">After</p>
              {[
                "Reusable commerce backbone",
                "Brand token layer for differentiation",
                "Faster scaling to new brands",
                "Owned-channel growth enabled",
                "Design system for the growing team",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 py-2.5 border-b border-white/[0.06] last:border-0">
                  <span className="text-[#E8621A]/60 mt-0.5 shrink-0 text-sm">→</span>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <Divider />

        {/* DESIGN FOUNDATIONS */}
        <motion.div {...fadeUp}>
          <SectionLabel>Design foundations</SectionLabel>
          <SectionHeading>UX infrastructure built to outlast the MVP</SectionHeading>
          <Body>
            Beyond screens, I established the design foundations the team would build on —
            token system, reusable component patterns, and documentation that made
            onboarding new designers faster as the team scaled.
          </Body>
        </motion.div>

        <ImageBlock
          label="Token system & component library snapshot"
          description="Show: (1) Color token example mapping brand tokens to base tokens. (2) A reusable card component in 3 brand themes side by side. (3) Checkout component showing shared structure. Blur proprietary data. Use generic product names like 'Product A'."
          aspect="aspect-[16/9]"
          dark
        />

        <Divider />

        {/* TIMELINE */}
        <motion.div {...fadeUp}>
          <SectionLabel>Timeline</SectionLabel>
          <SectionHeading>0 → 3 brands in 12 months</SectionHeading>

          <div className="relative mt-10 flex flex-col gap-0">
            {[
              { period: "Month 1–2",  title: "Foundation",         body: "Commerce architecture defined. Mamaearth scoped and designed.", accent: true },
              { period: "Month 3–5",  title: "Launch",             body: "Mamaearth D2C launched. Checkout, cart, and PDP flows live.", accent: false },
              { period: "Month 6–8",  title: "Scale to 2 brands",  body: "The Derma Co. onboarded using shared backbone. Brand token layer validated.", accent: false },
              { period: "Month 9–12", title: "3 brands + team",    body: "Aqualogica launched. Design system handed to incoming designers.", accent: true },
            ].map((item, i, arr) => (
              <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                {/* Left — period */}
                <div className="flex flex-col items-end pt-5">
                  <span className={`text-[11px] font-medium tracking-wide ${item.accent ? "text-[#E8621A]" : "text-neutral-400"}`}>
                    {item.period}
                  </span>
                </div>

                {/* Right — dot + content */}
                <div className="relative pl-6 pb-10 last:pb-0">
                  {/* Vertical line */}
                  {i < arr.length - 1 && (
                    <div className="absolute left-[7px] top-5 bottom-0 w-px bg-neutral-200" />
                  )}
                  {/* Dot */}
                  <div className={`
                    absolute left-0 top-[18px] w-3.5 h-3.5 rounded-full border-2 border-white
                    ${item.accent ? "bg-[#E8621A]" : "bg-neutral-300"}
                  `} />

                  <div className="pt-3">
                    <p className="text-sm font-medium text-neutral-900 mb-1">{item.title}</p>
                    <p className="text-sm text-neutral-500 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <Divider />

        {/* OUTCOME */}
        <motion.div {...fadeUp}>
          <SectionLabel>Outcome</SectionLabel>
          <SectionHeading>What this demonstrates</SectionHeading>

          <div className="grid md:grid-cols-2 gap-3 mt-6 mb-20">
            {[
              { title: "0 → 1 execution",               body: "Launched from nothing under high growth pressure and tight timelines." },
              { title: "Multi-brand platform thinking",  body: "Built a system that scaled across three brands without rebuilding each time." },
              { title: "Cross-functional collaboration", body: "Worked directly with product and engineering to ship at speed without compromising usability." },
              { title: "Operator mindset",               body: "Treated design as a business lever — not just a craft exercise." },
            ].map((item, i) => (
              <div
                key={i}
                className="group p-5 rounded-2xl border border-neutral-200 hover:border-[#E8621A]/30 hover:bg-[#FDF1E8]/40 hover:shadow-[0_4px_20px_rgba(232,98,26,0.08)] transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8621A] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
                  <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed pl-3.5">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </section>
    </main>
  )
}