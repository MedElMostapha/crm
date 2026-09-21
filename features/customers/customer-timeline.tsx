import Link from "next/link";
import {
  ActivityWithRelations,
  Customer,
  Deal,
  Note,
  Task,
  TimelineItem,
  TimelineKind,
} from "@/types";
import { ACTIVITY_TYPES, DEAL_STAGES } from "@/constants";
import { formatCurrency, formatDate, formatDateTime } from "@/utils";
import {
  Users,
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
  deal: { icon: Target, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  task: { icon: CheckSquare, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  note: { icon: StickyNote, className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  activity: { icon: Activity, className: "bg-muted text-muted-foreground" },
};

interface CustomerTimelineProps {
  customer: Customer & {
    deals: Deal[];
    tasks: Task[];
    noteList: Note[];
    activities: ActivityWithRelations[];
  };
}

export function CustomerTimeline({ customer }: CustomerTimelineProps) {
  const items: TimelineItem[] = [
    {
      id: `customer-${customer.id}`,
      kind: "customer" as const,
      event: "Customer created",
      title: `${customer.firstName} ${customer.lastName} was added`,
      date: customer.createdAt,
    },
    ...customer.deals.map((deal) => ({
      id: `deal-${deal.id}`,
      kind: "deal" as const,
      event: "Deal created",
      title: deal.title,
      description: `${
        DEAL_STAGES.find((stage) => stage.value === deal.stage)?.label ??
        deal.stage
      } · ${formatCurrency(deal.value)}`,
      date: deal.createdAt,
      href: `/deals/${deal.id}`,
    })),
    ...customer.tasks.map((task) => ({
      id: `task-${task.id}`,
      kind: "task" as const,
      event: "Task created",
      title: task.title,
      description: task.dueDate ? `Due ${formatDate(task.dueDate)}` : undefined,
      date: task.createdAt,
      href: `/tasks/${task.id}`,
    })),
    ...customer.noteList.map((note) => ({
      id: `note-${note.id}`,
      kind: "note" as const,
      event: "Note added",
      title: note.content,
      date: note.createdAt,
    })),
    ...customer.activities
      .filter(
        (activity) =>
          activity.type !== "customer_created" &&
          activity.type !== "note_created" &&
          !activity.description.includes("was created")
      )
      .map((activity) => ({
        id: `activity-${activity.id}`,
        kind: "activity" as const,
        event:
          ACTIVITY_TYPES.find((type) => type.value === activity.type)?.label ??
          "Activity",
        title: activity.description,
        date: activity.createdAt,
        href: activity.dealId
          ? `/deals/${activity.dealId}`
          : activity.taskId
            ? `/tasks/${activity.taskId}`
            : undefined,
      })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }

  return (
    <ol className="relative space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-border">
      {items.map((item) => {
        const { icon: Icon, className } = kindStyles[item.kind];
        const content = (
          <>
            <div className="flex items-center gap-2">
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
