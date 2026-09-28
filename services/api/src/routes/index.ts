import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { profileRoutes } from './profile.routes';
import { scholarshipRoutes } from './scholarships.routes';
import { eligibilityRoutes } from './eligibility.routes';
import { documentRoutes } from './documents.routes';
import { applicationRoutes } from './applications.routes';
import { paymentRoutes } from './payments.routes';
import { notificationRoutes } from './notifications.routes';
import { jagoRoutes } from './jago.routes';
import { adminRoutes } from './admin.routes';
import { integrationRoutes } from './integrations.routes';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: '/auth' });
  await app.register(profileRoutes, { prefix: '/profile' });
  await app.register(scholarshipRoutes, { prefix: '/scholarships' });
  await app.register(eligibilityRoutes, { prefix: '/eligibility' });
  await app.register(documentRoutes, { prefix: '/documents' });
  await app.register(applicationRoutes, { prefix: '/applications' });
  await app.register(paymentRoutes, { prefix: '/payments' });
  await app.register(notificationRoutes, { prefix: '/notifications' });
  await app.register(jagoRoutes, { prefix: '/jago' });
  await app.register(adminRoutes, { prefix: '/admin' });
  await app.register(integrationRoutes, { prefix: '/integrations' });
}
