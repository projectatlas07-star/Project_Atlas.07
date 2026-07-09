import { pgTable, uuid, text, timestamp, varchar, jsonb, boolean } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const interviewTemplates = pgTable("interview_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  
  // Template metadata
  templateId: varchar("template_id", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  version: varchar("version", { length: 16 }).notNull().default("1.0"),
  
  // Template structure
  sections: jsonb("sections").notNull(), // Array of sections with questions
  settings: jsonb("settings"), // Template settings (autosave, validation, etc.)
  
  // Status
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
});
