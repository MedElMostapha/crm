import { getTasks } from "@/actions/tasks";
import { DataTable } from "@/components/data-table";
import { ExportCsv } from "@/components/export-csv";
import { taskColumns } from "./task-columns";
import { EmptyState } from "@/components/empty-state";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatDate } from "@/utils";

interface TaskListProps {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
}

export async function TaskList({
  search,
  status,
  priority,
  page = 1,
}: TaskListProps) {
  const result = await getTasks(search, status, priority, page);

  if (!result.success) {
    return <p className="text-sm text-destructive">{result.error}</p>;
  }

  const { tasks, total } = result.data;

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Stay on top of your work by adding tasks."
        icon={CheckSquare}
        action={
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} task{total !== 1 ? "s" : ""} found
        </p>
        <ExportCsv
          data={tasks.map((t) => ({
            Title: t.title,
            Priority: t.priority,
            Status: t.status,
            "Due Date": t.dueDate ? formatDate(t.dueDate) : "",
            "Assigned To": t.customer
              ? `${t.customer.firstName} ${t.customer.lastName}`
              : "",
            Completed: t.completed ? "Yes" : "No",
            Created: formatDate(t.createdAt),
          }))}
          filename="tasks.csv"
        />
      </div>
      <DataTable
        columns={taskColumns}
        data={tasks}
        searchColumn="title"
        searchPlaceholder="Filter by title..."
      />
    </div>
  );
}
