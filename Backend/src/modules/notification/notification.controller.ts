import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { NotificationService } from './notification.service';

const getUserNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await NotificationService.getUserNotifications(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Notifications retrieved successfully',
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const notificationId = req.params.id as string;
  const result = await NotificationService.markAsRead(userId, notificationId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Notification marked as read successfully',
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await NotificationService.markAllAsRead(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'All notifications marked as read successfully',
    data: result,
  });
});

export const NotificationController = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
