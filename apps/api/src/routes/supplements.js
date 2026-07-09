"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supplementsRoutes = void 0;
const crud_1 = require("./crud");
const supplements_1 = require("../../../../packages/database/src/schema/supplements");
const zod_1 = require("zod");
// Basic schema for supplements; extend as needed.
const supplementSchema = zod_1.z.object({
    claimId: zod_1.z.string().uuid(),
    requestedAmount: zod_1.z.number().optional(),
    approvedAmount: zod_1.z.number().optional(),
    status: zod_1.z.string().optional()
});
const supplementsRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: supplements_1.supplements,
        schema: supplementSchema,
    });
};
exports.supplementsRoutes = supplementsRoutes;
