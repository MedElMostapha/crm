import {
  ActivityWithRelations,
  Customer,
  Deal,
  Note,
  Task,
  TimelineItem,
} from "@/types";
import { ACTIVITY_TYPES, DEAL_STAGES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";
import { Timeline } from "@/components/timeline";

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

  return <Timeline items={items} />;
}
