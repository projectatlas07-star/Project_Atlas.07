// apps/api/tests/companies.test.ts
import request from 'supertest';
import { buildFastify } from '../src/server'; // assume server exports a factory

/**
 * Basic integration test for company CRUD and CSV import.
 */
describe('Companies API', () => {
  let app: ReturnType<typeof buildFastify>;

  beforeAll(async () => {
    app = await buildFastify();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET empty list', async () => {
    const res = await request(app.server).get('/companies');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Create company', async () => {
    const res = await request(app.server)
      .post('/companies')
      .send({ name: 'Acme Corp' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Acme Corp');
    expect(res.body.id).toBeDefined();
  });

  test('Import CSV (mocked file)', async () => {
    const csvContent = 'Company Name,Email\nAcme Corp,info@acme.com';
    const mapping = JSON.stringify({ 'Company Name': 'name', Email: 'email' });
    const res = await request(app.server)
      .post('/companies/import-csv')
      .field('mapping', mapping)
      .attach('file', Buffer.from(csvContent), { filename: 'test.csv' });
    expect(res.status).toBe(201);
    expect(res.body.insertedCount).toBeGreaterThan(0);
  });
});
