import { createHash, timingSafeEqual } from 'node:crypto';

import type { AuthenticatedAdmin, ChangePasswordInput, LoginInput } from '@whoisockyo/shared';
import { compare, hash, hashSync } from 'bcryptjs';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

import { ERROR_CODES } from '../../config/constants.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/app-error.js';
import { authRepository } from './auth.repository.js';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AdminTokenPayload extends JwtPayload {
  sub: string;
  tokenType: 'access' | 'refresh';
}

// Comparing against a valid dummy hash keeps unknown-email timing close to a normal login attempt.
const invalidPasswordHash = hashSync('invalid-password-placeholder', 12);

function hashRefreshToken(refreshToken: string): string {
  return createHash('sha256').update(refreshToken).digest('hex');
}

function tokenHashesMatch(firstHash: string, secondHash: string): boolean {
  const firstBuffer = Buffer.from(firstHash, 'hex');
  const secondBuffer = Buffer.from(secondHash, 'hex');

  return firstBuffer.length === secondBuffer.length && timingSafeEqual(firstBuffer, secondBuffer);
}

function signToken(
  adminUserId: string,
  tokenType: 'access' | 'refresh',
  secret: string,
  expiresIn: string,
): string {
  return jwt.sign({ tokenType }, secret, {
    subject: adminUserId,
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
}

function createTokenPair(adminUserId: string): TokenPair {
  return {
    accessToken: signToken(adminUserId, 'access', env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES_IN),
    refreshToken: signToken(
      adminUserId,
      'refresh',
      env.JWT_REFRESH_SECRET,
      env.JWT_REFRESH_EXPIRES_IN,
    ),
  };
}

function verifyToken(
  token: string,
  secret: string,
  expectedTokenType: AdminTokenPayload['tokenType'],
): AdminTokenPayload {
  try {
    const decodedToken = jwt.verify(token, secret);

    if (
      typeof decodedToken === 'string' ||
      !decodedToken.sub ||
      decodedToken.tokenType !== expectedTokenType
    ) {
      throw new AppError(401, ERROR_CODES.unauthorized, 'Authentication is required.');
    }

    return decodedToken as AdminTokenPayload;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      401,
      error instanceof jwt.TokenExpiredError ? ERROR_CODES.tokenExpired : ERROR_CODES.unauthorized,
      'Your session is invalid or has expired.',
    );
  }
}

function toAuthenticatedAdmin(adminUser: { id: string; email: string }): AuthenticatedAdmin {
  return { id: adminUser.id, email: adminUser.email };
}

export const authService = {
  async login(input: LoginInput): Promise<{ admin: AuthenticatedAdmin; tokens: TokenPair }> {
    const normalizedEmail = input.email.toLowerCase();
    const adminUser = await authRepository.findByEmail(normalizedEmail);
    const passwordMatches = await compare(
      input.password,
      adminUser?.passwordHash ?? invalidPasswordHash,
    );

    if (!adminUser || !passwordMatches) {
      throw new AppError(401, ERROR_CODES.invalidCredentials, 'Email or password is incorrect.');
    }

    const tokens = createTokenPair(adminUser.id);
    await authRepository.recordLogin(adminUser.id, hashRefreshToken(tokens.refreshToken));

    return { admin: toAuthenticatedAdmin(adminUser), tokens };
  },

  verifyAccessToken(accessToken: string): string {
    return verifyToken(accessToken, env.JWT_ACCESS_SECRET, 'access').sub;
  },

  async refresh(refreshToken: string): Promise<{ admin: AuthenticatedAdmin; tokens: TokenPair }> {
    const tokenPayload = verifyToken(refreshToken, env.JWT_REFRESH_SECRET, 'refresh');
    const adminUser = await authRepository.findById(tokenPayload.sub);

    if (
      !adminUser?.refreshTokenHash ||
      !tokenHashesMatch(adminUser.refreshTokenHash, hashRefreshToken(refreshToken))
    ) {
      throw new AppError(401, ERROR_CODES.unauthorized, 'Your session is no longer valid.');
    }

    const tokens = createTokenPair(adminUser.id);
    await authRepository.updateRefreshToken(adminUser.id, hashRefreshToken(tokens.refreshToken));

    return { admin: toAuthenticatedAdmin(adminUser), tokens };
  },

  async getSession(adminUserId: string): Promise<AuthenticatedAdmin> {
    const adminUser = await authRepository.findById(adminUserId);

    if (!adminUser) {
      throw new AppError(401, ERROR_CODES.unauthorized, 'Authentication is required.');
    }

    return toAuthenticatedAdmin(adminUser);
  },

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      const tokenPayload = verifyToken(refreshToken, env.JWT_REFRESH_SECRET, 'refresh');
      const adminUser = await authRepository.findById(tokenPayload.sub);

      if (
        adminUser?.refreshTokenHash &&
        tokenHashesMatch(adminUser.refreshTokenHash, hashRefreshToken(refreshToken))
      ) {
        await authRepository.updateRefreshToken(adminUser.id, null);
      }
    } catch {
      // Cookies are still cleared when an expired or malformed token is supplied.
    }
  },

  async changePassword(
    adminUserId: string,
    input: ChangePasswordInput,
  ): Promise<{ admin: AuthenticatedAdmin; tokens: TokenPair }> {
    const adminUser = await authRepository.findById(adminUserId);

    if (!adminUser || !(await compare(input.currentPassword, adminUser.passwordHash))) {
      throw new AppError(401, ERROR_CODES.invalidCredentials, 'Current password is incorrect.');
    }

    const passwordHash = await hash(input.newPassword, 12);
    const tokens = createTokenPair(adminUser.id);

    await authRepository.updatePassword(
      adminUser.id,
      passwordHash,
      hashRefreshToken(tokens.refreshToken),
    );

    return { admin: toAuthenticatedAdmin(adminUser), tokens };
  },
};
