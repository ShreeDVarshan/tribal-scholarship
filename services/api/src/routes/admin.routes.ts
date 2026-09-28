import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { requireAdmin } from '../middleware/admin.middleware';
import * as adminService from '../services/admin.service';
import { success, error } from '../utils/response';
import { prisma } from '../utils/prisma';

export async function adminRoutes(app: FastifyInstance) {
  // Public admin login helper if needed or uses auth/login
  app.get('/dashboard', { preHandler: [requireAdmin] }, async (_request: FastifyRequest, reply: FastifyReply) => {
    const stats = await adminService.getDashboardStats();
    return reply.send(success(stats));
  });

  app.get('/applications', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as any;
    const result = await adminService.getAdminApplications({
      status: query.status,
      schemeCode: query.schemeCode,
      state: query.state,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    });
    return reply.send(success(result));
  });

  app.get('/applications/:id', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const application = await prisma.scholarshipApplication.findUnique({
      where: { id },
      include: {
        scheme: true,
        studentProfile: {
          include: {
            academicProfile: true,
            documents: true,
          },
        },
        timeline: { orderBy: { createdAt: 'asc' } },
        payments: true,
      },
    });
    if (!application) return reply.code(404).send(error('NOT_FOUND', 'Application not found'));
    return reply.send(success(application));
  });

  app.patch('/applications/:id/status', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const schema = z.object({
      status: z.string(),
      description: z.string().optional(),
      actionRequired: z.string().optional(),
    });
    const { status, description, actionRequired } = schema.parse(request.body);

    const updated = await prisma.scholarshipApplication.update({
      where: { id },
      data: {
        status,
        timeline: {
          create: {
            status,
            description: description || `Status updated to ${status} by Administrator`,
            actionRequired,
            updatedBy: 'ADMIN',
          },
        },
      },
      include: { timeline: true },
    });
    return reply.send(success(updated, 'Status updated successfully'));
  });

  app.get('/students', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as any;
    const result = await adminService.getAdminStudents({
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
      search: query.search,
    });
    return reply.send(success(result));
  });

  app.get('/coverage-gap', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as any;
    const result = await adminService.getCoverageGap({
      state: query.state,
      academicLevel: query.academicLevel,
      potentialScheme: query.potentialScheme,
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    });
    return reply.send(success(result));
  });

  app.post('/coverage-gap/:id/flag', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const adminUser = await prisma.adminProfile.findFirst({ where: { userId: request.user!.userId } });
    if (!adminUser) return reply.code(403).send(error('FORBIDDEN', 'Admin profile not found'));

    const result = await adminService.flagForOutreach(id, adminUser.id);
    return reply.send(success(result, 'Flagged for outreach'));
  });

  app.get('/verification', { preHandler: [requireAdmin] }, async (_request: FastifyRequest, reply: FastifyReply) => {
    const pendingDocs = await prisma.document.findMany({
      where: { status: { in: ['PENDING', 'MANUAL_REVIEW', 'MISMATCH'] }, isDeleted: false },
      include: {
        studentProfile: {
          select: { id: true, fullName: true, state: true, district: true },
        },
        verifications: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send(success(pendingDocs));
  });

  app.post('/verification/:id/approve', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const updated = await prisma.document.update({
      where: { id },
      data: {
        status: 'VERIFIED',
        lastVerifiedAt: new Date(),
        isReusable: true,
        verificationSource: 'Admin Manual Verification',
        verifications: {
          create: {
            status: 'VERIFIED',
            source: 'Admin Manual Override',
            confidence: 1.0,
            reason: 'Approved manually by administrator review',
          },
        },
      },
    });
    return reply.send(success(updated, 'Document verified manually'));
  });

  app.get('/analytics', { preHandler: [requireAdmin] }, async (_request: FastifyRequest, reply: FastifyReply) => {
    const analytics = await adminService.getAnalytics();
    return reply.send(success(analytics));
  });

  app.get('/audit-logs', { preHandler: [requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as any;
    const logs = await adminService.getAuditLogs(
      query.page ? parseInt(query.page) : 1,
      query.limit ? parseInt(query.limit) : 20
    );
    return reply.send(success(logs));
  });
}
