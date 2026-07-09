// apps/api/src/routes/interviews.ts
import { FastifyPluginAsync } from 'fastify';
import { registerCrudRoutes } from './crud';
import { db } from '@project-atlas/database';
import { interviews, interviewQuestions } from '@project-atlas/database';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { generateInterviewAnswer } from '../lib/ai';
import { Readable } from 'stream';
import { eq, and } from 'drizzle-orm';

// Interview schema – adjust fields to match DB definition
const interviewSchema = z.object({
  candidateName: z.string().min(1),
  // add other fields as needed, e.g., position, status
});

// Interview question schema (for creating questions)
const interviewQuestionSchema = z.object({
  interviewId: z.string().uuid(),
  question: z.string().min(1),
  order: z.number().int().positive().default(1),
});

export const interviewsRoutes: FastifyPluginAsync = async (fastify) => {
  // CRUD for interviews
  registerCrudRoutes(fastify, {
    basePath: '/',
    table: interviews,
    schema: interviewSchema,
  });

  // CRUD for interview questions under a specific interview
  fastify.register(async (questionFastify) => {
    // base: /:interviewId/questions
    const base = '/:interviewId/questions';
    // List questions
    questionFastify.get(base, async (req, reply) => {
      const { interviewId } = req.params as any;
      const rows = await db.select().from(interviewQuestions).where(eq((interviewQuestions as any).interviewId, interviewId));
      reply.send(rows);
    });
    // Create question
    questionFastify.post(base, async (req, reply) => {
      const parsed = interviewQuestionSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'Invalid payload', details: parsed.error.format() });
      }
      const created = await db.insert(interviewQuestions).values(parsed.data).returning();
      // @ts-ignore
      reply.code(201).send(created[0]);
    });
  });

  // Upload a document for an interview – stores in Supabase bucket "interview-documents"
  fastify.post('/:id/upload-document', async (req: any, reply) => {
    const { id } = req.params as any;
    const multipart = await req.file();
    if (!multipart) return reply.code(400).send({ error: 'File missing' });
    const { filename, mimetype } = multipart;
    const filePath = `${id}/${filename}`;
    const { error } = await supabase.storage.from('interview-documents').upload(filePath, multipart.file as any, {
      contentType: mimetype,
      upsert: true,
    });
    if (error) return reply.code(500).send({ error: error.message });
    const { data } = supabase.storage.from('interview-documents').getPublicUrl(filePath);
    reply.send({ url: data.publicUrl });
  });

  // Generate AI answer for a specific question, optionally with context from uploaded docs
  fastify.post('/:interviewId/questions/:questionId/generate-answer', async (req, reply) => {
    const { interviewId, questionId } = req.params as any;
    // Retrieve question text
    const [questionRow] = await db.select().from(interviewQuestions).where(
      (interviewQuestions as any).id.equals(questionId).and((interviewQuestions as any).interviewId.equals(interviewId))
    );
    if (!questionRow) return reply.code(404).send({ error: 'Question not found' });
    // Optional: fetch related documents (concatenate their public URLs as context)
    const { data: files } = await supabase.storage.from('interview-documents').list(`${interviewId}`);
    let contextText = '';
    if (files && files.length) {
      const texts: string[] = [];
      for (const file of files) {
        const { data } = supabase.storage.from('interview-documents').getPublicUrl(`${interviewId}/${file.name}`);
        texts.push(data.publicUrl);
      }
      contextText = texts.join('\n');
    }
    const answer = await generateInterviewAnswer(questionRow.question, contextText);
    reply.send({ answer, contextUsed: !!contextText });
  });
};
