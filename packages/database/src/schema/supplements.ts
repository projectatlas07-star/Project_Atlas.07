import { pgTable, uuid, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { claims } from "./claims";

export const supplements = pgTable("supplements", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  requestedAmount: numeric("requested_amount", { precision: 12, scale: 2 }),
  approvedAmount: numeric("approved_amount", { precision: 12, scale: 2 }),
  status: text("status"), // e.g., pending, approved, denied
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
});
