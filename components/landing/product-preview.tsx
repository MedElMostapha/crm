"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useSyncExternalStore } from "react";
import { TrendingUp } from "lucide-react";

const MONTHLY = [
  { month: "Jan", revenue: 42 },
  { month: "Feb", revenue: 55 },
  { month: "Mar", revenue: 48 },
  { month: "Apr", revenue: 63 },
  { month: "May", revenue: 59 },
  { month: "Jun", revenue: 72 },
  { month: "Jul", revenue: 68 },
  { month: "Aug", revenue: 84 },
];

const STAGES = [
  {
    name: "Lead",
    color: "bg-zinc-500",
    deals: [
      { label: "Ava Chen", value: "$12k" },
      { label: "Nova Labs", value: "$8k" },
    ],
  },
  {
    name: "Negotiation",
    color: "bg-purple-500",
    deals: [
      { label: "Sierra & Co", value: "$24k" },
      { label: "Orion Retail", value: "$15k" },
    ],
  },
  {
    name: "Won",
    color: "bg-emerald-500",
    deals: [
      { label: "Northwind", value: "$38k" },
      { label: "Bluepeak", value: "$21k" },
    ],
  },
];

const tooltipStyle = {
  borderRadius: "0.75rem",
  border: "1px solid hsl(var(--border))",
  background: "hsl(var(--card))",
  fontSize: 12,
};

export function ProductPreview() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_32px_64px_-32px_hsl(var(--primary)/0.35)]">
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            orbit-crm.dev/deals
          </span>
          <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
            SAMPLE DATA
          </span>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Won this month", value: "$128k" },
              { label: "Win rate", value: "62%" },
              { label: "Open deals", value: "18" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-muted/20 p-3">
                <p className="text-[11px] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-muted/20 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              Closed revenue
            </div>
            <div className="h-32">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MONTHLY}
                    barSize={14}
                    margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      className="stroke-muted/40"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                      contentStyle={tooltipStyle}
                      formatter={(value) => `$${value}k`}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full animate-pulse rounded-lg bg-muted" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {STAGES.map((stage) => (
              <div
                key={stage.name}
                className="rounded-xl border bg-muted/20 p-3"
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${stage.color}`}
                  />
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {stage.name}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {stage.deals.map((deal) => (
                    <div
                      key={deal.label}
                      className="rounded-lg border bg-card px-2 py-1.5"
                    >
                      <p className="truncate text-[11px] font-medium">
                        {deal.label}
                      </p>
                      <p className="text-[11px] tabular-nums text-muted-foreground">
                        {deal.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}