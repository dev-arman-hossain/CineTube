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
      isSuspended: true,
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
  const [userCount, mediaCount, reviewCount, pendingReviews, avgRatingData] = await Promise.all([
    prisma.user.count(),
    prisma.media.count(),
    prisma.review.count({ where: { status: 'PUBLISHED' } }),
    prisma.review.count({ where: { status: 'PENDING' } }),
    prisma.media.aggregate({
      _avg: {
        avgRating: true,
      },
    }),
  ]);

  return {
    userCount,
    mediaCount,
    reviewCount,
    pendingReviews,
    avgRating: avgRatingData._avg.avgRating || 0,
  };
};

const suspendUser = async (userId: string, isSuspended: boolean) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { isSuspended },
  });
  return result;
};

const deleteUser = async (userId: string) => {
  const result = await prisma.user.delete({
    where: { id: userId },
  });
  return result;
};

export const AdminService = {
  getAllUsers,
  updateUserRole,
  getStats,
  suspendUser,
  deleteUser,
};
