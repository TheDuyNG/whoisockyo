import { prisma } from '../../lib/prisma.js';

export const dashboardRepository = {
  async getMetrics() {
    const [
      totalProjects,
      featuredProjects,
      publishedProjects,
      totalSkills,
      experienceEntries,
      unreadMessages,
    ] = await prisma.$transaction([
      prisma.project.count(),
      prisma.project.count({ where: { featured: true } }),
      prisma.project.count({ where: { published: true } }),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    return {
      totalProjects,
      featuredProjects,
      publishedProjects,
      totalSkills,
      experienceEntries,
      unreadMessages,
    };
  },
};
