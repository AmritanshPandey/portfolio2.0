// PartnerBank's system, shared by its case study (app/work/white-label-rfp)
// and the home page's systems section, so the two never drift apart.

export interface SystemLayer {
  num: string
  title: string
  body: string
  meta?: string[]
  /** The layer the system turns on; drawn in the accent. */
  isCore?: boolean
}

export const partnerBankLayers: SystemLayer[] = [
  { num: "L1", title: "Core Banking UX Layer", body: "Accounts, transactions, transfers, and statements. Unchanged across deals.", meta: ["flows", "interactions", "states"] },
  { num: "L2", title: "Modular Component Library", body: "Account card, transaction list, CTA block: primitives that compose into any screen.", meta: ["primitives", "variants", "compositions"] },
  { num: "L3", title: "Brand Token Layer", body: "Colour, type, radius, and elevation tokens that re-skin everything in one pass.", meta: ["color", "type", "elevation"], isCore: true },
  { num: "L4", title: "Demo Configuration Engine", body: "Combines tokens and components into a deal-ready demo.", meta: ["configure", "preview", "ship"] },
]

/** The argument for the system, each line as the case study states it. */
export const partnerBankCase = {
  href: "/work/white-label-rfp",
  constraint: "Demos decide enterprise RFPs, and every bank wants to see its own brand on the same product.",
  decision: "Split the product into four layers so brand lives in exactly one: a new bank changes tokens, never UX logic.",
  tradeoff: "Two sprints of upfront work before the payoff showed in demo build times.",
  outcome: "A new bank's re-skin became a configuration pass, and the library grew from 8 to 31 components in six months.",
}
