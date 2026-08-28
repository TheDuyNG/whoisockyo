import type { RequestHandler } from 'express';

import { ACCESS_TOKEN_COOKIE, ERROR_CODES } from '../config/constants.js';
import { authService } from '../modules/auth/auth.service.js';
import { AppError } from '../utils/app-error.js';

export const authenticate: RequestHandler = (request, _response, next) => {
  const cookies = request.cookies as Record<string, unknown>;
  const accessToken = cookies[ACCESS_TOKEN_COOKIE];

  if (typeof accessToken !== 'string') {
    next(new AppError(401, ERROR_CODES.unauthorized, 'Authentication is required.'));
    return;
  }

  try {
    request.adminUserId = authService.verifyAccessToken(accessToken);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
