import type { Metadata } from "next"
import ContentPage from "@/components/layout/content-page"

export const metadata: Metadata = {
  title: "Smart Journal",
  description:
    "Privacy-first by architecture: an AI journaling app where the model runs entirely on-device. What a product becomes when data never leaves the phone.",
}

export default function Page() {
  return (
    <ContentPage
      eyebrow="Exploration · Privacy-First"
      status="In Development"
      title="Smart Journal"
      hypothesis="Hypothesis: privacy-first architecture as a product differentiator, what happens when data never leaves the device."
      description="A private reflection system where AI runs entirely on-device using Gemma. Every journaling app sends your thoughts to a server. This one doesn't, and the entire product architecture follows from that single decision."
    >
      <div className="space-y-8 text-[15px] leading-relaxed text-muted-foreground">

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">The problem</h2>
          <p>
            Every AI journaling app processes your data on a server. The AI model lives in the cloud,
            your entries travel over a network, and your most private thoughts are stored somewhere
            you don&apos;t control. Privacy is an afterthought, not an architecture decision.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">The decision</h2>
          <p>
            On-device AI as the non-negotiable constraint, and everything the product became
            because of it. If the AI can&apos;t run on your device, it doesn&apos;t run.
            That single decision eliminated a class of product features, forced a different
            UX architecture, and made privacy the core value proposition rather than a checkbox.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">What that forced</h2>
          <ul className="space-y-2 list-none">
            {[
              "No cloud sync, local-first storage with optional encrypted export",
              "Model size constraints, Gemma 2B fits on device; GPT-4 does not",
              "Offline-first UX, the AI must work without a connection",
              "No analytics, no telemetry, what you write stays on your device",
              "Battery and thermal management as UX concerns, not just engineering ones",
            ].map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="text-orange-500 shrink-0 mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">The UX</h2>
          <p>
            On-device AI changes what reflection looks like. Without a server, there&apos;s no
            history sync, no cross-device continuity, no &ldquo;your AI learned about you over time.&rdquo;
            The product had to be valuable in a single session, on a single device. That constraint
            produced a cleaner product, a daily reflection tool, not a life-logging system.
          </p>
          <p>
            The AI surfaces patterns within your own entries, suggests prompts based on what
            you&apos;ve written before, and offers structured reflection frameworks, all without
            ever reading your journal on a server.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          {[
            { label: "Stack", value: "Flutter · Gemma 2B · Android + iOS" },
            { label: "Status", value: "In development" },
            { label: "Core constraint", value: "On-device only, no server AI" },
            { label: "Category", value: "Privacy-first · Personal tools" },
          ].map(item => (
            <div key={item.label} className="p-4 rounded-xl border border-border bg-card">
              <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-muted-foreground mb-1.5">{item.label}</p>
              <p className="text-[13px] font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

      </div>
    </ContentPage>
  )
}
