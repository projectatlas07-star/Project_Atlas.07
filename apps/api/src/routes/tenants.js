"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantsRoutes = void 0;
const crud_1 = require("./crud");
const tenants_1 = require("../../../../packages/database/src/schema/tenants");
const zod_1 = require("zod");
// Basic schema; extend as needed.
const tenantSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1)
});
const tenantsRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: tenants_1.tenants,
        schema: tenantSchema,
    });
};
exports.tenantsRoutes = tenantsRoutes;
