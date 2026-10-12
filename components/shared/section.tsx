import { SectionHeader } from "./section-header"
import { SectionTransition } from "./section-transition"

type Bg = "default" | "muted" | "dark" | "grid" | "squares" | "approach"

interface SectionProps {
  id?: string
  /** Kept for call-site compatibility. Ledger is one sheet of paper:
   *  sections are divided by rules, never by alternating bands. */
  bg?: Bg
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
      className="relative w-full scroll-mt-[var(--nav-h)] bg-background text-foreground"
      style={{ paddingTop: "var(--section-y)" }}
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
