import type { ContactMessageInput, ContactMessageQuery } from '@whoisockyo/shared';

import { prisma } from '../../lib/prisma.js';

function statusFilter(status: ContactMessageQuery['status']): { isRead?: boolean } {
  if (status === 'read') {
    return { isRead: true };
  }

  if (status === 'unread') {
    return { isRead: false };
  }

  return {};
}

export const contactMessageRepository = {
  create(input: ContactMessageInput) {
    return prisma.contactMessage.create({ data: input });
  },

  async findMany(query: ContactMessageQuery) {
    const where = statusFilter(query.status);
    const skip = (query.page - 1) * query.pageSize;
    const [items, totalItems] = await prisma.$transaction([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.pageSize,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return { items, totalItems };
  },

  findById(id: string) {
    return prisma.contactMessage.findUnique({ where: { id } });
  },

  updateStatus(id: string, isRead: boolean) {
    return prisma.contactMessage.update({ where: { id }, data: { isRead } });
  },

  delete(id: string) {
    return prisma.contactMessage.delete({ where: { id } });
  },
};
