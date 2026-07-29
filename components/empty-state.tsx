import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 text-center transition-all duration-300 hover:border-primary/30 hover:bg-muted/20",
        className
      )}
    >
      {Icon && (
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4">
          <Icon className="h-10 w-10 text-primary/60" />
        </div>
      )}
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
