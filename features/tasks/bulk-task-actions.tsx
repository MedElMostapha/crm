"use client";

import { useRouter } from "next/navigation";
import { completeTasksBulk, deleteTasksBulk } from "@/actions/tasks";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Check } from "lucide-react";
import { TaskWithRelations } from "@/types";

interface BulkTaskActionsProps {
  tasks: TaskWithRelations[];
  clear: () => void;
}

export function BulkTaskActions({ tasks, clear }: BulkTaskActionsProps) {
  const router = useRouter();

  async function run(result: Awaited<ReturnType<typeof completeTasksBulk>>) {
    if (result.success) {
      toast.success(result.message ?? "Tasks updated");
      clear();
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleComplete() {
    const pending = tasks.filter((task) => !task.completed);
    if (pending.length === 0) {
      toast.info("Selected tasks are already completed");
      return;
    }
    await run(await completeTasksBulk(pending.map((task) => task.id)));
  }

  async function handleDelete() {
    if (
      !confirm(
        `Delete ${tasks.length} task${tasks.length !== 1 ? "s" : ""}? This cannot be undone.`
      )
    ) {
      return;
    }
    await run(await deleteTasksBulk(tasks.map((task) => task.id)));
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-4 py-2.5">
      <p className="text-sm font-medium">
        {tasks.length} task{tasks.length !== 1 ? "s" : ""} selected
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleComplete}>
          <Check className="mr-2 h-4 w-4 text-emerald-600" />
          Complete
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}