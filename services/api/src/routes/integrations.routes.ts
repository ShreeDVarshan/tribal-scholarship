import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import * as verificationService from '../services/verification.service';
import { success, error } from '../utils/response';
import { prisma } from '../utils/prisma';

export async function integrationRoutes(app: FastifyInstance) {
  app.get('/status', async (_request: FastifyRequest, reply: FastifyReply) => {
    const statuses = await verificationService.getIntegrationStatuses();
    return reply.send(success(statuses));
  });

  app.post('/verify', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({
      documentId: z.string(),
    });
    const { documentId } = schema.parse(request.body);

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });
    if (!doc) return reply.code(404).send(error('NOT_FOUND', 'Document not found'));

    const result = await verificationService.verifyDocument({
      documentId: doc.id,
      documentType: doc.documentType,
      studentProfileId: doc.studentProfileId,
    });

    return reply.send(success(result));
  });

  app.get('/logs', { preHandler: [authenticate] }, async (_request: FastifyRequest, reply: FastifyReply) => {
    const logs = await prisma.integrationLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return reply.send(success(logs));
  });
}
