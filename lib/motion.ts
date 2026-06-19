// ─── Motion tokens ────────────────────────────────────────────────────────────
// One place to tune the site's animation feel. Components import these instead
// of hardcoding the curve and timings, so a change here updates everything.
//
// The motion language is deliberately opacity-led with a small rise. Large or
// mismatched transform animations are what make entrances feel choppy and are
// the worst case for Safari's compositor, so everything shares these values.

/** The site's signature ease-out curve (framer-motion cubic-bezier array). */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Standard animation durations, in seconds. */
export const DURATION = {
  fast: 0.35,
  base: 0.5,
  slow: 0.7,
} as const

/** How far below its resting spot an element starts before fading up (px).
 *  Kept small so the transform stays cheap and smooth across browsers. */
export const RISE = 8

/** Per-step delay for a staggered group entrance (seconds). */
export const STAGGER = 0.06

/**
 * Consistent on-load entrance props for framer-motion (initial + animate).
 * Pass the element's position in the group for a clean, even stagger.
 * Reduced-motion is honoured globally by <MotionConfig reducedMotion="user">.
 */
export function entrance(index = 0) {
  return {
    initial: { opacity: 0, y: RISE },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.base, delay: index * STAGGER, ease: EASE },
  }
}
