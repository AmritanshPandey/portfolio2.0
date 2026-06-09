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
      <div className="mb-6 flex items-start justify-between gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fin-brand)]">
            {label}
          </p>
          <h2 className="mt-3 max-w-3xl text-[24px] font-semibold leading-[1.18] text-[var(--fin-text-primary)] md:text-[28px]">
            {title}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[15px] leading-7 text-[var(--fin-text-secondary)] md:text-[16px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

function ColorSystemSection() {
  const paletteStories = [
    {
      title: "Make the next money action obvious",
      description: "Green is reserved for the thing someone can confidently do next: add, send, approve, confirm, or continue.",
      tokens: ["--fin-brand", "--fin-brand-strong", "--fin-accent"],
    },
    {
      title: "Keep the interface quiet around the money",
      description: "Surfaces stay close to the portfolio shell so balances, names, and decisions remain the loudest elements.",
      tokens: ["--fin-bg", "--fin-surface", "--fin-muted", "--fin-border"],
    },
    {
      title: "Explain status without making people decode color",
      description: "Risk, warning, safe, and error states always carry a label. Color supports the decision; it never becomes the decision.",
      tokens: ["--fin-safe", "--fin-warning", "--fin-risk", "--fin-error"],
    },
    {
      title: "Separate movement from mood",
      description: "Income, expense, profit, and loss use familiar financial cues so rows can be scanned quickly without feeling like alerts.",
      tokens: ["--fin-income", "--fin-expense", "--fin-profit", "--fin-loss"],
    },
  ]

  const findToken = (tokenName: string) =>
    fintechColorTokens.find((token) => token.token === tokenName)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {paletteStories.map((story) => (
        <FinSurface key={story.title} className="p-4 md:p-5">
          <div className="flex min-h-28 flex-col justify-between gap-5">
            <div>
              <p className="text-[15px] font-semibold leading-6 text-[var(--fin-text-primary)]">{story.title}</p>
              <p className="mt-2 text-[13px] leading-6 text-[var(--fin-text-secondary)]">{story.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {story.tokens.map((tokenName) => {
                const token = findToken(tokenName)
                if (!token) return null

                return (
                  <div
                    key={token.token}
                    className="flex min-w-24 items-center gap-2 rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] p-2"
                  >
                    <span
                      className="size-8 shrink-0 rounded-[7px] border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: token.value }}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-semibold text-[var(--fin-text-primary)]">
                        {token.name}
                      </span>
                      <span className="block truncate font-mono text-[10px] text-[var(--fin-text-secondary)]">
                        {token.token}
                      </span>
                    </span>
                  </div>
                )
              })}
            </div>
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
  const componentStories: Record<string, string> = {
    Navigation: "Keeps orientation simple across desktop, tablet, and mobile without adding another layer of product chrome.",
    Buttons: "Makes the next action clear while keeping destructive and secondary decisions deliberately quieter.",
    Inputs: "Handles money, identity, credentials, search, and dates with readable helper states instead of noisy validation.",
    Cards: "Frames balances, cards, alerts, and insights as small decisions people can understand at a glance.",
    Data: "Turns dense transactions, KPIs, filters, charts, and tables into scannable financial rhythm.",
    Feedback: "Confirms what happened, what is still processing, and what needs recovery without sounding robotic.",
    Security: "Treats consent, risk, authentication, and session prompts as calm trust moments.",
    Overlays: "Keeps modals, drawers, sheets, popovers, and confirmations focused on the consequence of the choice.",
  }
  const specimenCategories = ["Cards", "Data", "Security"]

  return (
    <div className="space-y-8">
      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((category) => {
          const specs = fintechComponentSpecs.filter((spec) => spec.category === category)
          return (
            <FinSurface key={category} className="p-4 md:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[17px] font-semibold text-[var(--fin-text-primary)]">{category}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-[var(--fin-text-secondary)]">
                    {componentStories[category]}
                  </p>
                </div>
                <FinBadge tone="neutral" icon={false}>{specs.length}</FinBadge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {specs.slice(0, 5).map((spec) => (
                  <span
                    key={spec.name}
                    className="rounded-full border border-[var(--fin-border)] bg-[var(--fin-muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--fin-text-secondary)]"
                  >
                    {spec.name}
                  </span>
                ))}
              </div>
            </FinSurface>
          )
        })}
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fin-text-secondary)]">
            Selected specimens
          </p>
          <p className="mt-2 max-w-[62ch] text-[14px] leading-7 text-[var(--fin-text-secondary)]">
            A few living examples show the tone: compact, calm, and focused on the decision in front of the user.
          </p>
        </div>
        <div className="space-y-6">
          {specimenCategories.map((category) => (
            <section key={category} className="grid gap-3">
              <h3 className="text-[18px] font-semibold text-[var(--fin-text-primary)]">{category}</h3>
              {fintechComponentPreviewMap[category]}
            </section>
          ))}
        </div>
      </div>
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
    <main className="fintech-system min-h-screen bg-[var(--fin-bg)] text-[var(--fin-text-primary)] selection:bg-emerald-400/20">
      <section id="overview" className="relative overflow-hidden border-b border-[var(--fin-border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(0,230,118,0.11),transparent_32%),linear-gradient(180deg,rgba(0,200,83,0.04),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--fin-brand)] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32">
          <div className="grid gap-9 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <FinBadge tone="safe">Cash-like clarity</FinBadge>
                <FinBadge tone="neutral" icon={false}>Mobile-first</FinBadge>
                <FinBadge tone="neutral" icon={false}>Fast finance</FinBadge>
              </div>
              <h1 className="max-w-3xl text-[34px] font-semibold leading-[1.08] text-[var(--fin-text-primary)] md:text-[52px]">
                Money movement that feels instant, clear, and calm.
              </h1>
              <p className="mt-5 max-w-[62ch] text-[17px] leading-8 text-[var(--fin-text-secondary)] md:text-[19px]">
                A reusable fintech design system for the moments people check balances, send money, approve payments, and decide whether something feels trustworthy.
              </p>
            </div>

            <FinSurface className="hidden overflow-hidden p-3 lg:block">
              <div className="rounded-[22px] bg-[#050806] p-4 text-white">
                <div className="rounded-[20px] bg-[linear-gradient(135deg,#00e676,#00c853_55%,#00a845)] p-5 text-black">
                  <p className="text-[13px] font-medium text-black/62">Available now</p>
                  <p className="mt-2 text-[46px] font-semibold leading-[0.96] tracking-normal tabular-nums text-black">$8,420</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {["Add", "Send", "Card"].map((action) => (
                      <div key={action} className="grid h-12 place-items-center rounded-[16px] bg-black/10 text-[13px] font-semibold">
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid gap-2">
                  {[
                    ["Salary credit", "+$4,820"],
                    ["Card ending 1048", "-$86.20"],
                  ].map(([label, amount]) => (
                    <div key={label} className="flex items-center justify-between rounded-[16px] bg-white/[0.08] px-3 py-3">
                      <span className="text-[13px] font-medium text-white/72">{label}</span>
                      <span className="text-[13px] font-semibold tabular-nums text-white/90">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FinSurface>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["03", "example screens"],
              ["04", "palette stories"],
              ["08", "component families"],
              ["15", "money flows"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[18px] border border-[var(--fin-border)] bg-[color-mix(in_srgb,var(--fin-surface)_78%,transparent)] p-4 shadow-[var(--fin-shadow-flat)] backdrop-blur">
                <p className="font-mono text-[24px] font-bold text-[var(--fin-text-primary)] tabular-nums">{value}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fin-text-secondary)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[180px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-1 border-l border-[var(--fin-border)] pl-4" aria-label="Fintech system sections">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fin-text-secondary)]">
              On this page
            </p>
            {sectionNav.slice(1).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block rounded-md px-2 py-2 text-[13px] font-medium text-[var(--fin-text-secondary)] transition-colors hover:bg-[var(--fin-muted)] hover:text-[var(--fin-text-primary)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-20">
          <section>
            <SectionHeader
              id="screens"
              label="Example screens"
              title="Three product moments, one system language"
              description="The system is shown through a treasury command center, a high-risk payment review, and a mobile wallet. Each screen keeps the same visual grammar: quiet containers, crisp numbers, readable status, and a single confident green action."
            />
            <FinExampleScreens />
          </section>

          <section>
            <SectionHeader
              id="foundations"
              label="Foundations"
              title="Foundations that make money feel understandable"
              description="The system keeps the basics restrained: a small palette, readable type, steady spacing, and clear status language. The goal is to help people scan money without making the interface feel clinical."
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
              title="Components organized around real money tasks"
              description="Instead of showing every state as a technical inventory, the catalog groups components by what they help a person do: move money, review risk, read activity, recover from errors, and trust a session."
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
      </div>
    </main>
  )
}
