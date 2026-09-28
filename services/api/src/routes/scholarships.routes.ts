import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as scholarshipsService from '../services/scholarships.service';
import { success } from '../utils/response';

export async function scholarshipRoutes(app: FastifyInstance) {
  app.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    const schemes = await scholarshipsService.getAllSchemes();
    return reply.send(success(schemes));
  });

  app.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const scheme = await scholarshipsService.getSchemeById(id);
    return reply.send(success(scheme));
  });
}
