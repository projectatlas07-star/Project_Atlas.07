import { pgTable, uuid, text, timestamp, numeric, varchar, jsonb } from "drizzle-orm/pg-core";
import { claims } from "./claims";
import { companies } from "./companies";
import { adjusters } from "./adjusters";

export const supplements = pgTable("supplements", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  claimId: uuid("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
  adjusterId: uuid("adjuster_id").references(() => adjusters.id, { onDelete: "set null" }),
  supplementNumber: varchar("supplement_number", { length: 64 }).notNull(),
  version: numeric("version", { precision: 3, scale: 0 }).default('1'),
  status: varchar("status", { length: 32 }).notNull().default('draft'),
  carrier: varchar("carrier", { length: 255 }),
  requestedAmount: numeric("requested_amount", { precision: 12, scale: 2 }),
  approvedAmount: numeric("approved_amount", { precision: 12, scale: 2 }),
  difference: numeric("difference", { precision: 12, scale: 2 }),
  lineItems: jsonb("line_items"), // Array of line items
  internalNotes: text("internal_notes"),
  submissionDate: timestamp("submission_date"),
  responseDate: timestamp("response_date"),
  approvalDate: timestamp("approval_date"),
  denialReason: text("denial_reason"),
  revisionHistory: jsonb("revision_history"), // Array of revision entries
  statusHistory: jsonb("status_history"), // Array of status transitions
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
});
