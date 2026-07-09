import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { companies } from "./companies";

export const adjusters = pgTable("adjusters", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  insuranceCompany: text("insurance_company"),
  email: text("email"),
  phone: text("phone"),
  office: text("office"),
  territory: text("territory"),
  notes: text("notes"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
});
