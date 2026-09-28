import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import { errorHandler } from './middleware/error.handler';
import { registerRoutes } from './routes';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
      transport: process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
  });

  // Security
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // CORS
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Rate limiting
  await app.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'),
    errorResponseBuilder: () => ({
      success: false,
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' },
    }),
  });

  // File upload
  await app.register(multipart, {
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE_MB || '10') * 1024 * 1024,
    },
  });

  // Swagger API docs
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Janjathi Shiksha Setu API',
        description: 'One Platform. One Profile. One Right. — Unified scholarship management API for ST students.',
        version: '1.0.0',
      },
      servers: [{ url: '/api', description: 'API Base URL' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'profile', description: 'Student profile management' },
        { name: 'scholarships', description: 'Scholarship schemes' },
        { name: 'eligibility', description: 'Eligibility engine' },
        { name: 'documents', description: 'Document management' },
        { name: 'applications', description: 'Scholarship applications' },
        { name: 'payments', description: 'Payment and DBT records' },
        { name: 'notifications', description: 'In-app notifications' },
        { name: 'jago', description: 'JAGO AI assistant' },
        { name: 'admin', description: 'Admin dashboard (requires admin role)' },
        { name: 'integrations', description: 'Mock government integration adapters' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });

  // Global error handler
  app.setErrorHandler(errorHandler);

  // Register all API routes
  await app.register(registerRoutes, { prefix: '/api' });

  // Health check
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'janjathi-shiksha-setu-api',
    version: '1.0.0',
  }));

  return app;
}
