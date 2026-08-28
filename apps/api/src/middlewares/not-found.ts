import type { RequestHandler } from 'express';

import { ERROR_CODES } from '../config/constants.js';

export const notFoundHandler: RequestHandler = (request, response) => {
  response.status(404).json({
    success: false,
    error: {
      code: ERROR_CODES.notFound,
      message: `No route matches ${request.method} ${request.path}.`,
    },
  });
};
