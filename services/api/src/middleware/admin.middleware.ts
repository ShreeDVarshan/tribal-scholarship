import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from './auth.middleware';
import { error } from '../utils/response';

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  await authenticate(request, reply);
  if (reply.sent) return;

  if (!request.user || request.user.role !== 'ADMIN') {
    return reply.code(403).send(error('FORBIDDEN', 'Admin access required'));
  }
}
