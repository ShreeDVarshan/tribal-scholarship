import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.middleware';
import * as appService from '../services/applications.service';
import { success, error } from '../utils/response';
import { prisma } from '../utils/prisma';

export async function applicationRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const applications = await appService.listApplications(user.studentProfile.id);
    return reply.send(success(applications));
  });

  app.post('/', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({
      schemeId: z.string(),
      academicYear: z.string().default('2024-2025'),
    });

    const { schemeId, academicYear } = schema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const created = await appService.createApplication(user.studentProfile.id, schemeId, academicYear);
    return reply.code(201).send(success(created, 'Application draft created'));
  });

  app.get('/:id', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const application = await appService.getApplicationById(id, user.studentProfile.id);
    return reply.send(success(application));
  });

  app.get('/:id/timeline', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const timeline = await appService.getApplicationTimeline(id, user.studentProfile.id);
    return reply.send(success(timeline));
  });

  app.post('/:id/submit', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: request.user!.userId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return reply.code(404).send(error('NOT_FOUND', 'Profile not found'));

    const submitted = await appService.submitApplication(id, user.studentProfile.id);
    return reply.send(success(submitted, 'Application successfully submitted'));
  });
}
