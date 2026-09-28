import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth.middleware';
import * as notifService from '../services/notifications.service';
import { success } from '../utils/response';

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const notifications = await notifService.listNotifications(request.user!.userId);
    return reply.send(success(notifications));
  });

  app.post('/:id/read', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const updated = await notifService.markRead(id, request.user!.userId);
    return reply.send(success(updated, 'Notification marked as read'));
  });

  app.post('/read-all', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    await notifService.markAllRead(request.user!.userId);
    return reply.send(success(null, 'All notifications marked as read'));
  });
}
