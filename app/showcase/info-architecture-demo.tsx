"use client"

import { InfoArchitecture, type IaNode } from "@/components/ui/info-architecture"

/* ─────────────────────────────────────────────────────────────────────────
   EDIT THE IA HERE.

   The whole diagram is just three nested trees of plain objects:

     • CENTER  — the root node in the middle (e.g. "Home")
     • UP      — the tree that fans upward   (e.g. a "Seller" experience)
     • DOWN    — the tree that fans downward (e.g. a "Buyer" experience)

   Each node is: { label, note?, collapsed?, children? }
     - label:     text shown on the node
     - note:      optional small second line
     - collapsed: start this branch folded (click it to expand)
     - children:  nested nodes

   Add / remove / reorder objects to change the architecture — layout,
   connectors, and collapsing all update automatically.
   ───────────────────────────────────────────────────────────────────────── */

const CENTER: IaNode = { label: "Home" }

// ── Upward tree ────────────────────────────────────────────────────────────
const UP: IaNode = {
  label: "Seller",
  children: [
    {
      label: "Dashboard",
      children: [
        { label: "Sales overview" },
        { label: "Visitors" },
        { label: "Payouts" },
        { label: "Response rate" },
      ],
    },
    {
      label: "Listings",
      children: [
        { label: "Active" },
        { label: "Drafts" },
        { label: "Create listing", note: "New" },
        { label: "Pricing rules" },
      ],
    },
    {
      label: "Orders",
      children: [
        { label: "To fulfil" },
        { label: "Shipped" },
        { label: "Returns", collapsed: true, children: [{ label: "Open cases" }, { label: "Resolved" }] },
      ],
    },
    {
      label: "Inbox",
      children: [
        { label: "Buyer messages" },
        { label: "Saved replies" },
        { label: "Support" },
      ],
    },
    {
      label: "Settings",
      children: [
        { label: "Store profile" },
        { label: "Payments & payouts" },
        { label: "Shipping" },
        { label: "Notifications" },
      ],
    },
  ],
}

// ── Downward tree ──────────────────────────────────────────────────────────
const DOWN: IaNode = {
  label: "Buyer",
  children: [
    {
      label: "Discover",
      children: [
        { label: "Search" },
        { label: "Categories" },
        {
          label: "Product",
          children: [{ label: "Details" }, { label: "Reviews" }, { label: "Add to cart" }],
        },
      ],
    },
    {
      label: "Wishlist",
      children: [{ label: "Saved items" }, { label: "Price alerts" }],
    },
    {
      label: "Cart",
      children: [
        { label: "Review items" },
        { label: "Shipping" },
        { label: "Payment" },
        { label: "Confirmation" },
      ],
    },
    {
      label: "Orders",
      children: [
        { label: "Tracking" },
        { label: "Order history" },
        { label: "Returns", collapsed: true, children: [{ label: "Start a return" }, { label: "Refund status" }] },
      ],
    },
    {
      label: "Profile",
      children: [
        { label: "Account" },
        { label: "Addresses" },
        { label: "Payment methods" },
        { label: "Help center" },
      ],
    },
  ],
}

export function InfoArchitectureDemo() {
  return (
    // Break out of the page's centered column to the full viewport width.
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      {/* Static dot-grid background (pure CSS, no animation) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-foreground/[0.08] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
      />
      <div className="relative overflow-x-auto px-6 py-8 md:px-10 md:py-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <InfoArchitecture className="mx-auto w-max" center={CENTER} up={UP} down={DOWN} />
      </div>
    </div>
  )
}
