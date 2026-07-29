import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskWithRelations } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils";
import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpcomingTasksProps {
  tasks: TaskWithRelations[];
}

const priorityStyles: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="border-b bg-gradient-to-r from-rose-500/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
            <CheckSquare className="h-4 w-4" />
          </div>
          <CardTitle>Upcoming Tasks</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {tasks.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No upcoming tasks.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/tasks/${task.id}`}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {task.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Due {formatDate(task.dueDate)}
                  </p>
                </div>
                <span
                  className={cn(
                    "ml-4 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
                    priorityStyles[task.priority] ?? "bg-muted text-muted-foreground"
                  )}
                >
                  {task.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
