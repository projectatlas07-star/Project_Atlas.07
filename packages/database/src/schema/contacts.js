"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contacts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
exports.contacts = (0, pg_core_1.pgTable)("contacts", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id")
        .notNull()
        .references(() => companies_1.companies.id, { onDelete: "cascade" }),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email"),
    phone: (0, pg_core_1.text)("phone"),
    role: (0, pg_core_1.text)("role"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by"),
    updatedBy: (0, pg_core_1.uuid)("updated_by"),
});
