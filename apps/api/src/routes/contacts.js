"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactsRoutes = void 0;
const crud_1 = require("./crud");
const contacts_1 = require("../../../../packages/database/src/schema/contacts");
const zod_1 = require("zod");
// Adjust the schema according to your contacts table definition
const contactSchema = zod_1.z.object({
    // Example fields – replace with actual columns from your DB schema
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
});
const contactsRoutes = async (fastify) => {
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: contacts_1.contacts,
        schema: contactSchema,
    });
};
exports.contactsRoutes = contactsRoutes;
