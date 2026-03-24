import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const getUserNotifications = async (userId: string) => {
  const notifications = await (prisma as any).notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return notifications;
};

const markAsRead = async (userId: string, notificationId: string) => {
  const notification = await (prisma as any).notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification || notification.userId !== userId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  const result = await (prisma as any).notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return result;
};

const markAllAsRead = async (userId: string) => {
  const result = await (prisma as any).notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return result;
};

export const NotificationService = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
