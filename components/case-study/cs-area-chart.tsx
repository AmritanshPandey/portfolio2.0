"use client"

import dynamic from "next/dynamic"
import { WhenIdle } from "@/components/shared/when-idle"

// The plot brings Recharts; it loads once the page is idle or nearby.
const CsAreaChartPlot = dynamic(() => import("./cs-chart-plots").then((m) => m.CsAreaChartPlot), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full" />,
})

export interface CsAreaChartAnnotation {
  index: number
  label: string
}

export interface CsAreaChartProps {
  title: string
  description?: string
  data: { label: string; value: number }[]
  unit?: string
  color?: string
  annotations?: CsAreaChartAnnotation[]
  yDomain?: [number, number]
}

export function CsAreaChart({
  title,
  description,
  data,
  unit = "",
  color = "hsl(var(--chart-1))",
  annotations = [],
  yDomain,
}: CsAreaChartProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[14px] font-medium text-foreground">{title}</p>
          {description && (
            <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-4">
          <div className="w-3 h-2 rounded-sm" style={{ background: color, opacity: 0.6 }} />
          <span className="text-[11px] text-muted-foreground">{unit || "Value"}</span>
        </div>
      </div>

      <WhenIdle className="h-[200px] w-full">
        <CsAreaChartPlot data={data} unit={unit} color={color} annotations={annotations} yDomain={yDomain} />
      </WhenIdle>
    </div>
  )
}
