import { z } from 'zod';

export const identifierSchema = z.string().cuid('A valid identifier is required.');

export const idParamSchema = z.object({
  id: identifierSchema,
});

export const slugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL-friendly slug.'),
});

export const nullableUrlSchema = z
  .union([z.string().trim().url('Enter a valid URL.'), z.literal(''), z.null()])
  .transform((value) => (value === '' ? null : value));

export const optionalUrlSchema = z
  .union([z.string().trim().url('Enter a valid URL.'), z.literal('')])
  .optional()
  .transform((value) => (value === '' ? undefined : value));

export const displayOrderSchema = z.coerce.number().int().min(0).max(10_000).default(0);

export const dateStringSchema = z.string().datetime();

export const pageQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
