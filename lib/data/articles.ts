import type { ArticleItem } from "@/lib/types/content"

// featured: true → shown in the homepage Insights section (first 4 are shown)
// featured: false → shown on the /articles index page only
export const articleItems: ArticleItem[] = [
  {
    title: "Designing Incentive Systems",
    description: "Most products fail due to misaligned incentives, not poor UX.",
    href: "/articles/incentive-systems",
    image: "/article.png",
    accent: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
    featured: true,
  },
  {
    title: "The Cost of Over-Engineering UX",
    description: "Complexity doesn't make products powerful — it makes them harder to use.",
    href: "/articles/overengineering-ux",
    image: "/article.png",
    accent: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #4c1d95 100%)",
    featured: true,
  },
  {
    title: "Risk as a Design Constraint",
    description: "In fintech, every product decision is also a risk decision.",
    href: "/articles/risk-as-design-constraint",
    image: "/article.png",
    accent: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #075985 100%)",
    featured: true,
  },
  {
    title: "Designing Under Uncertainty",
    description: "Strong teams move forward without perfect data and learn faster.",
    href: "/articles/designing-under-uncertainty",
    image: "/article.png",
    accent: "linear-gradient(135deg, #10b981 0%, #059669 50%, #065f46 100%)",
    featured: true,
  },
  {
    title: "Designing for Cognitive Load in AI Products",
    description: "Managing complexity in intelligent interfaces requires intentional restraint.",
    href: "/articles/cognitive-load-ai",
    image: "/article.png",
    accent: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)",
    featured: false,
  },
  {
    title: "Building Systems, Not Screens",
    description: "Why senior designers must think in product architectures, not individual flows.",
    href: "/articles/systems-not-screens",
    image: "/article.png",
    accent: "linear-gradient(135deg, #ec4899 0%, #be185d 50%, #831843 100%)",
    featured: false,
  },
  {
    title: "The Trade-Off Framework for Product Decisions",
    description: "Evaluating speed vs scale, and growth vs risk with structured trade-off thinking.",
    href: "/articles/tradeoff-framework",
    image: "/article.png",
    accent: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #134e4a 100%)",
    featured: false,
  },
  {
    title: "Zero to One vs Scale",
    description: "Why early-stage and enterprise products require fundamentally different design approaches.",
    href: "/articles/zero-to-one-vs-scale",
    image: "/article.png",
    accent: "linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #312e81 100%)",
    featured: false,
  },
]
