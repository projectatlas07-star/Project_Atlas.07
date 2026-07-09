"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksRoutes = void 0;
const crud_1 = require("./crud");
const tasks_1 = require("../../../../packages/database/src/schema/tasks");
const zod_1 = require("zod");
// Adjust schema fields to match your tasks table definition
const taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    // Add other fields as needed (e.g., dueDate, assignedTo)
});
const tasksRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: tasks_1.tasks,
        schema: taskSchema,
    });
};
exports.tasksRoutes = tasksRoutes;
