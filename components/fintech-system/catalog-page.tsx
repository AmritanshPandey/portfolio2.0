import type { ReactNode } from "react"
import {
  IconChartCandle,
  IconCircleCheck,
  IconCoinBitcoin,
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
    <div id={id} className="mb-6 scroll-mt-28">
      <p className="fin-eyebrow text-[var(--fin-brand)]">{label}</p>
      <h2 className="fin-h2 mt-3 max-w-3xl text-[var(--fin-text-primary)]">{title}</h2>
      <p className="fin-lead mt-3 max-w-[68ch] text-[var(--fin-text-secondary)]">{description}</p>
    </div>
  )
}

/** One card header for the whole catalog: optional icon, title, optional trailing action. */
function CardHeader({
  icon,
  title,
  action,
}: {
  icon?: ReactNode
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {icon ? <span className="shrink-0 text-[var(--fin-brand)]">{icon}</span> : null}
        <h3 className="fin-h3 truncate text-[var(--fin-text-primary)]">{title}</h3>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
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
        <FinSurface key={story.title} pad>
          <div className="flex h-full flex-col gap-4">
            {/* The palette itself, shown as color — the focal moment of the color system */}
            <div className="flex h-16 gap-px overflow-hidden rounded-xl border border-[var(--fin-border)] bg-[var(--fin-border)]">
              {story.tokens.map((tokenName) => {
                const token = findToken(tokenName)
                if (!token) return null

                return (
                  <div
                    key={token.token}
                    className="flex-1 transition-[flex-grow] duration-300 ease-out hover:flex-[1.6]"
                    style={{ backgroundColor: token.value }}
                    title={`${token.name} · ${token.token}`}
                  />
                )
              })}
            </div>

            <div>
              <h3 className="fin-h3 text-[var(--fin-text-primary)]">{story.title}</h3>
              <p className="fin-body mt-2 text-[var(--fin-text-secondary)]">{story.description}</p>
            </div>

            {/* Legend, compact */}
            <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2">
              {story.tokens.map((tokenName) => {
                const token = findToken(tokenName)
                if (!token) return null

                return (
                  <span key={token.token} className="inline-flex items-center gap-1.5">
                    <span
                      className="size-3 shrink-0 rounded-[4px] border border-black/10 dark:border-white/10"
                      style={{ backgroundColor: token.value }}
                    />
                    <span className="fin-mono text-[var(--fin-text-secondary)]">{token.token}</span>
                  </span>
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
          <div key={style.token} className="grid gap-4 px-5 py-4 lg:grid-cols-[190px_1fr_220px] lg:items-center">
            <div>
              <p className="fin-body font-semibold text-[var(--fin-text-primary)]">{style.name}</p>
              <p className="fin-mono mt-1 text-[var(--fin-text-secondary)]">{style.token}</p>
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
            <div className="fin-meta text-[var(--fin-text-secondary)]">
              <p className="tabular-nums">{style.size} / {style.lineHeight} / {style.weight}</p>
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
    <div className="grid gap-4 lg:grid-cols-2">
      <FinSurface pad>
        <CardHeader title="Spacing scale" />
        <div className="space-y-3">
          {fintechSpacingTokens.map((token) => (
            <div key={token.token} className="grid grid-cols-[80px_1fr] gap-3">
              <div>
                <p className="fin-meta font-semibold text-[var(--fin-text-primary)]">{token.name}</p>
                <p className="fin-mono text-[var(--fin-text-secondary)]">{token.value}</p>
              </div>
              <div>
                <div className="h-3 rounded bg-[var(--fin-brand-soft-strong)]" style={{ width: token.value }} />
                <p className="fin-meta mt-1.5 text-[var(--fin-text-secondary)]">{token.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </FinSurface>

      <FinSurface pad>
        <CardHeader title="Radius and elevation" />
        <div className="grid gap-3">
          {fintechElevationTokens.map((token) => (
            <div
              key={token.token}
              className="rounded-lg border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] p-4"
              style={{ boxShadow: token.value }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="fin-meta font-semibold text-[var(--fin-text-primary)]">{token.name}</p>
                <p className="fin-mono text-[var(--fin-text-secondary)]">{token.token}</p>
              </div>
              <p className="fin-meta mt-2 text-[var(--fin-text-secondary)]">{token.usage}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {["Cards 8px", "Buttons 8px", "Inputs 8px", "Modals 12px", "Dropdowns 8px", "Tooltips 6px"].map((item) => (
            <div key={item} className="fin-meta rounded-lg border border-[var(--fin-border)] px-2.5 py-2 text-[var(--fin-text-secondary)]">{item}</div>
          ))}
        </div>
      </FinSurface>
    </div>
  )
}

function LayoutAndIconSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FinSurface pad>
        <CardHeader icon={<IconGridDots size={18} />} title="Grid and layout rules" />
        <div className="space-y-2.5">
          {fintechLayoutRules.map((rule) => (
            <div key={rule} className="fin-body flex gap-2 text-[var(--fin-text-secondary)]">
              <IconCircleCheck size={15} className="mt-0.5 shrink-0 text-[var(--fin-safe)]" />
              <p>{rule}</p>
            </div>
          ))}
        </div>
      </FinSurface>
      <FinSurface pad>
        <CardHeader icon={<IconComponents size={18} />} title="Icon system" />
        <div className="grid grid-cols-4 gap-2">
          {[IconLayoutDashboard, IconLock, IconPalette, IconRoute, IconTypography, IconGridDots, IconComponents, IconChartCandle, IconCoinBitcoin, IconCircleCheck].map((Icon, index) => (
            <div key={index} className="grid min-h-16 place-items-center rounded-lg border border-[var(--fin-border)] bg-[var(--fin-muted)]">
              <Icon size={20} className="text-[var(--fin-brand)]" />
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {fintechIconRules.map((rule) => (
            <p key={rule} className="fin-body text-[var(--fin-text-secondary)]">{rule}</p>
          ))}
        </div>
      </FinSurface>
    </div>
  )
}

function ComponentPreviewShell({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 min-h-[148px] overflow-hidden rounded-xl border border-[var(--fin-border)] bg-[var(--fin-muted)] p-3">
      {children}
    </div>
  )
}

function ComponentCategorySpecimen({ category }: { category: string }) {
  if (category === "Navigation") {
    return (
      <ComponentPreviewShell>
        <div className="rounded-[10px] border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] p-2.5">
          <div className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-lg bg-[var(--fin-brand)] text-black">
              <IconLayoutDashboard size={16} />
            </div>
            {["Home", "Pay", "Cards"].map((item, index) => (
              <span
                key={item}
                className={index === 0
                  ? "rounded-full bg-[var(--fin-brand-soft)] px-3 py-1.5 text-[12px] font-semibold text-[var(--fin-brand)]"
                  : "rounded-full px-3 py-1.5 text-[12px] font-semibold text-[var(--fin-text-secondary)]"}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1 rounded-[10px] border border-[var(--fin-border)] bg-[var(--fin-muted)] p-1">
            {["Home", "Send", "Cards", "More"].map((item, index) => (
              <span key={item} className={index === 0 ? "rounded-lg bg-[var(--fin-surface-raised)] px-2 py-2 text-center text-[11px] font-semibold text-[var(--fin-text-primary)]" : "px-2 py-2 text-center text-[11px] font-semibold text-[var(--fin-text-secondary)]"}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </ComponentPreviewShell>
    )
  }

  if (category === "Buttons") {
    return (
      <ComponentPreviewShell>
        <div className="grid gap-2">
          <button type="button" className="h-10 rounded-full bg-[var(--fin-brand)] px-4 text-[13px] font-semibold text-black">
            Approve payment
          </button>
          <div className="grid grid-cols-[1fr_40px] gap-2">
            <button type="button" className="h-10 rounded-full border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] text-[13px] font-semibold text-[var(--fin-text-primary)]">
              Review
            </button>
            <button type="button" className="grid size-10 place-items-center rounded-full border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] text-[var(--fin-text-secondary)]" aria-label="Open route">
              <IconRoute size={16} />
            </button>
          </div>
          <button type="button" className="h-9 rounded-full border border-[var(--fin-error-border)] bg-[var(--fin-error-soft)] text-[12px] font-semibold text-[var(--fin-error)]">
            Freeze card
          </button>
        </div>
      </ComponentPreviewShell>
    )
  }

  if (category === "Inputs") {
    return (
      <ComponentPreviewShell>
        <div className="grid gap-3">
          {[
            ["Amount", "$24,000.00"],
            ["Recipient", "Northstar Payroll"],
          ].map(([label, value]) => (
            <label key={label} className="grid gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--fin-text-secondary)]">{label}</span>
              <span className="flex h-10 items-center rounded-lg border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] px-3 text-[13px] font-semibold text-[var(--fin-text-primary)]">
                {value}
              </span>
            </label>
          ))}
          <div className="grid grid-cols-6 gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <span key={index} className="grid h-8 place-items-center rounded-lg border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] text-[15px] text-[var(--fin-text-primary)]">
                {index < 4 ? "•" : ""}
              </span>
            ))}
          </div>
        </div>
      </ComponentPreviewShell>
    )
  }

  if (category === "Cards") {
    return (
      <ComponentPreviewShell>
        <div className="rounded-xl border border-white/10 bg-[linear-gradient(135deg,#050806,#101914_60%,#013f22)] p-4 text-white">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Instant debit</span>
            <IconComponents size={18} className="text-[var(--fin-brand)]" />
          </div>
          <p className="mt-6 font-mono text-[18px] font-semibold tracking-[0.08em]">4829 •••• 1048</p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <span className="text-[12px] text-white/58">Avery Stone</span>
            <span className="text-[13px] font-semibold tabular-nums">$8,000</span>
          </div>
        </div>
      </ComponentPreviewShell>
    )
  }

  if (category === "Data") {
    return (
      <ComponentPreviewShell>
        <div className="grid gap-3">
          <div className="flex h-16 items-end gap-1.5 border-b border-[var(--fin-border)]">
            {[42, 54, 39, 68, 73, 58, 82].map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="flex-1 rounded-t"
                style={{
                  height: `${height}%`,
                  background: "linear-gradient(180deg,var(--fin-brand),color-mix(in srgb,var(--fin-brand) 30%,transparent))",
                }}
              />
            ))}
          </div>
          {[
            ["Stripe payout", "+$12,804", "Settled", "income"],
            ["Wire transfer", "-$24,000", "Review", "pending"],
          ].map(([name, amount, status, tone]) => (
            <div key={name} className="flex items-center justify-between gap-3">
              <span className="truncate text-[12px] font-semibold text-[var(--fin-text-primary)]">{name}</span>
              <span className="flex items-center gap-2">
                <FinBadge tone={tone as "income" | "pending"} className="h-5 px-2 text-[10px]">{status}</FinBadge>
                <span className="font-mono text-[12px] font-semibold tabular-nums text-[var(--fin-text-primary)]">{amount}</span>
              </span>
            </div>
          ))}
        </div>
      </ComponentPreviewShell>
    )
  }

  if (category === "Trading") {
    return (
      <ComponentPreviewShell>
        <div className="grid gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-lg bg-[var(--fin-brand-soft)] text-[var(--fin-brand)]">
                <IconChartCandle size={17} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">NVDA</p>
                <p className="text-[11px] text-[var(--fin-text-secondary)]">Market open</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-[15px] font-semibold tabular-nums text-[var(--fin-text-primary)]">$142.64</p>
              <p className="text-[11px] font-semibold text-[var(--fin-profit)]">+2.18%</p>
            </div>
          </div>
          <svg viewBox="0 0 260 72" className="h-[58px] w-full" aria-hidden>
            <path d="M2 52 C30 28 44 45 68 30 C96 12 112 44 138 28 C166 10 188 36 210 24 C232 12 240 17 258 10" fill="none" stroke="var(--fin-brand)" strokeLinecap="round" strokeWidth="4" />
          </svg>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="h-8 rounded-lg bg-[var(--fin-brand)] text-[12px] font-semibold text-black">Buy</button>
            <button type="button" className="h-8 rounded-lg border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] text-[12px] font-semibold text-[var(--fin-text-secondary)]">Sell</button>
          </div>
        </div>
      </ComponentPreviewShell>
    )
  }

  if (category === "Crypto Wallet") {
    return (
      <ComponentPreviewShell>
        <div className="grid gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] text-[var(--fin-text-secondary)]">Portfolio value</p>
              <p className="mt-1 font-mono text-[22px] font-semibold tabular-nums text-[var(--fin-text-primary)]">$27,763</p>
            </div>
            <IconCoinBitcoin size={24} className="text-[var(--fin-brand)]" />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {["Send", "Receive", "Swap"].map((item) => (
              <button key={item} type="button" className="h-9 rounded-lg bg-[var(--fin-surface-raised)] text-[11px] font-semibold text-[var(--fin-text-secondary)]">
                {item}
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-[var(--fin-risk-border)] bg-[var(--fin-risk-soft)] px-3 py-2 text-[11px] font-semibold leading-4 text-[var(--fin-risk)]">
            Bitcoin network only. Wrong network can lose funds.
          </div>
        </div>
      </ComponentPreviewShell>
    )
  }

  if (category === "Feedback") {
    return (
      <ComponentPreviewShell>
        <div className="grid gap-2">
          <div className="rounded-lg border border-[var(--fin-success-border)] bg-[var(--fin-success-soft)] px-3 py-2">
            <FinBadge tone="success">Transfer complete</FinBadge>
            <p className="mt-2 text-[12px] text-[var(--fin-text-secondary)]">Receipt saved to statements.</p>
          </div>
          <div className="rounded-lg border border-[var(--fin-error-border)] bg-[var(--fin-error-soft)] px-3 py-2">
            <FinBadge tone="error">Recovery needed</FinBadge>
            <p className="mt-2 text-[12px] text-[var(--fin-text-secondary)]">No money moved. Try another card.</p>
          </div>
        </div>
      </ComponentPreviewShell>
    )
  }

  if (category === "Security") {
    return (
      <ComponentPreviewShell>
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-[var(--fin-safe-soft)] text-[var(--fin-safe)]">
              <IconLock size={17} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">Verify payment</p>
              <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">Confirm before sending $24,000.</p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <span key={index} className="grid h-8 place-items-center rounded-lg border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] text-[15px] text-[var(--fin-text-primary)]">
                {index < 4 ? "•" : ""}
              </span>
            ))}
          </div>
          <FinBadge tone="safe">Secure session</FinBadge>
        </div>
      </ComponentPreviewShell>
    )
  }

  return (
    <ComponentPreviewShell>
      <div className="mx-auto max-w-[260px] rounded-xl border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] p-4 shadow-[var(--fin-shadow-overlay)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">Confirm transfer</p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">Review consequence before submitting.</p>
          </div>
          <IconCircleCheck size={16} className="text-[var(--fin-brand)]" />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="h-8 rounded-lg border border-[var(--fin-border)] px-3 text-[12px] font-semibold text-[var(--fin-text-secondary)]">Cancel</button>
          <button type="button" className="h-8 rounded-lg bg-[var(--fin-brand)] px-3 text-[12px] font-semibold text-black">Confirm</button>
        </div>
      </div>
    </ComponentPreviewShell>
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
    Trading: "Covers quote views, watchlists, order tickets, positions, fills, and market-state language for brokerage products.",
    "Crypto Wallet": "Covers asset balances, network selection, wallet addresses, receive QR, swaps, gas fees, and irreversible transfer warnings.",
    Feedback: "Confirms what happened, what is still processing, and what needs recovery without sounding robotic.",
    Security: "Treats consent, risk, authentication, and session prompts as calm trust moments.",
    Overlays: "Keeps modals, drawers, sheets, popovers, and confirmations focused on the consequence of the choice.",
  }
  const specimenCategories = ["Cards", "Data", "Trading", "Crypto Wallet", "Security"]

  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => {
          const specs = fintechComponentSpecs.filter((spec) => spec.category === category)
          return (
            <FinSurface key={category} pad>
              <div className="flex items-center justify-between gap-4">
                <h3 className="fin-h3 text-[var(--fin-text-primary)]">{category}</h3>
                <FinBadge tone="neutral" icon={false}>{specs.length}</FinBadge>
              </div>
              <p className="fin-body mt-2 text-[var(--fin-text-secondary)]">
                {componentStories[category]}
              </p>
              <ComponentCategorySpecimen category={category} />
              <div className="mt-4 flex flex-wrap gap-1.5">
                {specs.slice(0, 5).map((spec) => (
                  <span
                    key={spec.name}
                    className="fin-meta rounded-full border border-[var(--fin-border)] bg-[var(--fin-muted)] px-2.5 py-1 font-medium text-[var(--fin-text-secondary)]"
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
          <p className="fin-eyebrow text-[var(--fin-text-secondary)]">Selected specimens</p>
          <p className="fin-body mt-2 max-w-[62ch] text-[var(--fin-text-secondary)]">
            A few living examples show the tone: compact, calm, and focused on the decision in front of the user.
          </p>
        </div>
        <div className="space-y-6">
          {specimenCategories.map((category) => (
            <section key={category} className="grid gap-3">
              <h3 className="fin-h3 text-[var(--fin-text-primary)]">{category}</h3>
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
        <FinSurface key={rule} pad>
          <IconCircleCheck size={18} className="text-[var(--fin-safe)]" />
          <p className="fin-body mt-3 text-[var(--fin-text-secondary)]">{rule}</p>
        </FinSurface>
      ))}
    </div>
  )
}

export function FintechSystemCatalogPage() {
  return (
    <div className="fintech-system min-h-screen bg-[var(--fin-bg)] text-[var(--fin-text-primary)] selection:bg-emerald-400/20">
      <section id="overview" className="relative overflow-hidden border-b border-[var(--fin-border)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(0,230,118,0.11),transparent_32%),linear-gradient(180deg,rgba(0,200,83,0.04),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--fin-brand)] to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32">
          <div className="grid gap-9 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              {/* Standardised breadcrumb kicker */}
              <nav className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--fin-text-secondary)]">
                <span>Design System</span>
                <span className="h-1 w-1 rounded-full" style={{ background: "var(--fin-brand)" }} />
                <span style={{ color: "var(--fin-brand)" }}>Fintech Interface</span>
                <span className="h-1 w-1 rounded-full bg-[var(--fin-border)]" />
                <span>Reusable Library</span>
              </nav>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <FinBadge tone="safe">Cash-like clarity</FinBadge>
                <FinBadge tone="neutral" icon={false}>Mobile-first</FinBadge>
                <FinBadge tone="neutral" icon={false}>Fast finance</FinBadge>
              </div>
              <h1 className="type-page-title max-w-3xl text-[var(--fin-text-primary)]">
                Money movement that feels instant, clear, and calm.
              </h1>
              <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-[var(--fin-text-secondary)]">
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
              ["10", "component families"],
              ["17", "money flows"],
            ].map(([value, label]) => (
              <div key={label} className="bg-fin-surface-78 rounded-2xl border border-[var(--fin-border)] p-5 shadow-[var(--fin-shadow-flat)] backdrop-blur">
                <p className="text-[30px] font-semibold leading-none tracking-[-0.02em] text-[var(--fin-text-primary)] tabular-nums">{value}</p>
                <p className="fin-eyebrow mt-2 text-[var(--fin-text-secondary)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[180px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-0.5 border-l border-[var(--fin-border)] pl-4" aria-label="Fintech system sections">
            <p className="fin-eyebrow mb-3 text-[var(--fin-text-secondary)]">On this page</p>
            {sectionNav.slice(1).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="fin-body block rounded-md px-2 py-1.5 font-medium text-[var(--fin-text-secondary)] transition-colors hover:bg-[var(--fin-muted)] hover:text-[var(--fin-text-primary)]"
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
              title="Core product moments, one system language"
              description="The system is shown through a treasury command center, a high-risk payment review, and a mobile wallet. The component library also extends into brokerage and crypto-wallet flows without changing the visual grammar."
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
              title="Components organized around real financial tasks"
              description="Instead of showing every state as a technical inventory, the catalog groups components by what they help a person do: move money, trade assets, manage crypto wallets, review risk, read activity, recover from errors, and trust a session."
            />
            <ComponentsSection />
          </section>

          <section>
            <SectionHeader
              id="patterns"
              label="Financial UX patterns"
              title="Reusable flows for money, markets, and trust"
              description="Each pattern records trigger, required data, primary states, and compliance or risk behavior so teams can scale decisions across payments, cards, lending, trading, crypto wallets, wealth, analytics, and admin workflows."
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
    </div>
  )
}
