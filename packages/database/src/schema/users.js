"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profiles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.profiles = (0, pg_core_1.pgTable)("profiles", {
    id: (0, pg_core_1.uuid)("id").primaryKey(), // maps to auth.users.id in Supabase Auth
    email: (0, pg_core_1.text)("email").notNull(),
    firstName: (0, pg_core_1.text)("first_name"),
    lastName: (0, pg_core_1.text)("last_name"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// Note: tenant_members schema moved to its own file (tenant_members.ts) for clarity.
