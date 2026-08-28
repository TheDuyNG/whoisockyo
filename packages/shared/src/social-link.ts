import { z } from 'zod';

import { displayOrderSchema } from './common.js';

export const socialLinkInputSchema = z.object({
  platform: z.string().trim().min(1).max(80),
  url: z.string().trim().url().max(2_048),
  icon: z.string().trim().max(80).nullable(),
  displayOrder: displayOrderSchema,
  isVisible: z.boolean().default(true),
});

export type SocialLinkInput = z.infer<typeof socialLinkInputSchema>;

export interface SocialLink extends SocialLinkInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
