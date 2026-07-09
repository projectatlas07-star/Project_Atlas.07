"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const crud_1 = require("./crud");
const users_1 = require("../../../../packages/database/src/schema/users");
const zod_1 = require("zod");
// Basic schema; extend as needed.
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional()
});
const usersRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: users_1.profiles,
        schema: userSchema,
    });
};
exports.usersRoutes = usersRoutes;
