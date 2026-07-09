"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
const users_1 = require("./users");
exports.activityLogs = (0, pg_core_1.pgTable)("activity_logs", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id").notNull().references(() => companies_1.companies.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_1.profiles.id, { onDelete: "set null" }),
    action: (0, pg_core_1.text)("action").notNull(),
    entityType: (0, pg_core_1.text)("entity_type"),
    entityId: (0, pg_core_1.uuid)("entity_id"),
    metadata: (0, pg_core_1.jsonb)("metadata"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
