"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesRoutes = void 0;
const crud_1 = require("./crud");
const properties_1 = require("../../../../packages/database/src/schema/properties");
const zod_1 = require("zod");
// Simple schema that accepts any fields; concrete validation can be added later.
const propertySchema = zod_1.z.object({}).passthrough();
const propertiesRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: properties_1.properties,
        schema: propertySchema,
    });
};
exports.propertiesRoutes = propertiesRoutes;
