"use client"

// The Recharts plots of the case-study charts, in one module so they share
// one lazily loaded chunk (see CsAreaChart, CsDualLineChart).

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { CsAreaChartProps } from "./cs-area-chart"
import type { CsDualLineChartProps } from "./cs-dual-line-chart"

/** The plot of CsAreaChart; loaded on its own so Recharts stays off first load. */
export function CsAreaChartPlot({
  data,
  unit = "",
  color,
  annotations = [],
  yDomain,
}: Omit<CsAreaChartProps, "title" | "description"> & { color: string }) {
  const config: ChartConfig = {
    value: {
      label: unit ? `Value (${unit})` : "Value",
      color,
    },
  }

  const annotated = new Set(annotations.map(a => a.index))

  return (
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
  )
}

/** The plot of CsDualLineChart; loaded on its own so Recharts stays off first load. */
export function CsDualLineChartPlot({
  data,
  series,
  annotations = [],
}: Omit<CsDualLineChartProps, "title" | "description">) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [
      s.key,
      { label: s.label, color: s.color },
    ])
  )

  return (
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
  )
}
