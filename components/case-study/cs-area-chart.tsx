"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceDot,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

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
  const config: ChartConfig = {
    value: {
      label: unit ? `Value (${unit})` : "Value",
      color,
    },
  }

  const annotated = new Set(annotations.map(a => a.index))

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

      <ChartContainer config={config} className="h-[200px] w-full">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="csAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.05} />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "currentColor", opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            domain={yDomain}
            tick={{ fontSize: 10, fill: "currentColor", opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            width={32}
          />

          <ChartTooltip
            cursor={{ stroke: color, strokeOpacity: 0.2, strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="line" />}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#csAreaGrad)"
            dot={(props) => {
              const idx = props.index as number
              if (!annotated.has(idx)) return <g key={props.key} />
              return (
                <circle
                  key={props.key}
                  cx={props.cx}
                  cy={props.cy}
                  r={4}
                  fill={color}
                  stroke="white"
                  strokeWidth={2}
                />
              )
            }}
            activeDot={{ r: 5, fill: color, stroke: "white", strokeWidth: 2 }}
          />

          {annotations.map((a) => {
            const point = data[a.index]
            if (!point) return null
            return (
              <ReferenceDot
                key={a.index}
                x={point.label}
                y={point.value}
                r={0}
                label={{
                  value: a.label,
                  position: "top",
                  fontSize: 10,
                  fill: "currentColor",
                  opacity: 0.5,
                  offset: 12,
                }}
              />
            )
          })}
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
