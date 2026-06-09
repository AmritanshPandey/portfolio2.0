import {
  IconCircleCheck,
  IconComponents,
  IconGridDots,
  IconLayoutDashboard,
  IconLock,
  IconPalette,
  IconRoute,
  IconTypography,
} from "@tabler/icons-react"
import {
  fintechColorTokens,
  fintechComponentSpecs,
  fintechElevationTokens,
  fintechIconRules,
  fintechLayoutRules,
  fintechPatternSpecs,
  fintechSpacingTokens,
  fintechTypeStyles,
} from "./data"
import {
  FinBadge,
  FinExampleScreens,
  FinPatternPreview,
  FinSurface,
  fintechComponentPreviewMap,
} from "./ui"

const sectionNav = [
  { id: "overview", label: "Overview" },
  { id: "screens", label: "Screens" },
  { id: "foundations", label: "Foundations" },
  { id: "components", label: "Components" },
  { id: "patterns", label: "Patterns" },
  { id: "accessibility", label: "Accessibility" },
]

function SectionHeader({
  id,
  label,
  title,
  description,
}: {
  id: string
  label: string
  title: string
  description: string
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <div className="mb-5 flex items-start justify-between gap-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--fin-brand)]">
            {label}
          </p>
          <h2 className="mt-2 text-[24px] font-semibold text-[var(--fin-text-primary)] md:text-[30px]">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-[14px] leading-6 text-[var(--fin-text-secondary)] md:text-[15px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

function ColorSystemSection() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {fintechColorTokens.map((token) => (
        <FinSurface key={token.token} className="overflow-hidden">
          <div
            className="h-20 border-b border-[var(--fin-border)]"
            style={{ backgroundColor: token.value }}
          />
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">{token.name}</p>
                <p className="mt-1 font-mono text-[11px] text-[var(--fin-text-secondary)]">{token.token}</p>
              </div>
              <FinBadge tone={token.tone ?? "neutral"} icon={false}>AA</FinBadge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[var(--fin-text-secondary)]">
              <div className="rounded-[6px] border border-[var(--fin-border)] p-2">
                <span className="block font-bold uppercase tracking-[0.12em]">Light</span>
                <span className="font-mono">{token.value}</span>
              </div>
              <div className="rounded-[6px] border border-[var(--fin-border)] p-2">
                <span className="block font-bold uppercase tracking-[0.12em]">Dark</span>
                <span className="font-mono">{token.darkValue}</span>
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-5 text-[var(--fin-text-secondary)]">{token.role}</p>
            <p className="mt-2 text-[11px] font-semibold text-[var(--fin-text-primary)]">{token.contrast}</p>
          </div>
        </FinSurface>
      ))}
    </div>
  )
}

function TypographySection() {
  return (
    <FinSurface className="overflow-hidden">
      <div className="divide-y divide-[var(--fin-border)]">
        {fintechTypeStyles.map((style) => (
          <div key={style.token} className="grid gap-4 px-4 py-4 lg:grid-cols-[190px_1fr_220px] lg:items-center">
            <div>
              <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">{style.name}</p>
              <p className="mt-1 font-mono text-[11px] text-[var(--fin-text-secondary)]">{style.token}</p>
            </div>
            <p
              className={style.numeric ? "font-mono tabular-nums" : undefined}
              style={{
                fontSize: style.size,
                lineHeight: style.lineHeight,
                fontWeight: style.weight,
                color: "var(--fin-text-primary)",
              }}
            >
              {style.sample}
            </p>
            <div className="text-[12px] leading-5 text-[var(--fin-text-secondary)]">
              <p>{style.size} / {style.lineHeight} / {style.weight}</p>
              <p>{style.usage}</p>
            </div>
          </div>
        ))}
      </div>
    </FinSurface>
  )
}

function ScaleSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <FinSurface className="p-4">
        <p className="text-[15px] font-semibold text-[var(--fin-text-primary)]">Spacing scale</p>
        <div className="mt-4 space-y-3">
          {fintechSpacingTokens.map((token) => (
            <div key={token.token} className="grid grid-cols-[80px_1fr] gap-3">
              <div>
                <p className="text-[12px] font-semibold text-[var(--fin-text-primary)]">{token.name}</p>
                <p className="font-mono text-[11px] text-[var(--fin-text-secondary)]">{token.value}</p>
              </div>
              <div>
                <div className="h-3 rounded bg-[var(--fin-brand-soft-strong)]" style={{ width: token.value }} />
                <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">{token.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </FinSurface>

      <FinSurface className="p-4">
        <p className="text-[15px] font-semibold text-[var(--fin-text-primary)]">Radius and elevation</p>
        <div className="mt-4 grid gap-3">
          {fintechElevationTokens.map((token) => (
            <div
              key={token.token}
              className="rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] p-4"
              style={{ boxShadow: token.value }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">{token.name}</p>
                <p className="font-mono text-[11px] text-[var(--fin-text-secondary)]">{token.token}</p>
              </div>
              <p className="mt-2 text-[12px] leading-5 text-[var(--fin-text-secondary)]">{token.usage}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-[var(--fin-text-secondary)]">
          {["Cards 8px", "Buttons 8px", "Inputs 8px", "Modals 12px", "Dropdowns 8px", "Tooltips 6px"].map((item) => (
            <div key={item} className="rounded-[8px] border border-[var(--fin-border)] p-2">{item}</div>
          ))}
        </div>
      </FinSurface>
    </div>
  )
}

function LayoutAndIconSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FinSurface className="p-4">
        <div className="flex items-center gap-2">
          <IconGridDots size={18} className="text-[var(--fin-brand)]" />
          <p className="text-[15px] font-semibold text-[var(--fin-text-primary)]">Grid and layout rules</p>
        </div>
        <div className="mt-4 space-y-2">
          {fintechLayoutRules.map((rule) => (
            <div key={rule} className="flex gap-2 text-[13px] leading-5 text-[var(--fin-text-secondary)]">
              <IconCircleCheck size={15} className="mt-0.5 shrink-0 text-[var(--fin-safe)]" />
              <p>{rule}</p>
            </div>
          ))}
        </div>
      </FinSurface>
      <FinSurface className="p-4">
        <div className="flex items-center gap-2">
          <IconComponents size={18} className="text-[var(--fin-brand)]" />
          <p className="text-[15px] font-semibold text-[var(--fin-text-primary)]">Icon system</p>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px] font-semibold text-[var(--fin-text-secondary)]">
          {[IconLayoutDashboard, IconLock, IconPalette, IconRoute, IconTypography, IconGridDots, IconComponents, IconCircleCheck].map((Icon, index) => (
            <div key={index} className="grid min-h-16 place-items-center rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-muted)]">
              <Icon size={20} className="text-[var(--fin-brand)]" />
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {fintechIconRules.map((rule) => (
            <p key={rule} className="text-[13px] leading-5 text-[var(--fin-text-secondary)]">{rule}</p>
          ))}
        </div>
      </FinSurface>
    </div>
  )
}

function ComponentsSection() {
  const categories = Array.from(new Set(fintechComponentSpecs.map((spec) => spec.category)))

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const specs = fintechComponentSpecs.filter((spec) => spec.category === category)
        return (
          <section key={category} className="grid gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-[20px] font-semibold text-[var(--fin-text-primary)]">{category}</h3>
                <p className="mt-1 text-[13px] text-[var(--fin-text-secondary)]">
                  {specs.map((spec) => spec.name).join(", ")}
                </p>
              </div>
              <FinBadge tone="neutral" icon={false}>{specs.length} spec{specs.length > 1 ? "s" : ""}</FinBadge>
            </div>
            <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
              <div className="grid gap-3">
                {specs.map((spec) => (
                  <FinSurface key={spec.name} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">{spec.name}</p>
                      <FinBadge tone="neutral" icon={false}>{spec.states.length} states</FinBadge>
                    </div>
                    <p className="mt-2 text-[12px] leading-5 text-[var(--fin-text-secondary)]">{spec.description}</p>
                    <p className="mt-3 font-mono text-[11px] leading-5 text-[var(--fin-text-secondary)]">
                      props: {spec.props.join(", ")}
                    </p>
                    <p className="mt-2 text-[12px] leading-5 text-[var(--fin-text-secondary)]">{spec.accessibility}</p>
                  </FinSurface>
                ))}
              </div>
              <div>{fintechComponentPreviewMap[category]}</div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

function PatternsSection() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {fintechPatternSpecs.map((pattern) => (
        <FinPatternPreview key={pattern.name} pattern={pattern} />
      ))}
    </div>
  )
}

function AccessibilitySection() {
  const rules = [
    "All status, risk, and financial movement colors pair with text labels and icons.",
    "Interactive controls use a visible focus ring mapped to --fin-focus.",
    "Money, balances, percentages, and table values use tabular numerals.",
    "Critical irreversible actions require review state, consequence copy, and explicit confirmation.",
    "Charts include nearby textual interpretation and never rely on color alone.",
    "Reduced motion should disable non-essential transitions while preserving state feedback.",
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {rules.map((rule) => (
        <FinSurface key={rule} className="p-4">
          <IconCircleCheck size={18} className="text-[var(--fin-safe)]" />
          <p className="mt-3 text-[13px] leading-5 text-[var(--fin-text-secondary)]">{rule}</p>
        </FinSurface>
      ))}
    </div>
  )
}

export function FintechSystemCatalogPage() {
  return (
    <main className="fintech-system min-h-screen bg-[var(--fin-bg)] text-[var(--fin-text-primary)] selection:bg-orange-500/20">
      <section id="overview" className="relative overflow-hidden border-b border-[var(--fin-border)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(249,115,22,0.05),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <FinBadge tone="safe">Premium fintech UI kit</FinBadge>
              <FinBadge tone="neutral" icon={false}>Minimal shell</FinBadge>
              <FinBadge tone="neutral" icon={false}>Future-ready</FinBadge>
            </div>
            <h1 className="max-w-3xl text-[42px] font-bold leading-[1.04] text-[var(--fin-text-primary)] md:text-[64px]">
              A minimal finance OS for money movement.
            </h1>
            <p className="mt-6 max-w-2xl text-[16px] leading-8 text-[var(--fin-text-secondary)] md:text-[18px]">
              A reusable fintech design system with restrained surfaces, precise data hierarchy, and just enough future signal to feel intelligent without becoming decorative.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["03", "example screens"],
              ["16", "token roles"],
              ["08", "component groups"],
              ["15", "financial flows"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-[var(--fin-border)] bg-[color-mix(in_srgb,var(--fin-surface)_72%,transparent)] p-4 shadow-[var(--fin-shadow-flat)] backdrop-blur">
                <p className="font-mono text-[24px] font-bold text-[var(--fin-text-primary)] tabular-nums">{value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fin-text-secondary)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 border-b border-[var(--fin-border)] bg-[color-mix(in_srgb,var(--fin-bg)_86%,transparent)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-3 md:px-8" aria-label="Fintech system sections">
          {sectionNav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 rounded-full px-3 py-2 text-[12px] font-semibold text-[var(--fin-text-secondary)] hover:bg-[var(--fin-muted)] hover:text-[var(--fin-text-primary)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-6xl space-y-20 px-5 py-14 md:px-8 md:py-20">
        <section>
          <SectionHeader
            id="screens"
            label="Example screens"
            title="Three product moments, one system language"
            description="The system is shown through a treasury command center, a high-risk payment review, and a mobile wallet. Each screen keeps the same visual grammar: quiet containers, clear numbers, restrained status, and a single ember action."
          />
          <FinExampleScreens />
        </section>

        <section>
          <SectionHeader
            id="foundations"
            label="Foundations"
            title="Tokens that make dense finance interfaces feel calm"
            description="The kit starts with purpose-named color, type, spacing, radius, elevation, layout, and icon rules. Every token is optimized for scanning balances, comparing rows, and making high-consequence decisions."
          />
          <div className="space-y-8">
            <ColorSystemSection />
            <TypographySection />
            <ScaleSection />
            <LayoutAndIconSection />
          </div>
        </section>

        <section>
          <SectionHeader
            id="components"
            label="Component library"
            title="Reusable primitives for fintech product surfaces"
            description="The components cover navigation, commands, inputs, money cards, data-dense views, feedback, security, and overlays. Props stay compact so the kit can be imported directly into product screens."
          />
          <ComponentsSection />
        </section>

        <section>
          <SectionHeader
            id="patterns"
            label="Financial UX patterns"
            title="Reusable flows for money movement and trust"
            description="Each pattern records trigger, required data, primary states, and compliance or risk behavior so teams can scale decisions across payments, cards, lending, wealth, analytics, and admin workflows."
          />
          <PatternsSection />
        </section>

        <section>
          <SectionHeader
            id="accessibility"
            label="Accessibility and trust"
            title="Rules for secure, readable, accountable interfaces"
            description="Financial interfaces need more than attractive defaults. The system includes explicit accessibility and decision-safety rules for color, focus, motion, charts, status, and irreversible actions."
          />
          <AccessibilitySection />
        </section>
      </div>
    </main>
  )
}
