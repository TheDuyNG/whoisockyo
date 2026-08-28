import type { ProfileInput } from '@whoisockyo/shared';

import { PRIMARY_RECORD_KEY } from '../../config/constants.js';
import { prisma } from '../../lib/prisma.js';

const profileSelect = {
  id: true,
  name: true,
  headline: true,
  shortBio: true,
  bio: true,
  philosophy: true,
  currentFocus: true,
  location: true,
  email: true,
  avatarUrl: true,
  resumeUrl: true,
  availabilityStatus: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const profileRepository = {
  find() {
    return prisma.profile.findUnique({
      where: { key: PRIMARY_RECORD_KEY },
      select: profileSelect,
    });
  },

  upsert(input: ProfileInput) {
    return prisma.profile.upsert({
      where: { key: PRIMARY_RECORD_KEY },
      update: input,
      create: { ...input, key: PRIMARY_RECORD_KEY },
      select: profileSelect,
    });
  },
};
