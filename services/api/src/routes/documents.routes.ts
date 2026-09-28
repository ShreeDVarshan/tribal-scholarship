import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import * as documentsService from '../services/documents.service';
import { success, error } from '../utils/response';
import { prisma } from '../utils/prisma';

export async function documentRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const docs = await documentsService.listDocuments(user.studentProfile.id);
    return reply.send(success(docs));
  });

  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({
      documentType: z.string(),
      documentName: z.string(),
      fileName: z.string().optional(),
      issuedDate: z.string().optional(),
      expiryDate: z.string().optional(),
    });

    const data = schema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const doc = await documentsService.createDocument(user.studentProfile.id, data);
    return reply.code(201).send(success(doc, 'Document added. Trigger verification to verify.'));
  });

  app.get('/:id', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const doc = await documentsService.getDocumentById(id, user.studentProfile.id);
    return reply.send(success(doc));
  });

  app.post('/:id/verify', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const result = await documentsService.triggerVerification(id, user.studentProfile.id);
    return reply.send(success(result, `Verification ${result.status.toLowerCase()}`));
  });

  app.delete('/:id', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    await documentsService.softDeleteDocument(id, user.studentProfile.id);
    return reply.send(success(null, 'Document removed'));
  });

  app.get('/reusable/:schemeCode', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { schemeCode } = request.params as { schemeCode: string };
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const docs = await documentsService.getReusableDocuments(user.studentProfile.id, schemeCode);
    return reply.send(success(docs));
  });
}
