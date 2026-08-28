import type { ExperienceInput } from '@whoisockyo/shared';

import { prisma } from '../../lib/prisma.js';

const experienceOrder = [{ displayOrder: 'asc' as const }, { startDate: 'desc' as const }];

export const experienceRepository = {
  findAll() {
    return prisma.experience.findMany({ orderBy: experienceOrder });
  },

  findById(id: string) {
    return prisma.experience.findUnique({ where: { id } });
  },

  create(input: ExperienceInput) {
    return prisma.experience.create({ data: input });
  },

  update(id: string, input: ExperienceInput) {
    return prisma.experience.update({ where: { id }, data: input });
  },

  delete(id: string) {
    return prisma.experience.delete({ where: { id } });
  },
};
