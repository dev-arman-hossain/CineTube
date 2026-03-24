import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middlewares/auth.middleware';
import requireRole from '../../middlewares/role.middleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/', auth, requireRole(Role.USER, Role.ADMIN), NotificationController.getUserNotifications);
router.patch('/mark-all-read', auth, requireRole(Role.USER, Role.ADMIN), NotificationController.markAllAsRead);
router.patch('/:id/read', auth, requireRole(Role.USER, Role.ADMIN), NotificationController.markAsRead);

export const NotificationRoutes = router;
