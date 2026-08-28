import type { SkillInput } from '@whoisockyo/shared';

import { prisma } from '../../lib/prisma.js';

const skillOrder = [{ category: 'asc' as const }, { displayOrder: 'asc' as const }];

export const skillRepository = {
  findAll() {
    return prisma.skill.findMany({ orderBy: skillOrder });
  },

  findById(id: string) {
    return prisma.skill.findUnique({ where: { id } });
  },

  create(input: SkillInput) {
    return prisma.skill.create({ data: input });
  },

  update(id: string, input: SkillInput) {
    return prisma.skill.update({ where: { id }, data: input });
  },

  delete(id: string) {
    return prisma.skill.delete({ where: { id } });
  },
};
