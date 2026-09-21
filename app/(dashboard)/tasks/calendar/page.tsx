import { PageHeader } from "@/components/layout/page-header";
import { TaskCalendar } from "@/features/tasks/task-calendar";
import { TaskViewSwitcher } from "@/features/tasks/task-view-switcher";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TaskCalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Visualize your tasks by due date."
        actions={
          <div className="flex items-center gap-2">
            <TaskViewSwitcher />
            <Button asChild>
              <Link href="/tasks/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Link>
            </Button>
          </div>
        }
      />
      <TaskCalendar />
    </div>
  );
}
