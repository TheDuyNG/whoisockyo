import { z } from 'zod';

import { displayOrderSchema } from './common.js';

export const skillCategorySchema = z.enum([
  'LANGUAGE',
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'DEVOPS',
  'TOOL',
]);

export const skillInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: skillCategorySchema,
  proficiency: z.coerce.number().int().min(1).max(100).nullable(),
  icon: z.string().trim().max(80).nullable(),
  displayOrder: displayOrderSchema,
});

export type SkillInput = z.infer<typeof skillInputSchema>;

export interface Skill extends SkillInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
