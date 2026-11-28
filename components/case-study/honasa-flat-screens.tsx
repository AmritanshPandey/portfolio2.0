/*
 * Honasa's flat storefront mockups, the ones Core Flows showed before its
 * device scenes. Not on the page: kept so they can be captured as the device
 * scenes' real screens (scripts/capture-ui, REDESIGN Phase 3). They predate
 * Ledger and still carry its drift.
 */

const BRAND = {
  mamaearth: "#00AFEF",
  dermaco: "#217A6E",
  aqualogica: "#0066CC",
} as const

// ─── CORE FLOW VISUALS ──────────────────────────────────────────────────────

// The flat storefront mockups that Core Flows showed before its device
// scenes. Kept: they can be captured as the devices' real screens.
export function PdpVisual() {
  const proofItems = [
    { label: "Ingredient proof", value: "Persistent drawer" },
    { label: "Trust badges", value: "Reusable system block" },
    { label: "Sticky CTA", value: "Always within reach" },
  ]

  return (
    <div data-keep-radius className="relative h-full w-full overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(244,63,94,0.10),transparent_34%),linear-gradient(135deg,rgba(0,0,0,0.025),transparent_48%)] dark:bg-[radial-gradient(circle_at_22%_14%,rgba(244,63,94,0.16),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_48%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.11] dark:opacity-[0.08]" />

      <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-3 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              PDP focus
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Purchase proof moved above checkout
            </p>
          </div>
          <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-right">
            <p className="text-lg font-semibold leading-none text-accent">68%</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">pre-checkout</p>
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-[0.95fr_1.25fr] gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background/78 p-4 shadow-[0_18px_48px_-36px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
            <div className="relative h-full rounded-xl bg-muted/70 p-3">
              <div className="flex h-full items-center justify-center rounded-lg bg-background/80">
                <div className="h-20 w-20 rounded-full border border-accent/55 bg-accent/10 shadow-[0_0_40px_rgba(244,63,94,0.10)]" />
              </div>
            </div>
          </div>

          <div className="grid min-h-0 grid-rows-[auto_1fr] gap-3">
            <div className="rounded-2xl border border-border bg-background/78 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-2.5 w-36 rounded-full bg-foreground" />
                  <div className="h-2 w-24 rounded-full bg-muted-foreground/45" />
                </div>
                <span className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
                  PDP
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {["Browse", "PDP", "Cart", "Pay"].map((step, index) => (
                  <div key={step} className="space-y-1.5">
                    <div
                      className={`h-8 rounded-lg border ${
                        index === 1
                          ? "border-accent bg-accent/15"
                          : "border-border bg-muted/70"
                      }`}
                    />
                    <p className={`text-center text-[11px] ${index === 1 ? "text-accent" : "text-muted-foreground"}`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid min-h-0 grid-cols-3 gap-2">
              {proofItems.map(item => (
                <div
                  key={item.label}
                  className="flex min-w-0 flex-col justify-between rounded-2xl border border-border bg-background/72 p-3 backdrop-blur-sm"
                >
                  <div>
                    <div className="mb-2 h-1.5 w-9 rounded-full bg-accent" />
                    <p className="text-[11px] font-medium leading-snug text-foreground">
                      {item.label}
                    </p>
                  </div>
                  <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/82 p-2 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="pl-2">
              <div className="h-2 w-24 rounded-full bg-muted-foreground/45" />
              <div className="mt-1.5 h-2 w-16 rounded-full bg-muted-foreground/25" />
            </div>
            <div className="min-h-10 flex-1 rounded-xl bg-foreground px-4 py-3">
              <div className="mx-auto h-2 w-28 rounded-full bg-background" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CartVisual() {
  const themes = [
    { name: "Mamaearth", accent: BRAND.mamaearth, tint: "rgba(0,175,239,0.14)", radius: "14px" },
    { name: "Derma Co.", accent: BRAND.dermaco, tint: "rgba(33,122,110,0.14)", radius: "8px" },
    { name: "Aqualogica", accent: BRAND.aqualogica, tint: "rgba(0,102,204,0.14)", radius: "12px" },
  ]

  return (
    <div data-keep-radius className="relative h-full w-full overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(244,63,94,0.10),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.025),transparent)] dark:bg-[radial-gradient(circle_at_50%_8%,rgba(244,63,94,0.15),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />

      <div className="relative grid h-full grid-cols-[1.1fr_0.9fr] gap-4 p-3">
        <div className="flex min-h-0 flex-col justify-between rounded-3xl border border-border bg-background/82 p-4 shadow-[0_20px_56px_-40px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Shared cart component
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                One structure, many skins
              </p>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
              v1 component
            </span>
          </div>

          <div className="grid min-h-0 gap-2 py-3">
            {[0, 1].map(item => (
              <div key={item} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-2xl border border-border bg-card/75 p-3">
                <div className="h-12 rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-2.5 w-36 rounded-full bg-foreground/80" />
                  <div className="h-2 w-24 rounded-full bg-muted-foreground/45" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1">
                  <span className="h-3 w-3 rounded bg-muted" />
                  <span className="h-3 w-4 rounded bg-accent" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div className="rounded-2xl border border-border bg-card/75 p-3">
              <div className="mb-2 h-2 w-20 rounded-full bg-muted-foreground/35" />
              <div className="h-2 w-32 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="grid min-w-32 place-items-center rounded-2xl bg-accent px-5">
              <div className="h-2 w-20 rounded-full bg-white/85" />
            </div>
          </div>
        </div>

        <div className="grid min-h-0 gap-2.5">
          {themes.map(theme => (
            <div
              key={theme.name}
              className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border border-border bg-background/72 p-3 backdrop-blur-sm"
              style={{
                ["--brand" as string]: theme.accent,
                ["--brand-soft" as string]: theme.tint,
                borderRadius: theme.radius,
              }}
            >
              <div className="h-10 w-10 rounded-xl bg-[var(--brand-soft)] ring-1 ring-[var(--brand)]/25" />
              <div className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="truncate text-[11px] font-semibold" style={{ color: theme.accent }}>
                    {theme.name}
                  </p>
                  <span className="h-2.5 w-8 rounded-full bg-[var(--brand)]" />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="h-7 rounded-lg bg-[var(--brand)]" />
                  <div className="h-7 rounded-lg border border-border bg-card/80" />
                  <div className="h-7 rounded-lg bg-[var(--brand-soft)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CheckoutVisual() {
  const before = ["01", "02", "03", "04", "05", "06"]
  const after = [
    { label: "Delivery", detail: "Address autocomplete" },
    { label: "Payment", detail: "UPI · Cards · COD" },
    { label: "Confirm", detail: "Review + place" },
  ]

  return (
    <div data-keep-radius className="relative h-full w-full overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(244,63,94,0.10),transparent_34%),linear-gradient(135deg,rgba(0,0,0,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(244,63,94,0.15),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_50%)]" />

      <div className="relative grid h-full grid-rows-[auto_1fr] gap-4 p-3">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-border bg-background/78 p-4 backdrop-blur-sm">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Checkout compression
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              The form became one focused page.
            </p>
          </div>
          <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
            6 → 3
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-[0.9fr_1.1fr] gap-3">
          <div className="flex min-h-0 flex-col justify-between rounded-2xl border border-border bg-background/68 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Before · six steps
            </p>
            <div className="grid grid-cols-3 gap-2">
              {before.map(step => (
                <div key={step} className="grid h-14 place-items-center rounded-xl border border-border bg-muted/50 text-[11px] text-muted-foreground">
                  {step}
                </div>
              ))}
            </div>
            <p className="text-xs leading-snug text-muted-foreground">
              More screens, more waiting, more abandonment before completion.
            </p>
          </div>

          <div className="flex min-h-0 flex-col justify-between rounded-2xl border border-accent/35 bg-accent/8 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
              After · three decisions
            </p>
            <div className="grid gap-2.5">
              {after.map((step, index) => (
                <div
                  key={step.label}
                  className={`grid grid-cols-[44px_1fr] items-center gap-3 rounded-2xl border p-3 ${
                    index === 0
                      ? "border-accent bg-background/82"
                      : "border-border bg-background/68"
                  }`}
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-xl font-mono text-[11px] ${
                    index === 0 ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    0{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.label}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

