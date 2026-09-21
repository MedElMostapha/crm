import Link from "next/link";
import { TimelineItem, TimelineKind } from "@/types";
import { formatDateTime } from "@/utils";
import {
  Users,
  Building2,
  Target,
  CheckSquare,
  StickyNote,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const kindStyles: Record<
  TimelineKind,
  { icon: React.ElementType; className: string }
> = {
  customer: { icon: Users, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  company: { icon: Building2, className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  deal: { icon: Target, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  task: { icon: CheckSquare, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  note: { icon: StickyNote, className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  activity: { icon: Activity, className: "bg-muted text-muted-foreground" },
};

interface TimelineProps {
  items: TimelineItem[];
  emptyLabel?: string;
}

export function Timeline({
  items,
  emptyLabel = "No activity yet.",
}: TimelineProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <ol className="relative space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-border">
      {items.map((item) => {
        const { icon: Icon, className } = kindStyles[item.kind];
        const content = (
          <>
            <div className="flex flex-wrap items-center gap-x-2">
              <span className="text-sm font-medium">{item.event}</span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(item.date)}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-foreground">{item.title}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground">{item.description}</p>
            )}
          </>
        );

        return (
          <li key={item.id} className="relative flex gap-4">
            <div
              className={cn(
                "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
                className
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            {item.href ? (
              <Link
                href={item.href}
                className="min-w-0 flex-1 rounded-lg transition-colors hover:bg-accent/50"
              >
                {content}
              </Link>
            ) : (
              <div className="min-w-0 flex-1">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
