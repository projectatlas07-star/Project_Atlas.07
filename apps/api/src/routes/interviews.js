"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewsRoutes = void 0;
const crud_1 = require("./crud");
const index_1 = require("../../../../packages/database/src/index");
const interviews_1 = require("../../../../packages/database/src/schema/interviews");
const interview_questions_1 = require("../../../../packages/database/src/schema/interview_questions");
const zod_1 = require("zod");
const supabase_1 = require("../lib/supabase");
const ai_1 = require("../lib/ai");
// Interview schema – adjust fields to match DB definition
const interviewSchema = zod_1.z.object({
    candidateName: zod_1.z.string().min(1),
    // add other fields as needed, e.g., position, status
});
// Interview question schema (for creating questions)
const interviewQuestionSchema = zod_1.z.object({
    interviewId: zod_1.z.string().uuid(),
    question: zod_1.z.string().min(1),
});
const interviewsRoutes = async (fastify) => {
    // CRUD for interviews
    (0, crud_1.registerCrudRoutes)(fastify, {
        basePath: '/',
        table: interviews_1.interviews,
        schema: interviewSchema,
    });
    // CRUD for interview questions under a specific interview
    fastify.register(async (questionFastify) => {
        // base: /:interviewId/questions
        const base = '/:interviewId/questions';
        // List questions
        questionFastify.get(base, async (req, reply) => {
            const { interviewId } = req.params;
            const rows = await index_1.db.select().from(interview_questions_1.interviewQuestions).where(interview_questions_1.interviewQuestions.interviewId.eq(interviewId));
            reply.send(rows);
        });
        // Create question
        questionFastify.post(base, async (req, reply) => {
            const parsed = interviewQuestionSchema.safeParse(req.body);
            if (!parsed.success) {
                return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.format() });
            }
            const [created] = await index_1.db.insert(interview_questions_1.interviewQuestions).values(parsed.data).returning();
            reply.code(201).send(created);
        });
    });
    // Upload a document for an interview – stores in Supabase bucket "interview-documents"
    fastify.post('/:id/upload-document', async (req, reply) => {
        const { id } = req.params;
        const multipart = await req.file();
        if (!multipart)
            return reply.code(400).send({ error: 'File missing' });
        const { filename, mimetype } = multipart;
        const filePath = `${id}/${filename}`;
        const { error } = await supabase_1.supabase.storage.from('interview-documents').upload(filePath, multipart.file, {
            contentType: mimetype,
            upsert: true,
        });
        if (error)
            return reply.code(500).send({ error: error.message });
        const { publicURL } = supabase_1.supabase.storage.from('interview-documents').getPublicUrl(filePath);
        reply.send({ url: publicURL });
    });
    // Generate AI answer for a specific question, optionally with context from uploaded docs
    fastify.post('/:interviewId/questions/:questionId/generate-answer', async (req, reply) => {
        const { interviewId, questionId } = req.params;
        // Retrieve question text
        const [questionRow] = await index_1.db.select().from(interview_questions_1.interviewQuestions).where(interview_questions_1.interviewQuestions.id.eq(questionId).and(interview_questions_1.interviewQuestions.interviewId.eq(interviewId)));
        if (!questionRow)
            return reply.code(404).send({ error: 'Question not found' });
        // Optional: fetch related documents (concatenate their public URLs as context)
        const { data: files } = await supabase_1.supabase.storage.from('interview-documents').list(`${interviewId}`);
        let contextText = '';
        if (files && files.length) {
            const texts = [];
            for (const file of files) {
                const { publicURL } = supabase_1.supabase.storage.from('interview-documents').getPublicUrl(`${interviewId}/${file.name}`);
                texts.push(publicURL);
            }
            contextText = texts.join('\n');
        }
        const answer = await (0, ai_1.generateInterviewAnswer)(questionRow.question, contextText);
        reply.send({ answer, contextUsed: !!contextText });
    });
};
exports.interviewsRoutes = interviewsRoutes;
