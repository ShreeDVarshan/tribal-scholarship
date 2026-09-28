import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import { success, error } from '../utils/response';

const registerSchema = z.object({
  fullName: z.string().min(2).max(100),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  email: z.string().email().optional(),
  password: z.string().min(6).max(100),
  dateOfBirth: z.string(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  state: z.string().min(2),
  district: z.string().min(2),
  studentType: z.enum(['SCHOOL', 'COLLEGE', 'RESEARCH', 'OVERSEAS']),
});

const loginSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  password: z.string().min(1),
});

const otpSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = registerSchema.parse(request.body);
    const result = await authService.register(data);
    return reply.code(201).send(success(result, 'Registration successful. Please log in.'));
  });

  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const { mobile, password } = loginSchema.parse(request.body);
    const result = await authService.login(mobile, password);
    return reply.send(success(result, 'Login successful'));
  });

  app.post('/send-otp', async (request: FastifyRequest, reply: FastifyReply) => {
    const { mobile } = z.object({ mobile: z.string().regex(/^[6-9]\d{9}$/) }).parse(request.body);
    const result = await authService.sendOTP(mobile);
    return reply.send(success(result, 'DEMO MODE: OTP sent (use 123456)'));
  });

  app.post('/verify-otp', async (request: FastifyRequest, reply: FastifyReply) => {
    const { mobile, otp } = otpSchema.parse(request.body);
    const result = await authService.loginWithOTP(mobile, otp);
    return reply.send(success(result, 'OTP verified. Login successful.'));
  });

  app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = refreshSchema.parse(request.body);
    const result = await authService.refreshTokens(refreshToken);
    return reply.send(success(result, 'Tokens refreshed'));
  });

  app.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const { refreshToken } = refreshSchema.parse(request.body);
    await authService.logout(refreshToken);
    return reply.send(success(null, 'Logged out successfully'));
  });
}
