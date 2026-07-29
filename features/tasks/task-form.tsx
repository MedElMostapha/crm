"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { taskSchema, type TaskFormValues } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/constants";
import { Task, Customer, Deal } from "@/types";
import { createTask, updateTask } from "@/actions/tasks";
import { toast } from "sonner";

interface TaskFormProps {
  task?: Task;
  customers: Customer[];
  deals: Deal[];
}

export function TaskForm({ task, customers, deals }: TaskFormProps) {
  const router = useRouter();
  const isEditing = !!task;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? null,
      priority: (task?.priority as TaskFormValues["priority"]) ?? "medium",
      status: (task?.status as TaskFormValues["status"]) ?? "todo",
      dueDate: task?.dueDate ? new Date(task.dueDate) : null,
      assignedCustomerId: task?.assignedCustomerId ?? null,
      assignedDealId: task?.assignedDealId ?? null,
      completed: task?.completed ?? false,
    },
  });

  async function onSubmit(values: TaskFormValues) {
    const result = isEditing
      ? await updateTask(task.id, values)
      : await createTask(values);

    if (result.success) {
      toast.success(result.message);
      router.push("/tasks");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Task Title</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={form.watch("priority")}
            onValueChange={(value) =>
              form.setValue("priority", value as TaskFormValues["priority"])
            }
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {TASK_PRIORITIES.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) =>
              form.setValue("status", value as TaskFormValues["status"])
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={
              form.watch("dueDate")
                ? new Date(form.watch("dueDate") as Date)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) =>
              form.setValue(
                "dueDate",
                e.target.value ? new Date(e.target.value) : null
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignedCustomer">Assigned Customer</Label>
          <Select
            value={form.watch("assignedCustomerId") ?? "none"}
            onValueChange={(value) =>
              form.setValue(
                "assignedCustomerId",
                value === "none" ? null : value
              )
            }
          >
            <SelectTrigger id="assignedCustomer">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignedDeal">Assigned Deal</Label>
          <Select
            value={form.watch("assignedDealId") ?? "none"}
            onValueChange={(value) =>
              form.setValue("assignedDealId", value === "none" ? null : value)
            }
          >
            <SelectTrigger id="assignedDeal">
              <SelectValue placeholder="Select deal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {deals.map((deal) => (
                <SelectItem key={deal.id} value={deal.id}>
                  {deal.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          rows={4}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="completed"
          checked={form.watch("completed")}
          onCheckedChange={(checked) =>
            form.setValue("completed", checked as boolean)
          }
        />
        <Label htmlFor="completed" className="text-sm font-normal">
          Mark as completed
        </Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/tasks")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Task"
            : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
