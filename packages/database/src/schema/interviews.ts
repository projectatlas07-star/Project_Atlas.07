import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { profiles } from "./users";

export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by").notNull().references(() => profiles.id, { onDelete: "set null" }),
  status: varchar("status", { length: 32 }).default("in_progress"), // in_progress, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
