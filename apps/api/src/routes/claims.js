"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimsRoutes = void 0;
const crud_1 = require("./crud");
const claims_1 = require("../../../../packages/database/src/schema/claims");
const zod_1 = require("zod");
// Adjust schema fields to match your claims table definition
const claimSchema = zod_1.z.object({
    // Example fields – replace with actual columns
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
});
const claimsRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: claims_1.claims,
        schema: claimSchema,
    });
};
exports.claimsRoutes = claimsRoutes;
