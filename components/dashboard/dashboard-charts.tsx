"use client";

import {
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEAL_STAGES } from "@/constants";
import { useSyncExternalStore } from "react";
import { BarChart3 } from "lucide-react";

interface ChartData {
  revenue: { month: string; revenue: number }[];
  customers: { month: string; customers: number }[];
  forecast: { month: string; actual: number; forecast: number }[];
  deals: { lead: number; qualified: number; proposal: number; negotiation: number; won: number; lost: number };
}

const PIE_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#22d3ee",
  "#ef4444",
];

const CHART_BLUE = "#6366f1";
const CHART_EMERALD = "#10b981";

export function DashboardCharts({ data }: { data: ChartData | null }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const revenueData = data?.revenue ?? [];
  const customerData = data?.customers ?? [];
  const forecastData = data?.forecast ?? [];

  const dealsData = DEAL_STAGES.map((stage) => ({
    name: stage.label,
    value: data?.deals[stage.value as keyof ChartData["deals"]] ?? 0,
  }));

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] animate-pulse rounded-lg bg-muted" />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <BarChart3 className="h-4 w-4" />
          </div>
          <CardTitle>Analytics</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="revenue">
          <TabsList className="mb-6">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <YAxis className="text-xs" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      background: "hsl(var(--card))",
                    }}
                    formatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(value))
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill={`url(#revenueGradient)`}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="customers">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customerData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <YAxis className="text-xs" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      background: "hsl(var(--card))",
                    }}
                  />
                  <defs>
                    <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_EMERALD} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={CHART_EMERALD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke={CHART_EMERALD}
                    strokeWidth={3}
                    dot={{ r: 5, fill: CHART_EMERALD, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 7, strokeWidth: 2, stroke: "hsl(var(--background))", fill: CHART_EMERALD }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="forecast">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <YAxis className="text-xs" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      background: "hsl(var(--card))",
                    }}
                    formatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(Number(value))
                    }
                  />
                  <Bar
                    dataKey="actual"
                    name="Won"
                    fill={`url(#actualGradient)`}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="Weighted forecast"
                    stroke={CHART_EMERALD}
                    strokeWidth={3}
                    strokeDasharray="6 4"
                    dot={{ r: 4, fill: CHART_EMERALD, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_BLUE} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={CHART_BLUE} stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="deals">
            <div className="flex h-[300px] items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={65}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {dealsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.75rem",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      background: "hsl(var(--card))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
