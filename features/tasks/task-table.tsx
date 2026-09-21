"use client";

import { DataTable } from "@/components/data-table";
import { ExportCsv } from "@/components/export-csv";
import { taskColumns } from "./task-columns";
import { BulkTaskActions } from "./bulk-task-actions";
import { TaskWithRelations } from "@/types";
import { formatDate } from "@/utils";

interface TaskTableProps {
  tasks: TaskWithRelations[];
  total: number;
}

export function TaskTable({ tasks, total }: TaskTableProps) {
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
        selectable
        getRowIdValue={(task) => task.id}
        bulkActions={(selected, clear) => (
          <BulkTaskActions tasks={selected} clear={clear} />
        )}
      />
    </div>
  );
}