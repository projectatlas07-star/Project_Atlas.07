"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplements = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const claims_1 = require("./claims");
exports.supplements = (0, pg_core_1.pgTable)("supplements", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    claimId: (0, pg_core_1.uuid)("claim_id").notNull().references(() => claims_1.claims.id, { onDelete: "cascade" }),
    requestedAmount: (0, pg_core_1.numeric)("requested_amount", { precision: 12, scale: 2 }),
    approvedAmount: (0, pg_core_1.numeric)("approved_amount", { precision: 12, scale: 2 }),
    status: (0, pg_core_1.text)("status"), // e.g., pending, approved, denied
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    createdBy: (0, pg_core_1.uuid)("created_by"),
    updatedBy: (0, pg_core_1.uuid)("updated_by"),
});
