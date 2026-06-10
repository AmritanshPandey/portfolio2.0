"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"
import { systemItems } from "@/lib/data"
import { motion } from "framer-motion"

const TOKEN_LAYERS = [
  {
    label: "Product Foundation",
    body: "Shared commerce, banking, and messaging logic that should not change per brand.",
  },
  {
    label: "Semantic Tokens",
    body: "Intent-based roles for surfaces, text, states, risk, spacing, and hierarchy.",
  },
  {
    label: "Brand Tokens",
    body: "Color, type, radius, motion, and voice choices owned by each brand.",
  },
  {
    label: "Component Tokens",
    body: "Local decisions that let one component respond to brand and product context.",
  },
  {
    label: "Brand Expressions",
    body: "Distinct front-end experiences that share the same product structure underneath.",
  },
]

const OPERATING_MODEL = [
  "Reuse existing product logic before adding a new pattern.",
  "Separate structure from expression so brand work does not fork the system.",
  "Document component rules where design and engineering both need them.",
  "Treat governance as a release habit, not a cleanup project.",
]

export default function SystemsSection() {
  return (
    <SectionSubgroup
      label="Systems"
      description="Work that turns one-off screens into reusable product foundations, design tokens, component strategy, governance, and cleaner handoff between design and engineering."
      variant="spacious"
    >
      <section data-cursor-zone="systems">
        <div className="space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/[0.10] bg-white/[0.035] p-6 md:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start xl:gap-10">
              <div className="space-y-4">
                <p className="type-meta text-white/45">Multi-Brand Theming & Token System</p>
                <h3 className="type-card-title-featured max-w-md text-white">
                  Product foundations stay stable. Brand expression stays flexible.
                </h3>
                <p className="type-card-body-featured max-w-md text-white/58">
                  Defined a multi-brand token architecture that separated reusable product foundations from brand-level expression, enabling distinct brand experiences without duplicating design or engineering effort.
                </p>
              </div>

              <ol className="grid gap-3 sm:grid-cols-2">
                {TOKEN_LAYERS.map((layer, index) => (
                  <li
                    key={layer.label}
                    className="grid grid-cols-[36px_1fr] gap-4 rounded-xl border border-white/[0.10] bg-black/20 p-4 last:sm:col-span-2"
                  >
                    <span className="font-mono text-[11px] leading-6 text-orange-400/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="text-[14px] font-semibold leading-snug text-white">
                        {layer.label}
                      </h4>
                      <p className="mt-2 text-[12px] leading-relaxed text-white/52">
                        {layer.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid grid-cols-1 gap-4">
              {systemItems.map((system, index) => (
                <VerticalCard
                  key={system.href}
                  href={system.href}
                  image={system.image}
                  title={system.title}
                  category={system.category}
                  description={system.description}
                  ctaLabel={system.ctaLabel}
                  tags={system.tags}
                  index={index + 1}
                  variant="featured"
                  showImage={false}
                  imageHeight="h-52"
                />
              ))}
            </div>

            <div className="rounded-2xl border border-white/[0.10] bg-white/[0.035] p-6 md:p-7">
              <p className="type-meta mb-4 text-white/45">Operating Model</p>
              <div className="space-y-5">
                {OPERATING_MODEL.map((item, index) => (
                  <div key={item} className="grid grid-cols-[40px_1fr] gap-4">
                    <span className="font-mono text-[11px] leading-7 text-orange-400/75">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[13px] leading-7 text-white/58">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SectionSubgroup>
  )
}
