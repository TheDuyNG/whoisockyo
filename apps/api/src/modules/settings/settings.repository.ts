import type { SiteSettingsInput } from '@whoisockyo/shared';

import { PRIMARY_RECORD_KEY } from '../../config/constants.js';
import { prisma } from '../../lib/prisma.js';

const settingsSelect = {
  id: true,
  siteTitle: true,
  siteDescription: true,
  seoTitle: true,
  seoDescription: true,
  isContactFormEnabled: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const settingsRepository = {
  find() {
    return prisma.siteSettings.findUnique({
      where: { key: PRIMARY_RECORD_KEY },
      select: settingsSelect,
    });
  },

  upsert(input: SiteSettingsInput) {
    return prisma.siteSettings.upsert({
      where: { key: PRIMARY_RECORD_KEY },
      update: input,
      create: { ...input, key: PRIMARY_RECORD_KEY },
      select: settingsSelect,
    });
  },
};
