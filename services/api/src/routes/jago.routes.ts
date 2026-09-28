import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import * as jagoService from '../services/jago.service';
import { success } from '../utils/response';

export async function jagoRoutes(app: FastifyInstance) {
  app.post('/chat', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({
      message: z.string().min(1),
      conversationId: z.string().optional(),
      language: z.string().default('en'),
    });

    const { message, conversationId, language } = schema.parse(request.body);
    const result = await jagoService.chat(request.user!.userId, message, conversationId, language);
    return reply.send(success(result));
  });

  app.get('/conversations', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const conversations = await jagoService.listConversations(request.user!.userId);
    return reply.send(success(conversations));
  });

  app.get('/conversations/:id', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const conversation = await jagoService.getConversation(id, request.user!.userId);
    return reply.send(success(conversation));
  });
}
