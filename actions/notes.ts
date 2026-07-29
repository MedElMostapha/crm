"use server";

import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { noteSchema } from "@/schemas";
import { generateId } from "@/utils";
import { success, failure } from "@/lib/action-result";
import { createActivity } from "./activities";

export async function createNote(input: unknown) {
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.message);
  }

  try {
    const id = generateId();
    await db.insert(schema.note).values({
      id,
      ...parsed.data,
    });

    await createActivity({
      type: "note_created",
      description: `A note was added to customer`,
      customerId: parsed.data.customerId,
    });

    revalidatePath(`/customers/${parsed.data.customerId}`);
    return success(id, "Note created successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create note"
    );
  }
}

export async function getNotesByCustomer(customerId: string) {
  try {
    const notes = await db.query.note.findMany({
      where: eq(schema.note.customerId, customerId),
      orderBy: desc(schema.note.createdAt),
    });
    return success(notes);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to fetch notes"
    );
  }
}

export async function deleteNote(id: string, customerId: string) {
  try {
    await db.delete(schema.note).where(eq(schema.note.id, id));
    revalidatePath(`/customers/${customerId}`);
    return success(id, "Note deleted successfully");
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to delete note"
    );
  }
}
