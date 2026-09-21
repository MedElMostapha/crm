"use server";

import { and, asc, eq, gte, lt, lte, notInArray } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { success, failure } from "@/lib/action-result";
import { CLOSING_SOON_DAYS, STUCK_DEAL_DAYS } from "@/constants";
import { formatDate } from "@/utils";
import type { Notification } from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function getNotifications() {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + DAY_MS);
    const stuckBefore = new Date(now.getTime() - STUCK_DEAL_DAYS * DAY_MS);
    const closingCutoff = new Date(now.getTime() + CLOSING_SOON_DAYS * DAY_MS);

    const [overdueTasks, dueTodayTasks, stuckDeals, closingDeals] =
      await Promise.all([
        db.query.task.findMany({
          where: and(
            lt(schema.task.dueDate, startOfDay),
            eq(schema.task.completed, false)
          ),
          orderBy: asc(schema.task.dueDate),
          limit: 5,
        }),
        db.query.task.findMany({
          where: and(
            gte(schema.task.dueDate, startOfDay),
            lte(schema.task.dueDate, endOfDay),
            eq(schema.task.completed, false)
          ),
          orderBy: asc(schema.task.dueDate),
          limit: 5,
        }),
        db.query.deal.findMany({
          where: and(
            notInArray(schema.deal.stage, ["won", "lost"]),
            lt(schema.deal.updatedAt, stuckBefore)
          ),
          orderBy: asc(schema.deal.updatedAt),
          limit: 5,
        }),
        db.query.deal.findMany({
          where: and(
            notInArray(schema.deal.stage, ["won", "lost"]),
            gte(schema.deal.expectedCloseDate, now),
            lte(schema.deal.expectedCloseDate, closingCutoff)
          ),
          orderBy: asc(schema.deal.expectedCloseDate),
          limit: 5,
        }),
      ]);

    const notifications: Notification[] = [
      ...overdueTasks.map((task) => ({
        id: `task-overdue-${task.id}`,
        type: "task_overdue" as const,
        title: "Task overdue",
        description: task.title,
        href: `/tasks/${task.id}`,
        severity: "danger" as const,
        date: task.dueDate ?? task.createdAt,
      })),
      ...dueTodayTasks.map((task) => ({
        id: `task-today-${task.id}`,
        type: "task_due_today" as const,
        title: "Task due today",
        description: task.title,
        href: `/tasks/${task.id}`,
        severity: "warning" as const,
        date: task.dueDate ?? task.createdAt,
      })),
      ...stuckDeals.map((deal) => ({
        id: `deal-stuck-${deal.id}`,
        type: "deal_stuck" as const,
        title: "Deal stalled",
        description: `${deal.title} · no update for ${STUCK_DEAL_DAYS}+ days`,
        href: `/deals/${deal.id}`,
        severity: "warning" as const,
        date: deal.updatedAt,
      })),
      ...closingDeals.map((deal) => ({
        id: `deal-closing-${deal.id}`,
        type: "deal_closing" as const,
        title: "Closing soon",
        description: `${deal.title} · closes ${formatDate(deal.expectedCloseDate)}`,
        href: `/deals/${deal.id}`,
        severity: "info" as const,
        date: deal.expectedCloseDate ?? deal.createdAt,
      })),
    ];

    return success(notifications);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch notifications"
    );
  }
}
