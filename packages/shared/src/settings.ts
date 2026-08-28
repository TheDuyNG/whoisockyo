import { z } from 'zod';

export const siteSettingsInputSchema = z.object({
  siteTitle: z.string().trim().min(2).max(120),
  siteDescription: z.string().trim().min(10).max(320),
  seoTitle: z.string().trim().min(2).max(70),
  seoDescription: z.string().trim().min(10).max(170),
  isContactFormEnabled: z.boolean(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsInputSchema>;

export interface SiteSettings extends SiteSettingsInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
