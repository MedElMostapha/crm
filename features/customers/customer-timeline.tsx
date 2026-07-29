import { ActivityWithRelations } from "@/types";
import { formatDateTime } from "@/utils";
import {
  Users,
  Target,
  CheckSquare,
  StickyNote,
  LogIn,
  LogOut,
  Pencil,
  Activity,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  customer_created: Users,
  customer_updated: Pencil,
  deal_moved: Target,
  task_completed: CheckSquare,
  login: LogIn,
  logout: LogOut,
  note_created: StickyNote,
};

interface CustomerTimelineProps {
  activities: ActivityWithRelations[];
}

export function CustomerTimeline({ activities }: CustomerTimelineProps) {
  if (activities.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity yet.</p>;
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => {
        const Icon = iconMap[activity.type] ?? Activity;
        return (
          <div key={activity.id} className="flex gap-4">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(activity.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
