"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviews = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
const users_1 = require("./users");
exports.interviews = (0, pg_core_1.pgTable)("interviews", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id").notNull().references(() => companies_1.companies.id, { onDelete: "cascade" }),
    createdBy: (0, pg_core_1.uuid)("created_by").notNull().references(() => users_1.profiles.id, { onDelete: "set null" }),
    status: (0, pg_core_1.varchar)("status", { length: 32 }).default("in_progress"), // in_progress, completed
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
