import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { adjusters } from "./adjusters";

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  adjusterId: uuid("adjuster_id").references(() => adjusters.id, { onDelete: "set null" }),
  claimNumber: varchar("claim_number", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(), // e.g., open, closed, pending
  dateOfLoss: timestamp("date_of_loss"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
});
