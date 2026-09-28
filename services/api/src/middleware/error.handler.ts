import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
  err: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    request.log.error(err);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    reply.code(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Fastify validation errors
  if (err.validation) {
    reply.code(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.validation,
      },
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    reply.code(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
    });
    return;
  }

  // Prisma errors
  if (err.message?.includes('Unique constraint')) {
    reply.code(409).send({
      success: false,
      error: { code: 'DUPLICATE', message: 'A record with this information already exists' },
    });
    return;
  }

  // Rate limit
  if ((err as any).statusCode === 429) {
    reply.code(429).send({
      success: false,
      error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' },
    });
    return;
  }

  // Default internal error — never expose stack trace
  const statusCode = (err as any).statusCode || 500;
  reply.code(statusCode).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred. Please try again.',
    },
  });
}
