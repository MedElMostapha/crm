"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TaskWithRelations } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Check } from "lucide-react";
import Link from "next/link";
import { deleteTask, updateTask } from "@/actions/tasks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants";
import { formatDate } from "@/utils";
import { cn } from "@/lib/utils";

const priorityStyles: Record<string, string> = {
  low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

const statusStyles: Record<string, string> = {
  todo: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

export const taskColumns: ColumnDef<TaskWithRelations>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/tasks/${row.original.id}`}
        className="font-medium transition-colors hover:text-primary"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = TASK_PRIORITIES.find(
        (p) => p.value === row.original.priority
      );
      return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", priorityStyles[row.original.priority] ?? "bg-muted text-muted-foreground")}>
          {priority?.label ?? row.original.priority}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = TASK_STATUSES.find(
        (s) => s.value === row.original.status
      );
      return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", statusStyles[row.original.status] ?? "bg-muted text-muted-foreground")}>
          {status?.label ?? row.original.status}
        </span>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => formatDate(row.original.dueDate),
  },
  {
    accessorKey: "customer",
    header: "Assigned To",
    cell: ({ row }) =>
      row.original.customer
        ? `${row.original.customer.firstName} ${row.original.customer.lastName}`
        : <span className="text-muted-foreground">&mdash;</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <TaskActions task={row.original} />,
  },
];

function TaskActions({ task }: { task: TaskWithRelations }) {
  const router = useRouter();

  async function handleComplete() {
    const result = await updateTask(task.id, {
      completed: true,
      status: "done",
    });
    if (result.success) {
      toast.success("Task completed");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const result = await deleteTask(task.id);
    if (result.success) {
      toast.success("Task deleted");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!task.completed && (
        <Button variant="ghost" size="icon" onClick={handleComplete} className="rounded-lg">
          <Check className="h-4 w-4 text-emerald-600" />
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-lg" />}>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2">
            <Link href={`/tasks/${task.id}/edit`} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
            <Trash className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
