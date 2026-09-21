"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useSyncExternalStore } from "react";

const DATA = [
  { month: "Mar", value: 32 },
  { month: "Apr", value: 45 },
  { month: "May", value: 41 },
  { month: "Jun", value: 58 },
  { month: "Jul", value: 64 },
  { month: "Aug", value: 77 },
];

export function MiniBars() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className="h-40">
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} barSize={10} margin={{ top: 4, left: -22, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-muted/40"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full animate-pulse rounded-lg bg-muted" />
      )}
    </div>
  );
}