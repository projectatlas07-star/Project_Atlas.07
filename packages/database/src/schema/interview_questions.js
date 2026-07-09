"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewQuestions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const interviews_1 = require("./interviews");
exports.interviewQuestions = (0, pg_core_1.pgTable)("interview_questions", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    interviewId: (0, pg_core_1.uuid)("interview_id").notNull().references(() => interviews_1.interviews.id, { onDelete: "cascade" }),
    question: (0, pg_core_1.text)("question").notNull(),
    order: (0, pg_core_1.integer)("order").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
