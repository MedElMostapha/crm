import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";
import type { PipelineAnalytics } from "@/types";
import { GitBranch, TrendingUp } from "lucide-react";

export function PipelineFunnel({ data }: { data: PipelineAnalytics | null }) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="h-64 animate-pulse rounded-lg bg-muted" />
      </Card>
    );
  }

  const maxValue = Math.max(...data.stages.map((stage) => stage.value), 1);

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <GitBranch className="h-4 w-4" />
            </div>
            <CardTitle>Pipeline</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Open Pipeline Value
            </p>
            <p className="text-xl font-bold">{formatCurrency(data.pipelineValue)}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              Weighted Forecast
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(data.weightedForecast)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Open Deals
            </p>
            <p className="text-xl font-bold">{data.openDeals}</p>
          </div>
        </div>

        <div className="space-y-3.5">
          {data.stages.map((stage) => (
            <div key={stage.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.label}</span>
                <span className="text-muted-foreground">
                  {stage.count} · {formatCurrency(stage.value)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    stage.color
                  )}
                  style={{
                    width: `${Math.max(
                      (stage.value / maxValue) * 100,
                      stage.count > 0 ? 4 : 0
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
