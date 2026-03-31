import { Role } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { getSystemSettings, updateSystemSettings, SystemSettings } from '../../utils/settingsHelper';

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
      sessions: {
        orderBy: { loginTime: 'desc' },
        take: 1,
      },
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

const clearCache = async () => {
  // Functional placeholder for clearing server-side cache (e.g., Redis, in-memory)
  // For now, it logs the action and returns success.
  console.log('Admin Action: System cache cleared');
  return { success: true, timestamp: new Date() };
};

const getSettings = async () => {
  return getSystemSettings();
};

const updateSettings = async (data: Partial<SystemSettings>) => {
  return updateSystemSettings(data);
};

export const AdminService = {
  getAllUsers,
  updateUserRole,
  getStats,
  suspendUser,
  deleteUser,
  clearCache,
  getSettings,
  updateSettings,
};
