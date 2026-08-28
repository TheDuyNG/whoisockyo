import type { SocialLinkInput } from '@whoisockyo/shared';

import { prisma } from '../../lib/prisma.js';

export const socialLinkRepository = {
  findVisible() {
    return prisma.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { displayOrder: 'asc' },
    });
  },

  findAll() {
    return prisma.socialLink.findMany({ orderBy: { displayOrder: 'asc' } });
  },

  findById(id: string) {
    return prisma.socialLink.findUnique({ where: { id } });
  },

  create(input: SocialLinkInput) {
    return prisma.socialLink.create({ data: input });
  },

  update(id: string, input: SocialLinkInput) {
    return prisma.socialLink.update({ where: { id }, data: input });
  },

  delete(id: string) {
    return prisma.socialLink.delete({ where: { id } });
  },
};
