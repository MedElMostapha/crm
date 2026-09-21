"use server";

import { db } from "@/db";
import { success, failure } from "@/lib/action-result";
import { DEAL_STAGES } from "@/constants";
import { format, subMonths } from "date-fns";

const MONTHS = 12;

export async function getReports() {
  try {
    const deals = await db.query.deal.findMany({
      with: { customer: true },
    });

    const months: { key: string; label: string }[] = [];
    for (let i = MONTHS - 1; i >= 0; i -= 1) {
      const date = subMonths(new Date(), i);
      months.push({
        key: format(date, "yyyy-MM"),
        label: format(date, "MMM yy"),
      });
    }
    const bucketByKey = new Map(
      months.map((month) => [
        month.key,
        { month: month.label, revenue: 0, won: 0, lost: 0 },
      ])
    );

    const stages = DEAL_STAGES.map((stage) => ({
      stage: stage.value,
      label: stage.label,
      color: stage.color,
      count: 0,
      value: 0,
    }));
    const stageMap = new Map<string, (typeof stages)[number]>(
      stages.map((stage) => [stage.stage, stage])
    );

    const topCustomers = new Map<
      string,
      { name: string; email: string; revenue: number; deals: number }
    >();

    let wonValue = 0;
    let wonDeals = 0;
    let lostDeals = 0;
    let openDeals = 0;

    for (const deal of deals) {
      const metric = stageMap.get(deal.stage);
      if (metric) {
        metric.count += 1;
        metric.value += Number(deal.value);
      }

      if (deal.stage === "won") {
        wonValue += Number(deal.value);
        wonDeals += 1;
      } else if (deal.stage === "lost") {
        lostDeals += 1;
      } else {
        openDeals += 1;
      }

      const bucket = deal.createdAt
        ? bucketByKey.get(format(new Date(deal.createdAt), "yyyy-MM"))
        : undefined;

      if (deal.stage === "won") {
        if (bucket) {
          bucket.revenue += Number(deal.value);
          bucket.won += 1;
        }
        if (deal.customer) {
          const entry = topCustomers.get(deal.customer.id) ?? {
            name: `${deal.customer.firstName} ${deal.customer.lastName}`,
            email: deal.customer.email ?? "",
            revenue: 0,
            deals: 0,
          };
          entry.revenue += Number(deal.value);
          entry.deals += 1;
          topCustomers.set(deal.customer.id, entry);
        }
      } else if (deal.stage === "lost" && bucket) {
        bucket.lost += 1;
      }
    }

    const revenueByMonth = Array.from(bucketByKey.values()).map(
      ({ month, revenue }) => ({ month, revenue })
    );
    const winRateByMonth = Array.from(bucketByKey.values()).map(
      ({ month, won, lost }) => ({
        month,
        won,
        lost,
        rate: won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0,
      })
    );
    const topCustomerList = Array.from(topCustomers.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return success({
      revenueByMonth,
      winRateByMonth,
      stages,
      topCustomers: topCustomerList,
      totals: {
        wonDeals,
        lostDeals,
        openDeals,
        wonValue,
        winRate:
          wonDeals + lostDeals > 0
            ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100)
            : 0,
        avgDealSize: wonDeals > 0 ? Math.round(wonValue / wonDeals) : 0,
      },
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch reports"
    );
  }
}