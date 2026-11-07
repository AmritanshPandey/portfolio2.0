"use client"

import dynamic from "next/dynamic"
import { WhenIdle } from "@/components/shared/when-idle"

// The plot brings Recharts; it loads once the page is idle or nearby.
const CsDualLineChartPlot = dynamic(
  () => import("./cs-chart-plots").then((m) => m.CsDualLineChartPlot),
  { ssr: false, loading: () => <div className="h-[220px] w-full" /> }
)

export interface CsDualLineChartSeries {
  key: string
  label: string
  color: string
  unit?: string
  dashed?: boolean
}

export interface CsDualLineChartAnnotation {
  x: string | number
  label: string
}

export interface CsDualLineChartProps {
  title: string
  description?: string
  /** Array of objects with keys matching each series key + a "label" key for x-axis */
  data: Record<string, string | number>[]
  series: [CsDualLineChartSeries, CsDualLineChartSeries]
  annotations?: CsDualLineChartAnnotation[]
}

export function CsDualLineChart({
  title,
  description,
  data,
  series,
  annotations = [],
}: CsDualLineChartProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-[14px] font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      <WhenIdle className="h-[220px] w-full">
        <CsDualLineChartPlot data={data} series={series} annotations={annotations} />
      </WhenIdle>
    </div>
  )
}
