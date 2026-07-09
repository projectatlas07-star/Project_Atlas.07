"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMembers = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
const users_1 = require("./users");
exports.tenantMembers = (0, pg_core_1.pgTable)("tenant_members", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    userId: (0, pg_core_1.uuid)("user_id").notNull().references(() => users_1.profiles.id, { onDelete: "cascade" }),
    companyId: (0, pg_core_1.uuid)("company_id").notNull().references(() => companies_1.companies.id, { onDelete: "cascade" }),
    role: (0, pg_core_1.text)("role").notNull(), // Owner, Admin, Member
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by"),
    updatedBy: (0, pg_core_1.uuid)("updated_by"),
});
