"use client"

import { Children, type ReactNode, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

export interface ShowcaseTab {
  id: string
  label: string
  description: string
}

export function ShowcaseTabPanel({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function ShowcaseTabs({
  tabs,
  children,
}: {
  tabs: ShowcaseTab[]
  children: ReactNode
}) {
  const panels = useMemo(() => Children.toArray(children), [children])
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "")
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeTab)
  )
  const active = tabs[activeIndex]

  return (
    <div className="mt-8">
      <div className="sticky top-20 z-30 -mx-3 mb-8 rounded-2xl border border-border/70 bg-background/86 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:shadow-[0_18px_50px_rgba(0,0,0,0.24)] md:top-24 md:mx-0">
        <div
          role="tablist"
          aria-label="Showcase component groups"
          className="flex gap-1 overflow-x-auto overscroll-x-contain p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const selected = tab.id === activeTab

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`showcase-panel-${tab.id}`}
                id={`showcase-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "min-h-10 shrink-0 rounded-xl px-3.5 text-sm font-semibold tracking-normal transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "bg-foreground text-background shadow-[0_10px_28px_rgba(15,23,42,0.14)] dark:shadow-[0_10px_28px_rgba(0,0,0,0.34)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {active && (
          <p className="px-2 pb-1 pt-2 text-xs leading-5 text-muted-foreground md:px-3">
            {active.description}
          </p>
        )}
      </div>

      <div
        role="tabpanel"
        id={`showcase-panel-${active?.id}`}
        aria-labelledby={`showcase-tab-${active?.id}`}
      >
        {panels[activeIndex]}
      </div>
    </div>
  )
}
