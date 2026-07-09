"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
exports.tasks = (0, pg_core_1.pgTable)("tasks", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id").notNull().references(() => companies_1.companies.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    assignedTo: (0, pg_core_1.uuid)("assigned_to"), // references users.id (profiles)
    status: (0, pg_core_1.varchar)("status", { length: 32 }).default("open"), // open, in_progress, done
    dueDate: (0, pg_core_1.timestamp)("due_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by"),
    updatedBy: (0, pg_core_1.uuid)("updated_by"),
});
