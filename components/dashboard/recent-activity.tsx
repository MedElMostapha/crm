import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDateTime } from "@/utils";
import { ActivityWithRelations } from "@/types";
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

const colorMap: Record<string, string> = {
  customer_created: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  customer_updated: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  deal_moved: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  task_completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  login: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  logout: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  note_created: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

interface RecentActivityProps {
  activities: ActivityWithRelations[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-amber-500/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
            <Activity className="h-4 w-4" />
          </div>
          <CardTitle>Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {activities.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            activities.map((activity) => {
              const Icon = iconMap[activity.type] ?? Activity;
              const color = colorMap[activity.type] ?? "bg-muted text-muted-foreground";
              return (
                <div
                  key={activity.id}
                  className="flex gap-4 px-6 py-3.5 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={color}>
                      <Icon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
