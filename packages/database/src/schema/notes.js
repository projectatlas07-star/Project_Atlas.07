"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
exports.notes = (0, pg_core_1.pgTable)("notes", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id").notNull().references(() => companies_1.companies.id, { onDelete: "cascade" }),
    entityType: (0, pg_core_1.text)("entity_type").notNull(), // e.g., "claim", "property"
    entityId: (0, pg_core_1.uuid)("entity_id").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by"),
    updatedBy: (0, pg_core_1.uuid)("updated_by"),
});
