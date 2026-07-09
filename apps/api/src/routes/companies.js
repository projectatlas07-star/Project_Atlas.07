"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companiesRoutes = void 0;
const crud_1 = require("./crud");
const index_1 = require("../../../../packages/database/src/index");
const companies_1 = require("../../../../packages/database/src/schema/companies");
const zod_1 = require("zod");
const stream_1 = require("stream");
const csv_parser_1 = __importDefault(require("csv-parser")); // ensure csv-parser is installed
// Zod schema for a company – adjust fields according to DB schema
const companySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    // add other required fields here (e.g., address, email)
});
// Mapping schema – maps CSV column names to DB column names
const columnMappingSchema = zod_1.z.record(zod_1.z.string());
const companiesRoutes = async (fastify) => {
    // Register generic CRUD routes
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: companies_1.companies,
        schema: companySchema,
    });
    // CSV import endpoint: multipart/form-data with 'file' and 'mapping' fields
    fastify.post('/import-csv', async (req, reply) => {
        const multipart = await req.file();
        if (!multipart) {
            return reply.code(400).send({ error: 'File missing' });
        }
        const { fields } = multipart;
        const mappingRaw = fields?.mapping;
        if (!mappingRaw) {
            return reply.code(400).send({ error: 'Column mapping missing' });
        }
        const mappingParse = columnMappingSchema.safeParse(JSON.parse(mappingRaw));
        if (!mappingParse.success) {
            return reply.code(400).send({ error: 'Invalid column mapping', details: mappingParse.error.format() });
        }
        const mapping = mappingParse.data; // { csvColumn: dbField }
        const rows = [];
        await new Promise((resolve, reject) => {
            const parser = (0, csv_parser_1.default)();
            (0, stream_1.pipeline)(multipart.file, parser, (err) => {
                if (err)
                    reject(err);
            });
            parser.on('data', (data) => {
                const payload = {};
                for (const [csvCol, dbField] of Object.entries(mapping)) {
                    payload[dbField] = data[csvCol];
                }
                rows.push(payload);
            });
            parser.on('end', () => resolve());
            parser.on('error', (e) => reject(e));
        });
        const validated = [];
        for (const row of rows) {
            const parsed = companySchema.safeParse(row);
            if (!parsed.success) {
                return reply.code(400).send({ error: 'Row validation failed', row, details: parsed.error.format() });
            }
            const companyId = req.companyId;
            validated.push({ ...parsed.data, companyId });
        }
        const inserted = [];
        for (const payload of validated) {
            const [record] = await index_1.db.insert(companies_1.companies).values(payload).returning();
            inserted.push(record);
        }
        reply.code(201).send({ insertedCount: inserted.length, inserted });
    });
};
exports.companiesRoutes = companiesRoutes;
