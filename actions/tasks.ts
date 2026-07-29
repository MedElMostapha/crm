"use server";

import { revalidatePath } from "next/cache";
import { eq, like, or, desc, count, sql, and, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { taskSchema } from "@/schemas";
import { generateId } from "@/utils";
import { success, failure } from "@/lib/action-result";
import { createActivity } from "./activities";

export async function getTasks(
  search?: string,
  status?: string,
  priority?: string,
  page = 1,
  limit = 10
) {
  try {
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(schema.task.title, `%${search}%`),
          like(schema.task.description, `%${search}%`)
        )
      );
    }
    if (status) {
      conditions.push(eq(schema.task.status, status));
    }
    if (priority) {
      conditions.push(eq(schema.task.priority, priority));
    }

    const where =
      conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : sql.join(conditions, sql` and `)
        : undefined;

    const [tasks, totalResult] = await Promise.all([
      db.query.task.findMany({
        where,
        limit,
        offset: (page - 1) * limit,
        orderBy: desc(schema.task.dueDate),
        with: {
          customer: { with: { company: true } },
          deal: true,
        },
      }),
      db
        .select({ count: count() })
        .from(schema.task)
        .where(where ?? sql`1`)
        .then((res) => res[0]?.count ?? 0),
    ]);

    return success({
      tasks,
      total: totalResult,
      totalPages: Math.ceil(totalResult / limit),
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch tasks"
    );
  }
}

export async function getTasksDueToday() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const tasks = await db.query.task.findMany({
      where: and(
        gte(schema.task.dueDate, startOfDay),
        lt(schema.task.dueDate, endOfDay),
        eq(schema.task.completed, false)
      ),
      with: {
        customer: true,
        deal: true,
      },
    });

    return success(tasks);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch tasks"
    );
  }
}

export async function getTaskById(id: string) {
  try {
    const task = await db.query.task.findFirst({
      where: eq(schema.task.id, id),
      with: {
        customer: { with: { company: true } },
        deal: true,
      },
    });

    if (!task) {
      return failure("Task not found");
    }

    return success(task);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch task"
    );
  }
}

export async function createTask(input: unknown) {
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    const id = generateId();
    await db.insert(schema.task).values({
      id,
      ...parsed.data,
      completed: parsed.data.completed ?? false,
    });

    revalidatePath("/tasks");
    return success(id, "Task created successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create task"
    );
  }
}

export async function updateTask(id: string, input: unknown) {
  const parsed = taskSchema.partial().safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    const existing = await db.query.task.findFirst({
      where: eq(schema.task.id, id),
    });

    await db
      .update(schema.task)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(schema.task.id, id));

    if (parsed.data.completed && !existing?.completed) {
      await createActivity({
        type: "task_completed",
        description: `Task "${existing?.title}" was completed`,
        taskId: id,
      });
    }

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${id}`);
    return success(id, "Task updated successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update task"
    );
  }
}

export async function deleteTask(id: string) {
  try {
    await db.delete(schema.task).where(eq(schema.task.id, id));
    revalidatePath("/tasks");
    return success(id, "Task deleted successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to delete task"
    );
  }
}
