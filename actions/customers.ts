"use server";

import { revalidatePath } from "next/cache";
import { eq, like, or, and, desc, count, sql } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { customerSchema } from "@/schemas";
import { generateId } from "@/utils";
import { success, failure } from "@/lib/action-result";
import { createActivity } from "./activities";

export async function getCustomers(search?: string, page = 1, limit = 10) {
  try {
    const where = search
      ? or(
          like(schema.customer.firstName, `%${search}%`),
          like(schema.customer.lastName, `%${search}%`),
          like(schema.customer.email, `%${search}%`),
          like(schema.customer.companyId, `%${search}%`)
        )
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
