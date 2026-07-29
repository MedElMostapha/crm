import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function AnimatedSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-xl bg-muted/60 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent dark:before:via-white/5",
        className
      )}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <AnimatedSkeleton className="h-9 w-48" />
        <AnimatedSkeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AnimatedSkeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <AnimatedSkeleton className="h-[400px] rounded-xl" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <AnimatedSkeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <AnimatedSkeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-6">
      <AnimatedSkeleton className="h-5 w-1/3" />
      <AnimatedSkeleton className="h-4 w-1/2" />
      <AnimatedSkeleton className="h-24 w-full" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-2">
        <AnimatedSkeleton className="h-8 w-8 rounded-lg" />
        <AnimatedSkeleton className="h-5 w-24" />
      </div>
      <AnimatedSkeleton className="mt-4 h-[300px] w-full rounded-lg" />
    </div>
  );
}
