"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companies = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.companies = (0, pg_core_1.pgTable)("companies", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.text)("slug").unique().notNull(),
    plan: (0, pg_core_1.text)("plan"),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
    created_by: (0, pg_core_1.uuid)("created_by"),
    updated_by: (0, pg_core_1.uuid)("updated_by")
});
