import { prisma } from '../../lib/prisma.js';

export const authRepository = {
  findByEmail(email: string) {
    return prisma.adminUser.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.adminUser.findUnique({ where: { id } });
  },

  updateRefreshToken(id: string, refreshTokenHash: string | null) {
    return prisma.adminUser.update({
      where: { id },
      data: { refreshTokenHash },
    });
  },

  recordLogin(id: string, refreshTokenHash: string) {
    return prisma.adminUser.update({
      where: { id },
      data: { refreshTokenHash, lastLoginAt: new Date() },
    });
  },

  updatePassword(id: string, passwordHash: string, refreshTokenHash: string) {
    return prisma.adminUser.update({
      where: { id },
      data: { passwordHash, refreshTokenHash },
    });
  },
};
