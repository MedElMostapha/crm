"use client";

import {
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSyncExternalStore } from "react";
import { BarChart3, Target, Percent, Trophy } from "lucide-react";
import { formatCurrency } from "@/utils";

interface ReportsData {
  revenueByMonth: { month: string; revenue: number }[];
  winRateByMonth: { month: string; won: number; lost: number; rate: number }[];
  stages: {
    stage: string;
    label: string;
    color: string;
    count: number;
    value: number;
  }[];
  topCustomers: { name: string; email: string; revenue: number; deals: number }[];
  totals: {
    wonDeals: number;
    lostDeals: number;
    openDeals: number;
    wonValue: number;
    winRate: number;
    avgDealSize: number;
  };
}

const CHART_BLUE = "#6366f1";
const CHART_EMERALD = "#10b981";
const CHART_RED = "#ef4444";

const STAGE_HEX: Record<string, string> = {
  lead: "#71717a",
  qualified: "#3b82f6",
  proposal: "#f59e0b",
  negotiation: "#a855f7",
  won: "#10b981",
  lost: "#ef4444",
};

const tooltipStyle = {
  borderRadius: "0.75rem",
  border: "1px solid hsl(var(--border))",
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  background: "hsl(var(--card))",
  fontSize: 12,
};

export function ReportsView({ data }: { data: ReportsData }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  const maxCustomerRevenue = Math.max(
    1,
    ...data.topCustomers.map((c) => c.revenue)
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Won"
          value={formatCurrency(data.totals.wonValue)}
          subtitle={`${data.totals.wonDeals} deals closed`}
          icon={Trophy}
        />
        <SummaryCard
          title="Win Rate"
          value={`${data.totals.winRate}%`}
          subtitle={`${data.totals.lostDeals} lost`}
          icon={Percent}
        />
        <SummaryCard
          title="Open Deals"
          value={String(data.totals.openDeals)}
          subtitle="In the pipeline"
          icon={Target}
        />
        <SummaryCard
          title="Avg Deal Size"
          value={formatCurrency(data.totals.avgDealSize)}
          subtitle="Won deals only"
          icon={BarChart3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                    contentStyle={tooltipStyle}
                    formatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(Number(value))
                    }
                  />
                  <Bar dataKey="revenue" name="Revenue" fill={CHART_BLUE} radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Win Rate Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.winRateByMonth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="won" name="Won" stackId="a" fill={CHART_EMERALD} maxBarSize={36} />
                  <Bar dataKey="lost" name="Lost" stackId="a" fill={CHART_RED} maxBarSize={36} />
                  <Line type="monotone" dataKey="rate" name="Win rate %" stroke={CHART_BLUE} strokeWidth={3} dot={{ r: 4, fill: CHART_BLUE, strokeWidth: 2, stroke: "hsl(var(--background))" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deals by Stage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.stages.map((stage) => {
              const maxValue = Math.max(1, ...data.stages.map((s) => s.value));
              const percent = (stage.value / maxValue) * 100;
              return (
                <div key={stage.stage}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                      {stage.label}
                    </span>
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{stage.count}</span> · {formatCurrency(stage.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: STAGE_HEX[stage.stage],
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {data.stages.every((s) => s.count === 0) && (
              <p className="text-sm text-muted-foreground">No deals yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No won deals yet.</p>
            ) : (
              data.topCustomers.map((customer) => (
                <div key={customer.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{customer.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {customer.email} · {customer.deals} deal{customer.deals !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="font-semibold tabular-nums">
                      {formatCurrency(customer.revenue)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(customer.revenue / maxCustomerRevenue) * 100}%`,
                        backgroundColor: CHART_BLUE,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}