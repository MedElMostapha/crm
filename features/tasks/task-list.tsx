import { getTasks } from "@/actions/tasks";
import { TaskTable } from "./task-table";
import { EmptyState } from "@/components/empty-state";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

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

  return <TaskTable tasks={tasks} total={total} />;
}
