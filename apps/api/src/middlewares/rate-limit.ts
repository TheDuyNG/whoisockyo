import { rateLimit } from 'express-rate-limit';
import type { Request, Response } from 'express';

import { ERROR_CODES } from '../config/constants.js';

function rateLimitHandler(_request: Request, response: Response): void {
  response.status(429).json({
    success: false,
    error: {
      code: ERROR_CODES.rateLimit,
      message: 'Too many requests. Please try again later.',
    },
  });
}

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 500,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: rateLimitHandler,
});

export const contactRateLimit = rateLimit({
  windowMs: 60 * 60 * 1_000,
  limit: 8,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler,
});
