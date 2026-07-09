"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiConversations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
const users_1 = require("./users");
exports.aiConversations = (0, pg_core_1.pgTable)("ai_conversations", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    companyId: (0, pg_core_1.uuid)("company_id").notNull().references(() => companies_1.companies.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.uuid)("user_id").references(() => users_1.profiles.id, { onDelete: "set null" }),
    prompt: (0, pg_core_1.text)("prompt").notNull(),
    response: (0, pg_core_1.text)("response").notNull(),
    metadata: (0, pg_core_1.jsonb)("metadata"), // additional info, e.g., token usage
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull()
});
