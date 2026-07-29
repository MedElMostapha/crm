import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/search-input";
import { TaskList } from "@/features/tasks/task-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage your tasks and follow-ups."
        actions={
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        }
      />
      <div className="flex items-center gap-4">
        <SearchInput placeholder="Search tasks..." />
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <TaskListWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function TaskListWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const priority =
    typeof params.priority === "string" ? params.priority : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;

  return <TaskList search={search} status={status} priority={priority} page={page} />;
}
