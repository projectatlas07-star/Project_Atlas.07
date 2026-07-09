import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // maps to auth.users.id in Supabase Auth
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Note: tenant_members schema moved to its own file (tenant_members.ts) for clarity.
