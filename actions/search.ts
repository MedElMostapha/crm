"use server";

import { like, or, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { success, failure } from "@/lib/action-result";
import { type SearchResult } from "@/types";

export async function globalSearch(query: string) {
  try {
    const term = `%${query}%`;

    const [customers, companies, deals, tasks] = await Promise.all([
      db.query.customer.findMany({
        where: or(
          like(schema.customer.firstName, term),
          like(schema.customer.lastName, term),
          like(schema.customer.email, term)
        ),
        limit: 5,
      }),
      db.query.company.findMany({
        where: or(
          like(schema.company.name, term),
          like(schema.company.industry, term),
          like(schema.company.email, term)
        ),
        limit: 5,
      }),
      db.query.deal.findMany({
        where: or(
          like(schema.deal.title, term),
          like(schema.deal.notes, term)
        ),
        limit: 5,
        with: { customer: true },
      }),
      db.query.task.findMany({
        where: or(
          like(schema.task.title, term),
          like(schema.task.description, term)
        ),
        limit: 5,
      }),
    ]);

    const results: SearchResult[] = [
      ...customers.map((c) => ({
        id: c.id,
        type: "customer" as const,
        title: `${c.firstName} ${c.lastName}`,
        subtitle: c.email ?? "No email",
        href: `/customers/${c.id}`,
      })),
      ...companies.map((c) => ({
        id: c.id,
        type: "company" as const,
        title: c.name,
        subtitle: c.industry ?? "No industry",
        href: `/companies/${c.id}`,
      })),
      ...deals.map((d) => ({
        id: d.id,
        type: "deal" as const,
        title: d.title,
        subtitle: d.customer
          ? `${d.customer.firstName} ${d.customer.lastName}`
          : "No customer",
        href: `/deals/${d.id}`,
      })),
      ...tasks.map((t) => ({
        id: t.id,
        type: "task" as const,
        title: t.title,
        subtitle: t.status,
        href: `/tasks/${t.id}`,
      })),
    ];

    return success(results);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Search failed"
    );
  }
}
