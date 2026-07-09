"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCrudRoutes = registerCrudRoutes;
const index_1 = require("../../../../../packages/database/src/index"); // Adjust import according to your project structure
/**
 * Register a set of standard CRUD routes for a given table.
 *
 * @param server Fastify instance
 * @param opts Options containing table name, zod schema for validation, and optional custom handlers
 */
function registerCrudRoutes(server, opts) {
    const { basePath, table, schema, beforeCreate, afterCreate } = opts;
    // List all rows (company‑scoped)
    server.get(basePath, async (req, reply) => {
        const companyId = req.companyId;
        const rows = await index_1.db.select().from(table).where(table.companyId.eq(companyId));
        reply.send(rows);
    });
    // Get by id (ensuring same company)
    server.get(`${basePath}/:id`, async (req, reply) => {
        const { id } = req.params;
        const companyId = req.companyId;
        const row = await index_1.db.select().from(table).where(table.id.eq(id).and(table.companyId.eq(companyId)));
        if (!row)
            return reply.code(404).send({ error: 'Not found' });
        reply.send(row);
    });
    // Create
    server.post(basePath, async (req, reply) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.format() });
        let payload = parsed.data;
        const companyId = req.companyId;
        payload = { ...payload, companyId };
        if (beforeCreate)
            payload = await beforeCreate(payload, req);
        const [created] = await index_1.db.insert(table).values(payload).returning();
        if (afterCreate)
            await afterCreate(created, req);
        reply.code(201).send(created);
    });
    // Update (partial)
    server.patch(`${basePath}/:id`, async (req, reply) => {
        const { id } = req.params;
        const companyId = req.companyId;
        const parsed = schema.partial().safeParse(req.body);
        if (!parsed.success)
            return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.format() });
        const [updated] = await index_1.db
            .update(table)
            .set(parsed.data)
            .where(table.id.eq(id).and(table.companyId.eq(companyId)))
            .returning();
        if (!updated)
            return reply.code(404).send({ error: 'Not found' });
        reply.send(updated);
    });
    // Delete
    server.delete(`${basePath}/:id`, async (req, reply) => {
        const { id } = req.params;
        const companyId = req.companyId;
        const count = await index_1.db.delete(table).where(table.id.eq(id).and(table.companyId.eq(companyId)));
        if (count === 0)
            return reply.code(404).send({ error: 'Not found' });
        reply.code(204).send();
    });
}
