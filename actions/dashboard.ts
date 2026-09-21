"use server";

import { sql, count, sum, eq, and, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { success, failure } from "@/lib/action-result";
import { DEAL_STAGES } from "@/constants";
import {
  getMonthBuckets,
  getPreviousRange,
  monthKey,
  normalizeDateRange,
  percentChange,
  resolveDateRange,
} from "@/lib/date-range";
import type { PipelineStageMetric } from "@/types";

const OPEN_STAGES = ["lead", "qualified", "proposal", "negotiation"];

export async function getDashboardStats(rangeInput?: string) {
  try {
    const range = normalizeDateRange(rangeInput);
    const { from, to } = resolveDateRange(range);
    const previous = getPreviousRange(range);

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    async function revenueBetween(start: Date, end: Date) {
      const result = await db
        .select({ total: sum(schema.deal.value) })
        .from(schema.deal)
        .where(
          and(
            eq(schema.deal.stage, "won"),
            gte(schema.deal.createdAt, start),
            lte(schema.deal.createdAt, end)
          )
        )
        .then((r) => r[0]?.total ?? 0);
      return Number(result);
    }

    async function customersBetween(start: Date, end: Date) {
      return db
        .select({ count: count() })
        .from(schema.customer)
        .where(
          and(
            gte(schema.customer.createdAt, start),
            lte(schema.customer.createdAt, end)
          )
        )
        .then((r) => r[0]?.count ?? 0);
    }

    async function dealsBetween(start: Date, end: Date) {
      return db
        .select({ count: count() })
        .from(schema.deal)
        .where(
          and(
            gte(schema.deal.createdAt, start),
            lte(schema.deal.createdAt, end)
          )
        )
        .then((r) => r[0]?.count ?? 0);
    }

    const [
      totalCustomers,
      newCustomers,
      activeDeals,
      tasksDueToday,
      revenue,
      wonDeals,
      lostDeals,
      customersCurrent,
      customersPrevious,
      revenueCurrent,
      revenuePrevious,
      dealsCurrent,
      dealsPrevious,
    ] = await Promise.all([
      db.select({ count: count() }).from(schema.customer).then((r) => r[0].count),
      customersBetween(from, to),
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
            lte(schema.task.dueDate, endOfDay),
            eq(schema.task.completed, false)
          )
        )
        .then((r) => r[0].count),
      revenueBetween(from, to),
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
      customersBetween(from, to),
      customersBetween(previous.from, previous.to),
      revenueBetween(from, to),
      revenueBetween(previous.from, previous.to),
      dealsBetween(from, to),
      dealsBetween(previous.from, previous.to),
    ]);

    const conversionRate =
      wonDeals + lostDeals > 0
        ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100)
        : 0;

    return success({
      totalCustomers,
      newCustomers,
      activeDeals,
      tasksDueToday,
      revenue,
      monthlyGrowth: percentChange(revenueCurrent, revenuePrevious),
      conversionRate,
      trends: {
        customers: percentChange(customersCurrent, customersPrevious),
        revenue: percentChange(revenueCurrent, revenuePrevious),
        activeDeals: percentChange(dealsCurrent, dealsPrevious),
      },
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch stats"
    );
  }
}

export async function getDashboardCharts(rangeInput?: string) {
  try {
    const range = normalizeDateRange(rangeInput);
    const { from, to } = resolveDateRange(range);
    const buckets = getMonthBuckets(from, to);
    const bucketByKey = new Map(
      buckets.map((bucket) => [
        bucket.key,
        { month: bucket.label, revenue: 0, customers: 0, actual: 0, forecast: 0 },
      ])
    );

    const [deals, customers] = await Promise.all([
      db.query.deal.findMany(),
      db.query.customer.findMany({
        where: and(
          gte(schema.customer.createdAt, from),
          lte(schema.customer.createdAt, to)
        ),
      }),
    ]);

    const dealsByStage: Record<string, number> = Object.fromEntries(
      DEAL_STAGES.map((stage) => [stage.value, 0])
    );

    for (const deal of deals) {
      if (deal.stage in dealsByStage) {
        dealsByStage[deal.stage] += 1;
      }

      if (deal.stage === "won" && deal.createdAt) {
        const bucket = bucketByKey.get(monthKey(new Date(deal.createdAt)));
        if (bucket) {
          bucket.revenue += Number(deal.value);
          bucket.actual += Number(deal.value);
        }
      }

      if (
        OPEN_STAGES.includes(deal.stage) &&
        deal.expectedCloseDate
      ) {
        const closeBucket = bucketByKey.get(
          monthKey(new Date(deal.expectedCloseDate))
        );
        if (closeBucket) {
          closeBucket.forecast += (Number(deal.value) * deal.probability) / 100;
        }
      }
    }

    for (const customer of customers) {
      const created = customer.createdAt ? new Date(customer.createdAt) : null;
      if (!created) continue;
      const bucket = bucketByKey.get(monthKey(created));
      if (bucket) {
        bucket.customers += 1;
      }
    }

    const series = Array.from(bucketByKey.values());

    return success({
      revenue: series.map(({ month, revenue }) => ({ month, revenue })),
      customers: series.map(({ month, customers }) => ({ month, customers })),
      forecast: series.map(({ month, actual, forecast }) => ({
        month,
        actual,
        forecast,
      })),
      deals: dealsByStage as Record<
        "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost",
        number
      >,
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch charts"
    );
  }
}

export async function getPipelineAnalytics() {
  try {
    const deals = await db
      .select({
        stage: schema.deal.stage,
        value: schema.deal.value,
        probability: schema.deal.probability,
      })
      .from(schema.deal);

    const stages: PipelineStageMetric[] = DEAL_STAGES.map((stage) => ({
      stage: stage.value,
      label: stage.label,
      color: stage.color,
      count: 0,
      value: 0,
      forecast: 0,
    }));
    const stageMap = new Map(stages.map((stage) => [stage.stage, stage]));

    let pipelineValue = 0;
    let weightedForecast = 0;
    let wonValue = 0;
    let wonDeals = 0;
    let lostDeals = 0;
    let openDeals = 0;

    for (const deal of deals) {
      const metric = stageMap.get(deal.stage as PipelineStageMetric["stage"]);
      if (!metric) continue;

      metric.count += 1;
      metric.value += Number(deal.value);

      if (deal.stage === "won") {
        wonDeals += 1;
        wonValue += Number(deal.value);
      } else if (deal.stage === "lost") {
        lostDeals += 1;
      } else {
        openDeals += 1;
        pipelineValue += Number(deal.value);
        const forecast = (Number(deal.value) * deal.probability) / 100;
        metric.forecast += forecast;
        weightedForecast += forecast;
      }
    }

    return success({
      stages,
      pipelineValue,
      weightedForecast: Math.round(weightedForecast),
      openDeals,
      wonDeals,
      lostDeals,
      winRate:
        wonDeals + lostDeals > 0
          ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100)
          : 0,
      avgDealSize: wonDeals > 0 ? Math.round(wonValue / wonDeals) : 0,
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch pipeline"
    );
  }
}
