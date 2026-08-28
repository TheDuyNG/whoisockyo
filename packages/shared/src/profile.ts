import { z } from 'zod';

import { nullableUrlSchema } from './common.js';

export const availabilityStatusSchema = z.enum(['AVAILABLE', 'LIMITED', 'UNAVAILABLE']);

export const profileInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  headline: z.string().trim().min(2).max(160),
  shortBio: z.string().trim().min(2).max(280),
  bio: z.string().trim().min(2).max(5_000),
  philosophy: z.string().trim().max(1_000).default(''),
  currentFocus: z.string().trim().max(1_000).default(''),
  location: z.string().trim().max(120),
  email: z.string().trim().email().max(254),
  avatarUrl: nullableUrlSchema,
  resumeUrl: nullableUrlSchema,
  availabilityStatus: availabilityStatusSchema,
});

export type ProfileInput = z.infer<typeof profileInputSchema>;

export interface Profile extends ProfileInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
