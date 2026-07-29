"use server";

import { revalidatePath } from "next/cache";
import { eq, like, or, desc, count, sql } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { companySchema } from "@/schemas";
import { generateId } from "@/utils";
import { success, failure } from "@/lib/action-result";

export async function getCompanies(search?: string, page = 1, limit = 10) {
  try {
    const where = search
      ? or(
          like(schema.company.name, `%${search}%`),
          like(schema.company.industry, `%${search}%`),
          like(schema.company.email, `%${search}%`)
        )
      : undefined;

    const [companies, totalResult] = await Promise.all([
      db.query.company.findMany({
        where,
        limit,
        offset: (page - 1) * limit,
        orderBy: desc(schema.company.createdAt),
      }),
      db
        .select({ count: count() })
        .from(schema.company)
        .where(where ?? sql`1`)
        .then((res) => res[0]?.count ?? 0),
    ]);

    return success({
      companies,
      total: totalResult,
      totalPages: Math.ceil(totalResult / limit),
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch companies"
    );
  }
}

export async function getCompanyById(id: string) {
  try {
    const company = await db.query.company.findFirst({
      where: eq(schema.company.id, id),
      with: {
        customers: true,
        deals: { with: { customer: true } },
      },
    });

    if (!company) {
      return failure("Company not found");
    }

    return success(company);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch company"
    );
  }
}

export async function createCompany(input: unknown) {
  const parsed = companySchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    const id = generateId();
    await db.insert(schema.company).values({
      id,
      ...parsed.data,
    });

    revalidatePath("/companies");
    return success(id, "Company created successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create company"
    );
  }
}

export async function updateCompany(id: string, input: unknown) {
  const parsed = companySchema.partial().safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    await db
      .update(schema.company)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(schema.company.id, id));

    revalidatePath("/companies");
    revalidatePath(`/companies/${id}`);
    return success(id, "Company updated successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update company"
    );
  }
}

export async function deleteCompany(id: string) {
  try {
    await db.delete(schema.company).where(eq(schema.company.id, id));
    revalidatePath("/companies");
    return success(id, "Company deleted successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to delete company"
    );
  }
}

export async function getCompaniesForSelect() {
  try {
    const companies = await db.query.company.findMany({
      orderBy: schema.company.name,
    });
    return success(companies);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch companies"
    );
  }
}
