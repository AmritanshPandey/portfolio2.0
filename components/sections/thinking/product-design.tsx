"use client"

import { ApproachDeck } from "./approach-deck"

/**
 * The "Approach" section — a draggable card-stack ("deck") of the method steps.
 * Thin shim so the home page import name stays stable; the deck + its heading
 * live in <ApproachDeck>.
 */
export default function ProductDesignApproachSection() {
  return <ApproachDeck />
}
