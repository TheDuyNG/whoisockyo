import type { Request } from 'express';

/** Returns a request body after the route's validation middleware has parsed it. */
export function getValidatedBody<T>(request: Request): T {
  return request.body as T;
}
