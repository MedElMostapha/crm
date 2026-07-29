import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  gradient?: "indigo" | "amber" | "emerald" | "rose" | "violet";
}

const gradients = {
  indigo: "from-indigo-500/10 to-indigo-500/5 dark:from-indigo-500/20 dark:to-indigo-500/5",
  amber: "from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/5",
  emerald: "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/5",
  rose: "from-rose-500/10 to-rose-500/5 dark:from-rose-500/20 dark:to-rose-500/5",
  violet: "from-violet-500/10 to-violet-500/5 dark:from-violet-500/20 dark:to-violet-500/5",
};

const iconColors = {
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-500/20",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500/20",
};

const defaultGradients: Record<string, "indigo" | "amber" | "emerald" | "rose" | "violet"> = {
  Users: "indigo",
  Target: "violet",
  DollarSign: "emerald",
  TrendingUp: "amber",
  CheckSquare: "rose",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  gradient,
}: StatCardProps) {
  const g = gradient ?? defaultGradients[Icon.displayName ?? Icon.name] ?? "indigo";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-gradient-to-br bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        gradients[g],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
          </div>
        </div>
        <div
          className={cn(
            "rounded-lg p-2.5 transition-all duration-300 group-hover:scale-110",
            iconColors[g]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(description || trend) && (
        <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                trend.value >= 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              )}
            >
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
          {description && <span>{description}</span>}
          {trend && !description && <span>{trend.label}</span>}
        </div>
      )}
    </div>
  );
}
