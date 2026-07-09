// apps/api/src/routes/documents.ts
import { FastifyPluginAsync } from 'fastify';
import { registerCrudRoutes } from './crud';
import { documents } from '@project-atlas/database';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { eq } from 'drizzle-orm';
import { db } from '@project-atlas/database';

// Document schema for validation
const documentSchema = z.object({
  claimId: z.string().uuid().optional(),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().max(100).optional(),
  sizeBytes: z.number().optional(),
});

export const documentsRoutes: FastifyPluginAsync = async (fastify) => {
  // Register generic CRUD routes
  registerCrudRoutes(fastify, {
    basePath: '/',
    table: documents,
    schema: documentSchema,
  });

  // Upload document
  fastify.post('/upload', async (req: any, reply) => {
    const multipart = await req.file();
    if (!multipart) {
      return reply.code(400).send({ error: 'File missing' });
    }

    const { filename, mimetype, file } = multipart;
    const companyId = (req as any).companyId;
    const claimId = (req.body as any).claimId;

    // Generate unique file path
    const fileExtension = filename.split('.').pop();
    const documentId = crypto.randomUUID();
    const filePath = `documents/${companyId}/${documentId}.${fileExtension}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file as any, {
        contentType: mimetype,
        upsert: false,
      });

    if (uploadError) {
      return reply.code(500).send({ error: uploadError.message });
    }

    // Get public URL
    const { data } = supabase.storage.from('documents').getPublicUrl(filePath);

    // Save document record to database
    const [document] = await db.insert(documents).values({
      companyId,
      claimId: claimId || null,
      url: data.publicUrl,
      fileName: filename,
      mimeType: mimetype,
      sizeBytes: (file as any).length,
    }).returning();

    reply.code(201).send(document);
  });

  // Upload document for specific claim
  fastify.post('/claims/:claimId/upload', async (req: any, reply) => {
    const { claimId } = req.params as any;
    const multipart = await req.file();
    if (!multipart) {
      return reply.code(400).send({ error: 'File missing' });
    }

    const { filename, mimetype, file } = multipart;
    const companyId = (req as any).companyId;

    // Generate unique file path
    const fileExtension = filename.split('.').pop();
    const documentId = crypto.randomUUID();
    const filePath = `documents/${companyId}/${claimId}/${documentId}.${fileExtension}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file as any, {
        contentType: mimetype,
        upsert: false,
      });

    if (uploadError) {
      return reply.code(500).send({ error: uploadError.message });
    }

    // Get public URL
    const { data } = supabase.storage.from('documents').getPublicUrl(filePath);

    // Save document record to database
    const [document] = await db.insert(documents).values({
      companyId,
      claimId,
      url: data.publicUrl,
      fileName: filename,
      mimeType: mimetype,
      sizeBytes: (file as any).length,
    }).returning();

    reply.code(201).send(document);
  });

  // Get documents for a specific claim
  fastify.get('/claims/:claimId', async (req, reply) => {
    const { claimId } = req.params as any;
    const companyId = (req as any).companyId;

    const claimDocuments = await db
      .select()
      .from(documents)
      .where(eq((documents as any).claimId, claimId));

    // Filter by company for security
    const filtered = claimDocuments.filter((doc: any) => doc.companyId === companyId);

    reply.send(filtered);
  });

  // Delete document (both from database and storage)
  fastify.delete('/:id', async (req, reply) => {
    const { id } = req.params as any;
    const companyId = (req as any).companyId;

    // Get document first to verify ownership and get URL
    const [document] = await db
      .select()
      .from(documents)
      .where(eq((documents as any).id, id));

    if (!document) {
      return reply.code(404).send({ error: 'Document not found' });
    }

    if ((document as any).companyId !== companyId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    // Delete from Supabase storage
    const url = (document as any).url;
    const filePath = url.split('/documents/')[1];
    if (filePath) {
      await supabase.storage.from('documents').remove([`documents/${filePath}`]);
    }

    // Delete from database
    await db.delete(documents).where(eq((documents as any).id, id));

    reply.code(204).send();
  });

  // Download document (redirect to public URL)
  fastify.get('/:id/download', async (req, reply) => {
    const { id } = req.params as any;
    const companyId = (req as any).companyId;

    // Get document to verify ownership
    const [document] = await db
      .select()
      .from(documents)
      .where(eq((documents as any).id, id));

    if (!document) {
      return reply.code(404).send({ error: 'Document not found' });
    }

    if ((document as any).companyId !== companyId) {
      return reply.code(403).send({ error: 'Access denied' });
    }

    // Redirect to the public URL
    reply.redirect((document as any).url);
  });
};
