"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.properties = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
exports.properties = (0, pg_core_1.pgTable)("properties", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id")
        .notNull()
        .references(() => companies_1.companies.id, { onDelete: "cascade" }),
    address: (0, pg_core_1.text)("address"),
    city: (0, pg_core_1.text)("city"),
    state: (0, pg_core_1.text)("state"),
    zip: (0, pg_core_1.text)("zip"),
    ownerName: (0, pg_core_1.text)("owner_name"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by"),
    updatedBy: (0, pg_core_1.uuid)("updated_by"),
});
