import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { getTaskById } from "@/actions/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Flag } from "lucide-react";
import { formatDate } from "@/utils";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants";

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const result = await getTaskById(id);

  if (!result.success) {
    notFound();
  }

  const task = result.data;
  const priority = TASK_PRIORITIES.find((p) => p.value === task.priority);
  const status = TASK_STATUSES.find((s) => s.value === task.status);

  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        description="Task details and assignment."
      />

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{status?.label ?? task.status}</Badge>
            <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
              {priority?.label ?? task.priority}
            </Badge>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Due {formatDate(task.dueDate)}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Flag className="h-4 w-4" />
              Assigned to{" "}
              {task.customer
                ? `${task.customer.firstName} ${task.customer.lastName}`
                : "No one"}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={task.completed} disabled />
              <span className="text-muted-foreground">
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
          {task.description && (
            <p className="whitespace-pre-wrap text-sm">{task.description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
