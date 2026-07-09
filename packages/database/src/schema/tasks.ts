import { pgTable, uuid, text, timestamp, varchar, numeric } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  assignedTo: uuid("assigned_to"), // references users.id (profiles)
  status: varchar("status", { length: 32 }).default("open"), // open, in_progress, done
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
});
