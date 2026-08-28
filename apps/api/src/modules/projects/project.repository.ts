import type { Prisma } from '@prisma/client';
import type { ProjectInput, ProjectUpdate } from '@whoisockyo/shared';

import { prisma } from '../../lib/prisma.js';

const projectOrder: Prisma.ProjectOrderByWithRelationInput[] = [
  { displayOrder: 'asc' },
  { createdAt: 'desc' },
];

export const projectRepository = {
  findPublished() {
    return prisma.project.findMany({ where: { published: true }, orderBy: projectOrder });
  },

  findAll() {
    return prisma.project.findMany({ orderBy: projectOrder });
  },

  findPublishedBySlug(slug: string) {
    return prisma.project.findFirst({ where: { slug, published: true } });
  },

  findById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  },

  findBySlug(slug: string) {
    return prisma.project.findUnique({ where: { slug } });
  },

  create(input: ProjectInput) {
    return prisma.project.create({ data: input });
  },

  update(id: string, input: ProjectUpdate) {
    return prisma.project.update({ where: { id }, data: input });
  },

  delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },
};
