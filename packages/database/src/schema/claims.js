"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claims = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
exports.claims = (0, pg_core_1.pgTable)("claims", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id").notNull().references(() => companies_1.companies.id, { onDelete: "cascade" }),
    claimNumber: (0, pg_core_1.varchar)("claim_number", { length: 64 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 32 }).notNull(), // e.g., open, closed, pending
    dateOfLoss: (0, pg_core_1.timestamp)("date_of_loss"),
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by"),
    updatedBy: (0, pg_core_1.uuid)("updated_by"),
});
