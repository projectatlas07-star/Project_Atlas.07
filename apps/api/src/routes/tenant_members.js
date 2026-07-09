"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMembersRoutes = void 0;
const crud_1 = require("./crud");
const tenant_members_1 = require("../../../../packages/database/src/schema/tenant_members");
const zod_1 = require("zod");
// Basic schema for tenant members; adjust fields as needed.
const tenantMemberSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    companyId: zod_1.z.string().uuid(),
    role: zod_1.z.string()
});
const tenantMembersRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: tenant_members_1.tenantMembers,
        schema: tenantMemberSchema,
    });
};
exports.tenantMembersRoutes = tenantMembersRoutes;
