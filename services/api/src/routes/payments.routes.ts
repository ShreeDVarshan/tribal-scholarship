import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import * as paymentService from '../services/payments.service';
import { success, error } from '../utils/response';
import { prisma } from '../utils/prisma';

export async function paymentRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const payments = await paymentService.listPayments(user.studentProfile.id);
    return reply.send(success(payments));
  });

  app.get('/:id', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const payment = await paymentService.getPaymentById(id, user.studentProfile.id);
    return reply.send(success(payment));
  });
}
