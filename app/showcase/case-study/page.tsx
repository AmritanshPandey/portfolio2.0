import type { Metadata } from "next"
import { IconCoins } from "@tabler/icons-react"

import { CsBehindScenes } from "@/components/case-study/cs-behind-scenes"
import { CaseStudyPage } from "@/components/case-study/case-study-page"

const LEARN_MORE_ITEMS = [
  {
    index: "01",
    title: "Interactive Prototype",
    description: "Explore the pickup experience end-to-end, built with Cursor and deployed on Vercel.",
    image: {
      src: "/assets/images/work/skincare-planner.jpg",
      alt: "Mobile prototype preview",
    },
    cta: {
      label: "Link to Prototype",
      href: "/showcase/case-study",
    },
    rotation: -5,
  },
  {
    index: "02",
    title: "Process Book",
    description: "See the entire process of research, synthesis, iterations, and design rationale.",
    image: {
      src: "/assets/images/work/white-label-platform.jpg",
      alt: "Process book cover preview",
    },
    cta: {
      label: "Link to Process Book",
      href: "/assets/images/Wednesday.pdf",
    },
    rotation: -4,
  },
  {
    index: "03",
    title: "Video",
    description: "A 2-minute walkthrough of how the designs work in real environments.",
    image: {
      src: "/assets/images/work/commerce-platform.jpg",
      alt: "Video walkthrough preview",
    },
    cta: {
      label: "Link to Video",
      href: "/showcase",
    },
    rotation: 3,
  },
]

export const metadata: Metadata = {
  title: "Case Study Template",
  description: "The document-style case-study scaffold — sticky TOC sidebar, serif title, meta bar, and scroll-spy sections.",
}

export default function CaseStudyTemplatePage() {
  return (
    <CaseStudyPage
      backHref="/showcase"
      backLabel="Back to Showcase"
      brand={{ name: "Marketeq", logo: <IconCoins size={22} stroke={1.75} className="text-accent" /> }}
      title="Dual-currency wallet for B2B consulting teams"
      meta={[
        { label: "Project type", value: "B2B, IT Consulting, Web Design" },
        { label: "Team", value: "1 UX Researcher/Designer (Me), 2 Engineers, 1 PM, 1 CEO" },
        { label: "My role", value: "UX Research & Design Intern" },
        { label: "Timeline", value: "3 months (Jun–Sep 2025)" },
      ]}
      sections={[
        {
          id: "overview",
          label: "Overview",
          content: (
            <div className="grid gap-8 sm:grid-cols-2">
              <p className="text-[14px] leading-relaxed text-muted-foreground">
                Marketeq Wallet is a 0→1 desktop web wallet built for clients who manage service
                payments across multiple IT consulting projects. When returning clients couldn&apos;t
                see their remaining balance spread across projects, states, and currencies, they paid
                again instead of reusing existing funds — creating unnecessary refunds and operational
                overhead.
              </p>
              <div>
                <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                  What I did
                </p>
                <p className="text-[14px] leading-relaxed text-muted-foreground">
                  I led end-to-end UX research and design, reframing the problem from refund delays to
                  balance visibility. The result is a centralized wallet that surfaces usable funds by
                  currency and project state, with inline USD↔TEQ conversion to support confident
                  payment decisions.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: "problem",
          label: "The Problem",
          content: (
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              Funds were scattered across projects and currencies with no single source of truth.
              Clients defaulted to paying again rather than hunting for an existing balance — and
              finance absorbed the refunds.
            </p>
          ),
        },
        {
          id: "research",
          label: "Research",
          content: (
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              Interviews with 8 returning clients and 3 finance stakeholders surfaced a consistent
              mental model: people think in “money I can still use on this project,” not in
              transactions.
            </p>
          ),
        },
        {
          id: "design-goal",
          label: "Design Goal",
          content: (
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              Make usable balance the most legible thing on the screen — by currency and by project
              state — so reusing funds is always easier than paying again.
            </p>
          ),
        },
        {
          id: "exploration",
          label: "Design Exploration",
          content: (
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              Explored three structures: a transaction ledger, a per-project card grid, and a unified
              balance summary with drill-down. The summary-first model tested best for confidence and
              speed.
            </p>
          ),
        },
        {
          id: "solution",
          label: "Final Solution",
          content: (
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              A centralized wallet leads with total usable balance, segmented by currency and project
              state, with inline USD↔TEQ conversion at the point of decision.
            </p>
          ),
        },
        {
          id: "impact",
          label: "Impact & Takeaways",
          content: (
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              Projected a meaningful drop in duplicate payments and refund tickets. The bigger win was
              reframing the problem itself — from “refunds are slow” to “balance is invisible.”
            </p>
          ),
        },
        {
          id: "reflection",
          label: "Reflection",
          content: (
            <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
              Shipping a 0→1 surface taught me that the highest-leverage design move was upstream:
              naming the real problem before drawing a single screen.
            </p>
          ),
        },
        {
          id: "learn-more",
          label: "Learn More",
          content: (
            <CsBehindScenes
              eyebrow=""
              heading="There's so much more behind the scene!"
              items={LEARN_MORE_ITEMS}
              className="pt-0"
            />
          ),
        },
      ]}
    />
  )
}
