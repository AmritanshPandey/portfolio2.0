// PartnerBank's system: the case study's layer stack (app/work/white-label-rfp)
// and the banks the home page's work row deals out.

export interface SystemLayer {
  num: string
  title: string
  body: string
  meta?: string[]
  /** The layer the system turns on; drawn in the accent. */
  isCore?: boolean
}

/**
 * The case study's anonymised prospects, each a set of brand tokens on the
 * same product, drawn by the work row's card specimen. Mockup palettes
 * (DESIGN.md §2).
 */
export const partnerBankBanks = [
  { name: "Heritage Trust", num: "9120", type: "Private credit", from: "#D4A24C", to: "#8B6508" },
  { name: "North Bank", num: "4287", type: "Premier debit", from: "#F43F5E", to: "#9F1239" },
  { name: "Verde Bank", num: "7503", type: "Everyday debit", from: "#4DA88A", to: "#2F6F5A" },
]

export const partnerBankLayers: SystemLayer[] = [
  { num: "L1", title: "Core Banking UX Layer", body: "Accounts, transactions, transfers, and statements. Unchanged across deals.", meta: ["flows", "interactions", "states"] },
  { num: "L2", title: "Modular Component Library", body: "Account card, transaction list, CTA block: primitives that compose into any screen.", meta: ["primitives", "variants", "compositions"] },
  { num: "L3", title: "Brand Token Layer", body: "Colour, type, radius, and elevation tokens that re-skin everything in one pass.", meta: ["color", "type", "elevation"], isCore: true },
  { num: "L4", title: "Demo Configuration Engine", body: "Combines tokens and components into a deal-ready demo.", meta: ["configure", "preview", "ship"] },
]
