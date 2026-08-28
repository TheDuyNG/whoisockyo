import type { CookieOptions, Request, Response } from 'express';
import type { ChangePasswordInput, LoginInput } from '@whoisockyo/shared';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '../../config/constants.js';
import { env, isProduction } from '../../config/env.js';
import { sendSuccess } from '../../utils/api-response.js';
import { AppError } from '../../utils/app-error.js';
import { durationToMilliseconds } from '../../utils/duration.js';
import { ERROR_CODES } from '../../config/constants.js';
import { getValidatedBody } from '../../utils/validated-request.js';
import { authService } from './auth.service.js';

function getCookie(request: Request, cookieName: string): string | undefined {
  const cookies = request.cookies as Record<string, unknown>;
  const cookieValue = cookies[cookieName];

  return typeof cookieValue === 'string' ? cookieValue : undefined;
}

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
  };
}

function setAuthenticationCookies(
  response: Response,
  tokens: { accessToken: string; refreshToken: string },
): void {
  response.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseCookieOptions(),
    maxAge: durationToMilliseconds(env.JWT_ACCESS_EXPIRES_IN),
    path: '/',
  });
  response.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseCookieOptions(),
    maxAge: durationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN),
    path: '/api/auth',
  });
}

function clearAuthenticationCookies(response: Response): void {
  response.clearCookie(ACCESS_TOKEN_COOKIE, { ...baseCookieOptions(), path: '/' });
  response.clearCookie(REFRESH_TOKEN_COOKIE, { ...baseCookieOptions(), path: '/api/auth' });
}

export const authController = {
  async login(request: Request, response: Response): Promise<void> {
    const result = await authService.login(getValidatedBody<LoginInput>(request));
    setAuthenticationCookies(response, result.tokens);
    sendSuccess(response, 200, result.admin, 'Signed in successfully.');
  },

  async refresh(request: Request, response: Response): Promise<void> {
    const refreshToken = getCookie(request, REFRESH_TOKEN_COOKIE);

    if (!refreshToken) {
      throw new AppError(401, ERROR_CODES.unauthorized, 'A refresh token is required.');
    }

    const result = await authService.refresh(refreshToken);
    setAuthenticationCookies(response, result.tokens);
    sendSuccess(response, 200, result.admin, 'Session refreshed successfully.');
  },

  async session(request: Request, response: Response): Promise<void> {
    const admin = await authService.getSession(request.adminUserId!);
    sendSuccess(response, 200, admin, 'Session retrieved successfully.');
  },

  async logout(request: Request, response: Response): Promise<void> {
    await authService.logout(getCookie(request, REFRESH_TOKEN_COOKIE));
    clearAuthenticationCookies(response);
    sendSuccess(response, 200, null, 'Signed out successfully.');
  },

  async changePassword(request: Request, response: Response): Promise<void> {
    const result = await authService.changePassword(
      request.adminUserId!,
      getValidatedBody<ChangePasswordInput>(request),
    );
    setAuthenticationCookies(response, result.tokens);
    sendSuccess(response, 200, result.admin, 'Password changed successfully.');
  },
};
