"use server";

import { revalidatePath } from "next/cache";
import { eq, like, or, desc, count, sql, inArray } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { customerSchema } from "@/schemas";
import { generateId } from "@/utils";
import { success, failure } from "@/lib/action-result";
import { createActivity } from "./activities";

export async function getCustomers(
  search?: string,
  status?: string,
  source?: string,
  page = 1,
  limit = 10
) {
  try {
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(schema.customer.firstName, `%${search}%`),
          like(schema.customer.lastName, `%${search}%`),
          like(schema.customer.email, `%${search}%`)
        )
      );
    }
    if (status) {
      conditions.push(eq(schema.customer.status, status));
    }
    if (source) {
      conditions.push(eq(schema.customer.source, source));
    }

    const where =
      conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : sql.join(conditions, sql` and `)
        : undefined;

    const [customers, totalResult] = await Promise.all([
      db.query.customer.findMany({
        where,
        limit,
        offset: (page - 1) * limit,
        orderBy: desc(schema.customer.createdAt),
        with: { company: true },
      }),
      db
        .select({ count: count() })
        .from(schema.customer)
        .where(where ?? sql`1`)
        .then((res) => res[0]?.count ?? 0),
    ]);

    return success({
      customers,
      total: totalResult,
      totalPages: Math.ceil(totalResult / limit),
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch customers"
    );
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await db.query.customer.findFirst({
      where: eq(schema.customer.id, id),
      with: {
        company: true,
        deals: { with: { company: true } },
        tasks: true,
        noteList: { orderBy: desc(schema.note.createdAt) },
        activities: { orderBy: desc(schema.activity.createdAt), limit: 20 },
      },
    });

    if (!customer) {
      return failure("Customer not found");
    }

    return success(customer);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch customer"
    );
  }
}

export async function createCustomer(input: unknown) {
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    const id = generateId();
    await db.insert(schema.customer).values({
      id,
      ...parsed.data,
    });

    await createActivity({
      type: "customer_created",
      description: `Customer ${parsed.data.firstName} ${parsed.data.lastName} was created`,
      customerId: id,
    });

    revalidatePath("/customers");
    return success(id, "Customer created successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create customer"
    );
  }
}

export async function updateCustomer(id: string, input: unknown) {
  const parsed = customerSchema.partial().safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    await db
      .update(schema.customer)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(schema.customer.id, id));

    await createActivity({
      type: "customer_updated",
      description: `Customer record was updated`,
      customerId: id,
    });

    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);
    return success(id, "Customer updated successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update customer"
    );
  }
}

export async function deleteCustomer(id: string) {
  try {
    await db.delete(schema.customer).where(eq(schema.customer.id, id));
    revalidatePath("/customers");
    return success(id, "Customer deleted successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to delete customer"
    );
  }
}

export async function deleteCustomersBulk(ids: string[]) {
  try {
    if (ids.length === 0) {
      return failure("No customers selected");
    }

    await db.delete(schema.customer).where(inArray(schema.customer.id, ids));
    revalidatePath("/customers");
    return success(ids.length, `${ids.length} customer${ids.length !== 1 ? "s" : ""} deleted`);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to delete customers"
    );
  }
}

export async function getCustomersForSelect() {
  try {
    const customers = await db.query.customer.findMany({
      orderBy: [schema.customer.firstName, schema.customer.lastName],
    });
    return success(customers);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch customers"
    );
  }
}

export async function importCustomers(rows: unknown[]) {
  if (rows.length === 0) {
    return failure("No rows to import");
  }
  if (rows.length > 500) {
    return failure("Max 500 rows per import");
  }

  try {
    const companies = await db.query.company.findMany();
    const companyByName = new Map(
      companies.map((company) => [
        company.name.trim().toLowerCase(),
        company.id,
      ])
    );

    const values: (typeof schema.customer.$inferInsert)[] = [];
    const errors: { row: number; reason: string }[] = [];

    for (const [index, raw] of rows.entries()) {
      const input = (raw ?? {}) as Record<string, unknown>;
      const rowNumber = index + 2;

      const firstName = String(input.firstName ?? "").trim();
      const lastName = String(input.lastName ?? "").trim();
      const companyName = String(input.company ?? "").trim();

      if (!firstName || !lastName) {
        errors.push({ row: rowNumber, reason: "First and last name are required" });
        continue;
      }

      const parsed = customerSchema.safeParse({
        firstName,
        lastName,
        email: String(input.email ?? "").trim() || null,
        phone: String(input.phone ?? "").trim() || null,
        companyId: companyName
          ? companyByName.get(companyName.toLowerCase()) ?? null
          : null,
        status: String(input.status ?? "lead").trim() || "lead",
        source: String(input.source ?? "").trim() || null,
        tags: String(input.tags ?? "").trim() || null,
        notes: String(input.notes ?? "").trim() || null,
      });

      if (!parsed.success) {
        errors.push({
          row: rowNumber,
          reason: parsed.error.issues[0]?.message ?? "Invalid row",
        });
        continue;
      }

      values.push({ id: generateId(), ...parsed.data });
    }

    if (values.length > 0) {
      await db.insert(schema.customer).values(values);

      for (const customer of values) {
        await createActivity({
          type: "customer_created",
          description: `Customer ${customer.firstName} ${customer.lastName} was created`,
          customerId: customer.id,
        });
      }
    }

    revalidatePath("/customers");
    return success(
      { imported: values.length, errors },
      `${values.length} customer${values.length !== 1 ? "s" : ""} imported`
    );
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to import customers"
    );
  }
}
