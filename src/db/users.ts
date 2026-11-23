import { desc, eq } from "drizzle-orm";
import { db } from "./index.ts";
import { users } from "./schema.ts";

export const ADMIN_EMAIL = "skylarkvirendra@gmail.com";
export const ADMIN_EMAILS = [
  "skylarkvirendra@gmail.com",
  "virendrasinghrawaat@gmail.com",
] as const;

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail === normalized);
}

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName?: string | null,
  photoUrl?: string | null
) {
  const role = isAdminEmail(email) ? "admin" : "client";
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
        role,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          role,
          ...(photoUrl ? { photoUrl } : {}),
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to upsert user in PostgreSQL:", error);
    throw new Error("Database user sync failed. Please try again later.", {
      cause: error,
    });
  }
}

export async function updateUserProfileDb(
  uid: string,
  updates: {
    displayName?: string;
    companyName?: string;
    phone?: string;
  }
) {
  try {
    const result = await db
      .update(users)
      .set({
        ...(updates.displayName !== undefined
          ? { displayName: updates.displayName }
          : {}),
        ...(updates.companyName !== undefined
          ? { companyName: updates.companyName }
          : {}),
        ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error("Failed to update user profile in PostgreSQL:", error);
    throw new Error("Failed to save profile changes. Please try again later.", {
      cause: error,
    });
  }
}

export async function getAllUsersDb() {
  try {
    return await db
      .select({
        id: users.id,
        uid: users.uid,
        email: users.email,
        displayName: users.displayName,
        companyName: users.companyName,
        phone: users.phone,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));
  } catch (error) {
    console.error("Failed to list users from PostgreSQL:", error);
    throw new Error("Database query failed. Please try again later.", {
      cause: error,
    });
  }
}
