import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import * as eligibilityService from '../services/eligibility.service';
import { success } from '../utils/response';

export async function eligibilityRoutes(app: FastifyInstance) {
  app.post('/check', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const answers = (request.body as any)?.answers;
    const results = await eligibilityService.checkEligibilityForUser(request.user!.userId, answers);
    return reply.send(success(results));
  });

  app.get('/my-results', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const results = await eligibilityService.getMyEligibilityResults(request.user!.userId);
    return reply.send(success(results));
  });
}
