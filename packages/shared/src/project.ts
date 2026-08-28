import { z } from 'zod';

import { displayOrderSchema, nullableUrlSchema } from './common.js';

export const projectStatusSchema = z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']);

export const projectInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase URL-friendly slug.'),
  shortDescription: z.string().trim().min(10).max(280),
  description: z.string().trim().min(10).max(20_000),
  thumbnailUrl: nullableUrlSchema,
  repositoryUrl: nullableUrlSchema,
  liveUrl: nullableUrlSchema,
  technologies: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
  status: projectStatusSchema,
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  displayOrder: displayOrderSchema,
});

export const projectUpdateSchema = projectInputSchema.partial();

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export interface Project extends ProjectInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
