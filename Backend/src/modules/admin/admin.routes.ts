import { Router } from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth.middleware';
import requireRole from '../../middlewares/role.middleware';

const router = Router();

// All routes here are admin only
router.use(auth, requireRole('ADMIN'));

router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.patch('/users/:id/suspend', AdminController.suspendUser);
router.delete('/users/:id', AdminController.deleteUser);
router.get('/stats', AdminController.getStats);

export const AdminRoutes = router;
