import type { Request, RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';

interface RequestSchemas {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, _response, next) => {
    if (schemas.body) {
      const parsedBody: unknown = schemas.body.parse(request.body as unknown);
      request.body = parsedBody;
    }

    if (schemas.params) {
      const parsedParams: unknown = schemas.params.parse(request.params);
      request.params = parsedParams as Request['params'];
    }

    if (schemas.query) {
      const parsedQuery: unknown = schemas.query.parse(request.query);
      request.query = parsedQuery as Request['query'];
    }

    next();
  };
}
