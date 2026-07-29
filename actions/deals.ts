"use server";

import { revalidatePath } from "next/cache";
import { eq, like, or, desc, count, sql } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { dealSchema } from "@/schemas";
import { generateId } from "@/utils";
import { success, failure } from "@/lib/action-result";
import { createActivity } from "./activities";

export async function getDeals(
  search?: string,
  stage?: string,
  page = 1,
  limit = 10
) {
  try {
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(schema.deal.title, `%${search}%`),
          like(schema.customer.firstName, `%${search}%`),
          like(schema.customer.lastName, `%${search}%`)
        )
      );
    }
    if (stage) {
      conditions.push(eq(schema.deal.stage, stage));
    }

    const where =
      conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : sql.join(conditions, sql` and `)
        : undefined;

    const [deals, totalResult] = await Promise.all([
      db.query.deal.findMany({
        where,
        limit,
        offset: (page - 1) * limit,
        orderBy: desc(schema.deal.createdAt),
        with: {
          customer: { with: { company: true } },
          company: true,
        },
      }),
      db
        .select({ count: count() })
        .from(schema.deal)
        .where(where ?? sql`1`)
        .then((res) => res[0]?.count ?? 0),
    ]);

    return success({
      deals,
      total: totalResult,
      totalPages: Math.ceil(totalResult / limit),
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch deals"
    );
  }
}

export async function getDealById(id: string) {
  try {
    const deal = await db.query.deal.findFirst({
      where: eq(schema.deal.id, id),
      with: {
        customer: { with: { company: true } },
        company: true,
        tasks: true,
        activities: { orderBy: desc(schema.activity.createdAt), limit: 20 },
      },
    });

    if (!deal) {
      return failure("Deal not found");
    }

    return success(deal);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch deal"
    );
  }
}

export async function createDeal(input: unknown) {
  const parsed = dealSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    const id = generateId();
    await db.insert(schema.deal).values({
      id,
      ...parsed.data,
    });

    await createActivity({
      type: "deal_moved",
      description: `Deal "${parsed.data.title}" was created in ${parsed.data.stage}`,
      dealId: id,
    });

    revalidatePath("/deals");
    return success(id, "Deal created successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create deal"
    );
  }
}

export async function updateDeal(id: string, input: unknown) {
  const parsed = dealSchema.partial().safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    const existing = await db.query.deal.findFirst({
      where: eq(schema.deal.id, id),
    });

    await db
      .update(schema.deal)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(schema.deal.id, id));

    if (parsed.data.stage && existing && existing.stage !== parsed.data.stage) {
      await createActivity({
        type: "deal_moved",
        description: `Deal moved from ${existing.stage} to ${parsed.data.stage}`,
        dealId: id,
      });
    }

    revalidatePath("/deals");
    revalidatePath(`/deals/${id}`);
    return success(id, "Deal updated successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update deal"
    );
  }
}

export async function deleteDeal(id: string) {
  try {
    await db.delete(schema.deal).where(eq(schema.deal.id, id));
    revalidatePath("/deals");
    return success(id, "Deal deleted successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to delete deal"
    );
  }
}

export async function updateDealStage(id: string, stage: string) {
  return updateDeal(id, { stage });
}
