import type { ArticleItem } from "@/lib/types/content"

// featured: true → shown in the homepage Insights section (first 4 are shown)
// featured: false → shown on the /articles index page only
export const articleItems: ArticleItem[] = [
  {
    title: "Designing Incentive Systems",
    description: "Most products fail due to misaligned incentives, not poor UX.",
    href: "/articles/incentive-systems",
    image: "/article.png",
    featured: true,
  },
  {
    title: "The Cost of Over-Engineering UX",
    description: "Complexity doesn't make products powerful — it makes them harder to use.",
    href: "/articles/overengineering-ux",
    image: "/article.png",
    featured: true,
  },
  {
    title: "Risk as a Design Constraint",
    description: "In fintech, every product decision is also a risk decision.",
    href: "/articles/risk-as-design-constraint",
    image: "/article.png",
    featured: true,
  },
  {
    title: "Designing Under Uncertainty",
    description: "Strong teams move forward without perfect data and learn faster.",
    href: "/articles/designing-under-uncertainty",
    image: "/article.png",
    featured: true,
  },
  {
    title: "Designing for Cognitive Load in AI Products",
    description: "Managing complexity in intelligent interfaces requires intentional restraint.",
    href: "/articles/cognitive-load-ai",
    image: "/article.png",
    featured: false,
  },
  {
    title: "Building Systems, Not Screens",
    description: "Why senior designers must think in product architectures, not individual flows.",
    href: "/articles/systems-not-screens",
    image: "/article.png",
    featured: false,
  },
  {
    title: "The Trade-Off Framework for Product Decisions",
    description: "Evaluating speed vs scale, and growth vs risk with structured trade-off thinking.",
    href: "/articles/tradeoff-framework",
    image: "/article.png",
    featured: false,
  },
  {
    title: "Zero to One vs Scale",
    description: "Why early-stage and enterprise products require fundamentally different design approaches.",
    href: "/articles/zero-to-one-vs-scale",
    image: "/article.png",
    featured: false,
  },
]
