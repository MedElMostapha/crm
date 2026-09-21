import { DATE_RANGES, DEFAULT_DATE_RANGE } from "@/constants";
import type { DateRange } from "@/types";

const MONTH_LABELS = [
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

export function isDateRange(value: unknown): value is DateRange {
  return (
    typeof value === "string" &&
    DATE_RANGES.some((range) => range.value === value)
  );
}

export function normalizeDateRange(value: unknown): DateRange {
  return isDateRange(value) ? value : DEFAULT_DATE_RANGE;
}

export function resolveDateRange(range: DateRange, now = new Date()) {
  const to = now;
  let from: Date;

  switch (range) {
    case "30d":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      break;
    case "90d":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 89);
      break;
    case "12m":
      from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      break;
    case "ytd":
      from = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return { from, to };
}

export function getPreviousRange(range: DateRange, now = new Date()) {
  const { from } = resolveDateRange(range, now);
  const durationMs = now.getTime() - from.getTime();

  if (range === "ytd") {
    return {
      from: new Date(from.getFullYear() - 1, 0, 1),
      to: new Date(from.getFullYear() - 1, 11, 31, 23, 59, 59),
    };
  }

  return {
    from: new Date(from.getTime() - durationMs),
    to: new Date(from.getTime() - 1),
  };
}

export type MonthBucket = { key: string; label: string };

export function getMonthBuckets(from: Date, to: Date): MonthBucket[] {
  const buckets: MonthBucket[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(to.getFullYear(), to.getMonth(), 1);

  while (cursor <= end) {
    buckets.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
      label: MONTH_LABELS[cursor.getMonth()],
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return buckets;
}

export function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}
