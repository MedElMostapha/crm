"use server";

import { sql, count, sum, eq, and, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { success, failure } from "@/lib/action-result";

export async function getDashboardStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const [
      totalCustomers,
      newCustomers,
      activeDeals,
      tasksDueToday,
      revenueResult,
      wonDeals,
      lostDeals,
    ] = await Promise.all([
      db.select({ count: count() }).from(schema.customer).then((r) => r[0].count),
      db
        .select({ count: count() })
        .from(schema.customer)
        .where(gte(schema.customer.createdAt, startOfMonth))
        .then((r) => r[0].count),
      db
        .select({ count: count() })
        .from(schema.deal)
        .where(
          and(
            sql`${schema.deal.stage} != 'won'`,
            sql`${schema.deal.stage} != 'lost'`
          )
        )
        .then((r) => r[0].count),
      db
        .select({ count: count() })
        .from(schema.task)
        .where(
          and(
            gte(schema.task.dueDate, startOfDay),
            lt(schema.task.dueDate, endOfDay),
            eq(schema.task.completed, false)
          )
        )
        .then((r) => r[0].count),
      db
        .select({ total: sum(schema.deal.value) })
        .from(schema.deal)
        .where(eq(schema.deal.stage, "won"))
        .then((r) => r[0].total ?? 0),
      db
        .select({ count: count() })
        .from(schema.deal)
        .where(eq(schema.deal.stage, "won"))
        .then((r) => r[0].count),
      db
        .select({ count: count() })
        .from(schema.deal)
        .where(eq(schema.deal.stage, "lost"))
        .then((r) => r[0].count),
    ]);

    const conversionRate = wonDeals + lostDeals > 0
      ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100)
      : 0;

    return success({
      totalCustomers,
      newCustomers,
      activeDeals,
      tasksDueToday,
      revenue: Number(revenueResult),
      monthlyGrowth: 0,
      conversionRate,
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch stats"
    );
  }
}

export async function getDashboardCharts() {
  try {
    const deals = await db.query.deal.findMany({
      with: { customer: true },
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const revenueByMonth = months.map((month) => ({ month, revenue: 0 }));
    const customersByMonth = months.map((month) => ({ month, customers: 0 }));
    const dealsByStage = {
      lead: 0,
      qualified: 0,
      proposal: 0,
      negotiation: 0,
      won: 0,
      lost: 0,
    };

    for (const deal of deals) {
      const date = deal.createdAt ? new Date(deal.createdAt) : null;
      if (date) {
        revenueByMonth[date.getMonth()].revenue += Number(deal.value);
      }
      if (deal.stage in dealsByStage) {
        dealsByStage[deal.stage as keyof typeof dealsByStage] += 1;
      }
    }

    const customers = await db.query.customer.findMany();
    for (const customer of customers) {
      const date = customer.createdAt ? new Date(customer.createdAt) : null;
      if (date) {
        customersByMonth[date.getMonth()].customers += 1;
      }
    }

    return success({
      revenue: revenueByMonth,
      customers: customersByMonth,
      deals: dealsByStage,
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch charts"
    );
  }
}
