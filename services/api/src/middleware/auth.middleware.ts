import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../utils/jwt';
import { prisma } from '../utils/prisma';
import { error } from '../utils/response';

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      role: string;
      mobile: string;
    };
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send(error('UNAUTHORIZED', 'Authentication required'));
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = verifyAccessToken(token);

    // Check user is still active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { isActive: true },
    });

    if (!user || !user.isActive) {
      return reply.code(401).send(error('UNAUTHORIZED', 'Account is inactive or not found'));
    }

    request.user = payload;
  } catch (err) {
    return reply.code(401).send(error('UNAUTHORIZED', 'Invalid or expired token'));
  }
}
