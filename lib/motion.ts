// ─── Motion tokens ────────────────────────────────────────────────────────────
// One place to tune the site's animation feel. Components import these instead
// of hardcoding the curve and timings, so a change here updates everything.
// Mirrors the --dur-* / --ease-* custom properties in app/globals.css;
// scripts/motion-tokens.test.mjs fails if the two drift.
//
// Editorial motion is slow, quiet, and purposeful: opacity-led with a small
// rise, no springs, no bounce. Reduced motion is honoured globally by
// <MotionConfig reducedMotion="user"> in app/layout.tsx.

/** Entrance curve (mirrors --ease-out). */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Layers changing position (mirrors --ease-move). */
export const EASE_MOVE = [0.65, 0, 0.35, 1] as const

/** Durations in seconds (mirror --dur-1…4). */
export const DURATION = {
  /** Hover, focus, press. */
  feedback: 0.2,
  /** UI transitions: nav opacity, dialogs, tabs. */
  fast: 0.4,
  /** Reveals: text, images, layers. */
  base: 0.6,
  /** Hero entrance only. */
  slow: 0.9,
} as const

/** How far below its resting spot an element starts before fading up (px).
 *  The rule is ≤ 12px; small keeps the transform cheap across browsers. */
export const RISE = 8

/** Per-step delay for a staggered group entrance (seconds). */
export const STAGGER = 0.06

/** Items beyond this share the last step's delay, so long lists never crawl. */
export const STAGGER_MAX = 6

/** Ceiling for parallax on layers inside an artefact (px). Nowhere else. */
export const PARALLAX_MAX = 16

/**
 * Consistent on-load entrance props for framer-motion (initial + animate).
 * Pass the element's position in the group for a clean, even stagger.
 */
export function entrance(index = 0) {
  return {
    initial: { opacity: 0, y: RISE },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: DURATION.base,
      delay: Math.min(index, STAGGER_MAX) * STAGGER,
      ease: EASE,
    },
  }
}
