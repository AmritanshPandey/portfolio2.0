"use client"

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"

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
  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [
      s.key,
      { label: s.label, color: s.color },
    ])
  )

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5">
        <p className="text-[14px] font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-[12px] text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>

      <ChartContainer config={config} className="h-[220px] w-full">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.05} />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "currentColor", opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tick={{ fontSize: 10, fill: "currentColor", opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            width={32}
          />

          <ChartTooltip
            cursor={{ stroke: "currentColor", strokeOpacity: 0.1 }}
            content={<ChartTooltipContent indicator="line" />}
          />

          <ChartLegend content={<ChartLegendContent />} />

          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={s.dashed ? 2 : 2.5}
              strokeDasharray={s.dashed ? "6 4" : undefined}
              dot={false}
              activeDot={{ r: 4, fill: s.color, stroke: "white", strokeWidth: 2 }}
            />
          ))}

          {annotations.map((a, i) => (
            <ReferenceLine
              key={i}
              x={a.x}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeDasharray="3 3"
              label={{
                value: a.label,
                position: "insideTopRight",
                fontSize: 9,
                fill: "currentColor",
                opacity: 0.45,
              }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
