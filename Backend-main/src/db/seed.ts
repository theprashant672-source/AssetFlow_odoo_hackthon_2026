import { getCollections } from "./collections";
import { db as mockDb } from "./mockDb";
import { normalizeRole } from "../rbac";

const DEMO_AUTH_EMAILS = new Set([
  "superadmin@oddo.com",
  "admin@oddo.com",
  "manager@oddo.com",
  "tl@oddo.com",
  "itservice@oddo.com",
  "employee@oddo.com",
]);

export async function syncDemoAuthUsers() {
  const c = await getCollections();
  const now = new Date();
  const demoUsers = mockDb.users.filter((user) => DEMO_AUTH_EMAILS.has(user.email.trim().toLowerCase()));

  if (!demoUsers.length) return { matchedCount: 0, modifiedCount: 0, upsertedCount: 0 };

  const result = await c.users.bulkWrite(
    demoUsers.map((user) => {
      const email = user.email.trim().toLowerCase();
      const role = normalizeRole(user.role);
      return {
        updateOne: {
          filter: { email },
          update: {
            $set: {
              email,
              passwordHash: user.passwordHash,
              name: user.name,
              mobile: user.mobile,
              role,
              isActive: user.isActive,
              assignedStates: user.assignedStates ?? [],
              updatedAt: now,
            },
            $setOnInsert: {
              id: user.id,
              createdAt: user.createdAt ?? now,
            },
          },
          upsert: true,
        },
      };
    }),
    { ordered: false }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount,
  };
}

export async function seedDatabaseIfEmpty() {
  const c = await getCollections();
  const initialUsersCount = await c.users.estimatedDocumentCount();
  await syncDemoAuthUsers();

  const existingUsers = await c.users.find({}, { projection: { email: 1 } }).toArray();
  const existingEmails = new Set(existingUsers.map((u) => String((u as any).email || "").toLowerCase()));

  const usersToInsert = mockDb.users.filter((u) => !existingEmails.has(u.email.toLowerCase()));
  if (usersToInsert.length) await c.users.insertMany(usersToInsert);

  // Seed minimal baseline for first-time DB only (keep non-user collections stable).
  if (initialUsersCount === 0) {
    if (mockDb.customers.length) await c.customers.insertMany(mockDb.customers);
    if (mockDb.products.length) await c.products.insertMany(mockDb.products);
    if (mockDb.distributors.length) await c.distributors.insertMany(mockDb.distributors);
  }
}
