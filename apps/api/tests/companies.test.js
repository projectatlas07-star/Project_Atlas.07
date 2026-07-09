"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/api/tests/companies.test.ts
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../src/server"); // assume server exports a factory
/**
 * Basic integration test for company CRUD and CSV import.
 */
describe('Companies API', () => {
    let app;
    beforeAll(async () => {
        app = await (0, server_1.buildFastify)();
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });
    test('GET empty list', async () => {
        const res = await (0, supertest_1.default)(app.server).get('/companies');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    test('Create company', async () => {
        const res = await (0, supertest_1.default)(app.server)
            .post('/companies')
            .send({ name: 'Acme Corp' });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Acme Corp');
        expect(res.body.id).toBeDefined();
    });
    test('Import CSV (mocked file)', async () => {
        const csvContent = 'Company Name,Email\nAcme Corp,info@acme.com';
        const mapping = JSON.stringify({ 'Company Name': 'name', Email: 'email' });
        const res = await (0, supertest_1.default)(app.server)
            .post('/companies/import-csv')
            .field('mapping', mapping)
            .attach('file', Buffer.from(csvContent), { filename: 'test.csv' });
        expect(res.status).toBe(201);
        expect(res.body.insertedCount).toBeGreaterThan(0);
    });
});
