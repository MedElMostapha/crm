"use server";

import { desc } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { generateId } from "@/utils";
import { success, failure } from "@/lib/action-result";
import { type ActivityType } from "@/types";

export async function createActivity(input: {
  type: ActivityType;
  description: string;
  userId?: string;
  customerId?: string;
  dealId?: string;
  taskId?: string;
}) {
  try {
    const id = generateId();
    await db.insert(schema.activity).values({
      id,
      ...input,
    });
    return success(id);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create activity"
    );
  }
}

export async function getActivities(limit = 20) {
  try {
    const activities = await db.query.activity.findMany({
      orderBy: desc(schema.activity.createdAt),
      limit,
      with: {
        user: true,
        customer: true,
        deal: true,
        task: true,
      },
    });
    return success(activities);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch activities"
    );
  }
}
