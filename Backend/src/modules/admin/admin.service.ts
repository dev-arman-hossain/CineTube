import { Role } from '@prisma/client';
import { prisma } from '../../lib/prisma';

const getAllUsers = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const updateUserRole = async (userId: string, role: Role) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  return result;
};

const getStats = async () => {
  const [userCount, mediaCount, reviewCount, pendingReviews] = await Promise.all([
    prisma.user.count(),
    prisma.media.count(),
    prisma.review.count({ where: { status: 'PUBLISHED' } }),
    prisma.review.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    userCount,
    mediaCount,
    reviewCount,
    pendingReviews,
  };
};

export const AdminService = {
  getAllUsers,
  updateUserRole,
  getStats,
};
