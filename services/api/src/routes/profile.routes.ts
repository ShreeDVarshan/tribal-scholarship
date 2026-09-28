import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import * as profileService from '../services/profile.service';
import { success } from '../utils/response';

export async function profileRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const profile = await profileService.getProfile(request.user!.userId);
    return reply.send(success(profile));
  });

  app.put('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const updated = await profileService.updateProfile(request.user!.userId, request.body);
    return reply.send(success(updated, 'Profile updated successfully'));
  });

  app.get('/readiness', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const readiness = await profileService.getReadiness(request.user!.userId);
    return reply.send(success(readiness));
  });
}
