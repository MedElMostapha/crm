import { Activity, Deal, Task, TimelineItem } from "@/types";
import { ACTIVITY_TYPES, DEAL_STAGES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";
import { Timeline } from "@/components/timeline";

interface DealTimelineProps {
  deal: Deal & {
    tasks: Task[];
    activities: Activity[];
  };
}

export function DealTimeline({ deal }: DealTimelineProps) {
  const stage =
    DEAL_STAGES.find((item) => item.value === deal.stage)?.label ?? deal.stage;

  const items: TimelineItem[] = [
    {
      id: `deal-${deal.id}`,
      kind: "deal" as const,
      event: "Deal created",
      title: deal.title,
      description: `${stage} · ${formatCurrency(deal.value)}`,
      date: deal.createdAt,
    },
    ...deal.tasks.map((task) => ({
      id: `task-${task.id}`,
      kind: "task" as const,
      event: task.completed ? "Task completed" : "Task created",
      title: task.title,
      description: task.dueDate ? `Due ${formatDate(task.dueDate)}` : undefined,
      date: task.completed ? task.updatedAt : task.createdAt,
      href: `/tasks/${task.id}`,
    })),
    ...deal.activities
      .filter((activity) => !activity.description.includes("was created"))
      .map((activity) => ({
        id: `activity-${activity.id}`,
        kind: "activity" as const,
        event:
          ACTIVITY_TYPES.find((type) => type.value === activity.type)?.label ??
          "Activity",
        title: activity.description,
        date: activity.createdAt,
        href: activity.taskId ? `/tasks/${activity.taskId}` : undefined,
      })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return <Timeline items={items} />;
}
