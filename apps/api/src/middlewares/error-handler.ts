import { Prisma } from '@prisma/client';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { ERROR_CODES } from '../config/constants.js';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { AppError } from '../utils/app-error.js';

export const errorHandler: ErrorRequestHandler = (error: unknown, request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(422).json({
      success: false,
      error: {
        code: ERROR_CODES.validation,
        message: 'The request contains invalid data.',
        details: error.flatten(),
      },
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    response.status(409).json({
      success: false,
      error: {
        code: ERROR_CODES.conflict,
        message: 'A record with the same unique value already exists.',
      },
    });
    return;
  }

  logger.error(
    {
      error,
      method: request.method,
      path: request.path,
    },
    'Unhandled request error',
  );

  response.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.internal,
      message:
        env.NODE_ENV === 'production'
          ? 'An unexpected error occurred.'
          : error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
    },
  });
};
