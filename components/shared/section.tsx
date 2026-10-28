import clsx from "clsx"
import { SectionHeader } from "./section-header"
import { SectionTransition } from "./section-transition"

type Bg = "default" | "muted" | "dark" | "grid" | "squares" | "approach" | "ink"

// How much air above a section. The page varies it so the long scroll has a
// rhythm instead of one repeated interval.
const SPACE = {
  tight: "calc(var(--section-y) * 0.6)",
  default: "var(--section-y)",
  loose: "calc(var(--section-y) * 1.3)",
} as const

interface SectionProps {
  id?: string
  /** Ledger is one sheet of paper: sections are divided by rules, not
   *  alternating bands. The one exception is "ink", the night band reserved
   *  for the page's key framework (.ink-band). Other values are kept for
   *  call-site compatibility and render as the page. */
  bg?: Bg
  /** Air above the section; see SPACE. */
  space?: keyof typeof SPACE
  children: React.ReactNode
  eyebrow?: string
  title?: string
  description?: string
  headerVariant?: "default" | "compact" | "hero" | "quiet"
  headerAnimated?: boolean
  transition?: string
  transitionEyebrow?: string
  transitionVariant?: "default" | "muted" | "highlight"
}

/**
 * A ledger section: an ink rule that draws across the sheet, a heading hung
 * on the grid, then the content. No backgrounds, textures or glows; the rule
 * and the type do the dividing.
 */
export function Section({
  id,
  bg,
  space = "default",
  children,
  eyebrow,
  title,
  description,
  headerVariant = "default",
  headerAnimated = true,
  transition,
  transitionEyebrow,
  transitionVariant = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "relative w-full scroll-mt-[var(--nav-h)] bg-background text-foreground",
        bg === "ink" && "ink-band",
      )}
      // The ink band closes on its own colour, so it pads its foot as well.
      style={{ paddingTop: SPACE[space], paddingBottom: bg === "ink" ? "var(--section-y)" : undefined }}
    >
      <div className="ledger">
        <div aria-hidden data-settle="rule" className="rule-ink" />

        {title && (
          <div className="mt-5 md:mt-6">
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              variant={headerVariant}
              animated={headerAnimated}
            />
          </div>
        )}

        <div className={title ? "mt-12 md:mt-20" : "mt-5 md:mt-6"}>{children}</div>

        {transition && (
          <SectionTransition
            eyebrow={transitionEyebrow}
            text={transition}
            variant={transitionVariant}
          />
        )}
      </div>
    </section>
  )
}
