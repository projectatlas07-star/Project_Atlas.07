"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notesRoutes = void 0;
const crud_1 = require("./crud");
const notes_1 = require("../../../../packages/database/src/schema/notes");
const zod_1 = require("zod");
// Simple schema – adjust fields to match your notes table
const noteSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().optional(),
});
const notesRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: notes_1.notes,
        schema: noteSchema,
    });
};
exports.notesRoutes = notesRoutes;
