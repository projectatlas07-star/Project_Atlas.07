"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documents = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
const claims_1 = require("./claims");
exports.documents = (0, pg_core_1.pgTable)("documents", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id").notNull().references(() => companies_1.companies.id, { onDelete: "cascade" }),
    claimId: (0, pg_core_1.uuid)("claim_id").references(() => claims_1.claims.id, { onDelete: "set null" }),
    url: (0, pg_core_1.text)("url").notNull(),
    fileName: (0, pg_core_1.varchar)("file_name", { length: 255 }).notNull(),
    mimeType: (0, pg_core_1.varchar)("mime_type", { length: 100 }),
    sizeBytes: (0, pg_core_1.uuid)("size_bytes"), // store size as bigint if needed
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by"),
    updatedBy: (0, pg_core_1.uuid)("updated_by"),
});
