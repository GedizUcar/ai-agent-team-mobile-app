import crypto from 'crypto';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sha256 } from '../utils/hash';
import {
  AppError,
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from '../utils/errors';
import { ErrorCode } from '../types/api';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../validators/auth';

const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
}

function toUserResponse(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
}): UserResponse {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

export async function register(
  input: RegisterInput,
  userAgent?: string,
  ipAddress?: string,
): Promise<{ user: UserResponse; tokens: AuthTokens }> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError('A user with this email already exists');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    },
  });

  const tokens = await createSession(user.id, user.email, user.role, userAgent, ipAddress);

  return { user: toUserResponse(user), tokens };
}

export async function login(
  input: LoginInput,
  userAgent?: string,
  ipAddress?: string,
): Promise<{ user: UserResponse; tokens: AuthTokens }> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || user.deletedAt) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // Check account lockout
  if (user.lockUntil && user.lockUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
    throw new AppError(
      `Account is locked. Try again in ${minutesLeft} minutes`,
      429,
      ErrorCode.RATE_LIMIT_EXCEEDED,
    );
  }

  const isPasswordValid = await comparePassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    const failedAttempts = user.failedLoginAttempts + 1;
    const updateData: { failedLoginAttempts: number; lockUntil?: Date } = {
      failedLoginAttempts: failedAttempts,
    };

    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      updateData.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
    }

    await prisma.user.update({ where: { id: user.id }, data: updateData });
    throw new UnauthorizedError('Invalid email or password');
  }

  // Reset failed attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockUntil: null, lastLoginAt: new Date() },
  });

  const tokens = await createSession(user.id, user.email, user.role, userAgent, ipAddress);

  return { user: toUserResponse(user), tokens };
}

export async function logout(refreshToken: string): Promise<void> {
  const tokenHash = sha256(refreshToken);
  const deleted = await prisma.session.deleteMany({ where: { refreshToken: tokenHash } });
  if (deleted.count === 0) {
    throw new UnauthorizedError('Invalid session');
  }
}

export async function refresh(
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<AuthTokens> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const tokenHash = sha256(refreshToken);
  const session = await prisma.session.findFirst({
    where: { refreshToken: tokenHash, userId: payload.userId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    throw new UnauthorizedError('Session expired');
  }

  const user = session.user;
  if (!user.isActive || user.deletedAt) {
    await prisma.session.delete({ where: { id: session.id } });
    throw new UnauthorizedError('Account is deactivated');
  }

  // Delete old session
  await prisma.session.delete({ where: { id: session.id } });

  // Create new session (token rotation)
  return createSession(user.id, user.email, user.role, userAgent, ipAddress);
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user || user.deletedAt || !user.isActive) {
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = sha256(resetToken);
  const resetTokenExp = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: resetTokenHash, resetTokenExp },
  });

  // TODO: Send reset email with token (plain token goes in email link)
  if (env.NODE_ENV === 'development') {
    logger.info(`[DEV] Password reset token for ${email}: ${resetToken}`);
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const tokenHash = sha256(token);
  const user = await prisma.user.findFirst({
    where: {
      resetToken: tokenHash,
      resetTokenExp: { gt: new Date() },
    },
  });

  if (!user) {
    throw new BadRequestError('Invalid or expired reset token');
  }

  const passwordHash = await hashPassword(newPassword);

  // Update password, clear reset token, invalidate all sessions
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExp: null,
        failedLoginAttempts: 0,
        lockUntil: null,
      },
    }),
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ]);
}

export async function getMe(userId: string): Promise<UserResponse> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.deletedAt) {
    throw new NotFoundError('User not found');
  }

  return toUserResponse(user);
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<UserResponse> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.deletedAt) {
    throw new NotFoundError('User not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
      ...(input.phone !== undefined && { phone: input.phone }),
    },
  });

  return toUserResponse(updated);
}

// --- Helpers ---

async function createSession(
  userId: string,
  email: string,
  role: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<AuthTokens> {
  const accessToken = generateAccessToken({ userId, email, role });
  const refreshTokenStr = generateRefreshToken(userId);
  const refreshTokenHash = sha256(refreshTokenStr);

  const refreshExpiryMs = parseExpiry(env.JWT_REFRESH_EXPIRATION);

  await prisma.session.create({
    data: {
      userId,
      refreshToken: refreshTokenHash,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt: new Date(Date.now() + refreshExpiryMs),
    },
  });

  return { accessToken, refreshToken: refreshTokenStr };
}

function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 14 * 24 * 60 * 60 * 1000; // default 14 days

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 14 * 24 * 60 * 60 * 1000;
  }
}
