import { pgTable, uuid, text, timestamp, varchar, jsonb, boolean, numeric } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { profiles } from "./users";
import { properties } from "./properties";
import { claims } from "./claims";

export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id").references(() => properties.id, { onDelete: "set null" }),
  claimId: uuid("claim_id").references(() => claims.id, { onDelete: "set null" }),
  createdBy: uuid("created_by").notNull().references(() => profiles.id, { onDelete: "set null" }),
  updatedBy: uuid("updated_by").references(() => profiles.id, { onDelete: "set null" }),
  
  // Interview metadata
  interviewNumber: varchar("interview_number", { length: 64 }).notNull(),
  templateId: varchar("template_id", { length: 64 }).notNull(),
  templateName: varchar("template_name", { length: 255 }).notNull(),
  
  // Status and progress
  status: varchar("status", { length: 32 }).notNull().default("draft"), // draft, in_progress, completed, archived
  currentSection: varchar("current_section", { length: 64 }),
  progress: numeric("progress", { precision: 5, scale: 2 }).default('0'), // 0-100
  
  // Interview data
  responses: jsonb("responses"), // All question responses
  conversationHistory: jsonb("conversation_history"), // AI conversation history
  metadata: jsonb("metadata"), // Additional metadata for AI processing
  
  // Generated entities
  generatedCustomerId: uuid("generated_customer_id"),
  generatedPropertyId: uuid("generated_property_id"),
  generatedClaimId: uuid("generated_claim_id"),
  generatedAdjusterId: uuid("generated_adjuster_id"),
  generatedDocumentIds: jsonb("generated_document_ids"), // Array of document IDs
  
  // Timestamps
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
