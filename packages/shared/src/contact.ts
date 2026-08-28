import { z } from 'zod';

import { pageQuerySchema } from './common.js';

export const contactMessageInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5_000),
});

export const contactMessageQuerySchema = pageQuerySchema.extend({
  status: z.enum(['all', 'read', 'unread']).default('all'),
});

export const contactMessageStatusSchema = z.object({
  isRead: z.boolean(),
});

export type ContactMessageInput = z.infer<typeof contactMessageInputSchema>;
export type ContactMessageQuery = z.infer<typeof contactMessageQuerySchema>;

export interface ContactMessage extends ContactMessageInput {
  id: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
