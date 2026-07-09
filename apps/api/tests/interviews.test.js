"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/api/tests/interviews.test.ts
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../src/server");
const ai = __importStar(require("../src/lib/ai"));
/**
 * Integration tests for interview workflow routes.
 * The AI generation is mocked to avoid external calls.
 */
jest.mock('../src/lib/ai', () => ({
    generateInterviewAnswer: jest.fn().mockResolvedValue('Mocked AI answer'),
}));
describe('Interviews API', () => {
    let app;
    beforeAll(async () => {
        app = await (0, server_1.buildFastify)();
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });
    let interviewId;
    test('Create interview', async () => {
        const res = await (0, supertest_1.default)(app.server)
            .post('/interviews')
            .send({ candidateName: 'John Doe' });
        expect(res.status).toBe(201);
        expect(res.body.candidateName).toBe('John Doe');
        interviewId = res.body.id;
    });
    test('Add question to interview', async () => {
        const res = await (0, supertest_1.default)(app.server)
            .post(`/${interviewId}/questions`)
            .send({ interviewId, question: 'What is your biggest strength?' });
        // Note: the route is registered under /interviews/:interviewId/questions via nested router
        expect(res.status).toBe(201);
        expect(res.body.question).toBe('What is your biggest strength?');
    });
    test('Generate AI answer for question', async () => {
        // First fetch the question to obtain its id
        const qRes = await (0, supertest_1.default)(app.server).get(`/${interviewId}/questions`);
        expect(qRes.status).toBe(200);
        const question = qRes.body[0];
        const res = await (0, supertest_1.default)(app.server)
            .post(`/${interviewId}/questions/${question.id}/generate-answer`)
            .send();
        expect(res.status).toBe(200);
        expect(res.body.answer).toBe('Mocked AI answer');
        expect(ai.generateInterviewAnswer).toHaveBeenCalled();
    });
});
