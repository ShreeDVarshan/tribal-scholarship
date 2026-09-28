import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../utils/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshExpiryDate } from '../utils/jwt';
import { verifyOTP, hashOTP, getOTPExpiry } from '../utils/otp';

export interface RegisterInput {
  fullName: string;
  mobile: string;
  email?: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  state: string;
  district: string;
  studentType: string;
}

export async function register(input: RegisterInput) {
  const { fullName, mobile, email, password, dateOfBirth, gender, state, district, studentType } = input;

  // Check duplicates
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ mobile }, ...(email ? [{ email }] : [])] },
  });

  if (existingUser) {
    throw Object.assign(new Error('User already exists'), { code: 'DUPLICATE', statusCode: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      mobile,
      email,
      passwordHash,
      role: 'STUDENT',
      studentProfile: {
        create: {
          fullName,
          dateOfBirth,
          gender,
          mobile,
          email,
          state,
          district,
          studentType,
          profileCompletion: 40,
          readinessScore: 30,
        },
      },
    },
    include: { studentProfile: true },
  });

  return { userId: user.id, mobile: user.mobile, email: user.email, role: user.role };
}

export async function login(mobile: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { mobile },
    include: { studentProfile: true, adminProfile: true },
  });

  if (!user || !user.isActive) {
    throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', statusCode: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS', statusCode: 401 });
  }

  const payload = { userId: user.id, role: user.role, mobile: user.mobile };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      name: user.studentProfile?.fullName || user.adminProfile?.name || 'User',
    },
  };
}

export async function loginWithOTP(mobile: string, otp: string) {
  const user = await prisma.user.findUnique({
    where: { mobile },
    include: { studentProfile: true, adminProfile: true },
  });

  if (!user || !user.isActive) {
    throw Object.assign(new Error('User not found'), { code: 'NOT_FOUND', statusCode: 404 });
  }

  const isValid = await verifyOTP(mobile, otp, user.otpHash);
  if (!isValid) {
    throw Object.assign(new Error('Invalid OTP'), { code: 'INVALID_OTP', statusCode: 401 });
  }

  const payload = { userId: user.id, role: user.role, mobile: user.mobile };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      name: user.studentProfile?.fullName || user.adminProfile?.name || 'User',
    },
  };
}

export async function refreshTokens(refreshToken: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    throw Object.assign(new Error('Invalid refresh token'), { code: 'UNAUTHORIZED', statusCode: 401 });
  }

  const payload = verifyRefreshToken(refreshToken);
  const newAccessToken = signAccessToken({ userId: payload.userId, role: payload.role, mobile: payload.mobile });
  const newRefreshToken = signRefreshToken({ userId: payload.userId, role: payload.role, mobile: payload.mobile });

  // Rotate: delete old, create new
  await prisma.refreshToken.delete({ where: { token: refreshToken } });
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: payload.userId,
      expiresAt: getRefreshExpiryDate(),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
}

export async function sendOTP(mobile: string) {
  // In demo mode, just return success (OTP is always DEMO_OTP)
  const user = await prisma.user.findUnique({ where: { mobile } });
  if (!user) {
    throw Object.assign(new Error('User not found'), { code: 'NOT_FOUND', statusCode: 404 });
  }

  const otp = process.env.DEMO_OTP || '123456';
  const otpHash = await hashOTP(otp);
  const otpExpiry = getOTPExpiry();

  await prisma.user.update({
    where: { mobile },
    data: { otpHash, otpExpiry },
  });

  return { message: 'DEMO MODE: OTP is 123456', demoOTP: otp };
}
