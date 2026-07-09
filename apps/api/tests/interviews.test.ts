// apps/api/tests/interviews.test.ts
import request from 'supertest';
import { buildFastify } from '../src/server';
import * as ai from '../src/lib/ai';

/**
 * Integration tests for interview workflow routes.
 * The AI generation is mocked to avoid external calls.
 */
jest.mock('../src/lib/ai', () => ({
  generateInterviewAnswer: jest.fn().mockResolvedValue('Mocked AI answer'),
}));

describe('Interviews API', () => {
  let app: ReturnType<typeof buildFastify>;

  beforeAll(async () => {
    app = await buildFastify();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  let interviewId: string;

  test('Create interview', async () => {
    const res = await request(app.server)
      .post('/interviews')
      .send({ candidateName: 'John Doe' });
    expect(res.status).toBe(201);
    expect(res.body.candidateName).toBe('John Doe');
    interviewId = res.body.id;
  });

  test('Add question to interview', async () => {
    const res = await request(app.server)
      .post(`/${interviewId}/questions`)
      .send({ interviewId, question: 'What is your biggest strength?' });
    // Note: the route is registered under /interviews/:interviewId/questions via nested router
    expect(res.status).toBe(201);
    expect(res.body.question).toBe('What is your biggest strength?');
  });

  test('Generate AI answer for question', async () => {
    // First fetch the question to obtain its id
    const qRes = await request(app.server).get(`/${interviewId}/questions`);
    expect(qRes.status).toBe(200);
    const question = qRes.body[0];
    const res = await request(app.server)
      .post(`/${interviewId}/questions/${question.id}/generate-answer`)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.answer).toBe('Mocked AI answer');
    expect(ai.generateInterviewAnswer).toHaveBeenCalled();
  });
});
