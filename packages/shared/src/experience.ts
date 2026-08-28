import { z } from 'zod';

import { displayOrderSchema, nullableUrlSchema } from './common.js';

export const experienceInputSchema = z
  .object({
    company: z.string().trim().min(2).max(120),
    companyUrl: nullableUrlSchema,
    position: z.string().trim().min(2).max(120),
    location: z.string().trim().max(120).default(''),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    isCurrent: z.boolean().default(false),
    description: z.string().trim().min(10).max(5_000),
    technologies: z.array(z.string().trim().min(1).max(50)).max(30).default([]),
    displayOrder: displayOrderSchema,
  })
  .superRefine((values, context) => {
    if (values.isCurrent && values.endDate !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A current role cannot have an end date.',
        path: ['endDate'],
      });
    }

    if (values.endDate && values.endDate < values.startDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after the start date.',
        path: ['endDate'],
      });
    }
  });

export type ExperienceInput = z.infer<typeof experienceInputSchema>;

export interface Experience extends Omit<ExperienceInput, 'startDate' | 'endDate'> {
  id: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}
