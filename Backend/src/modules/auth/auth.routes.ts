import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.register,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login,
);

router.get('/me', auth, AuthController.getMe);
router.patch(
  '/profile',
  auth,
  validateRequest(AuthValidation.updateProfileValidationSchema),
  AuthController.updateProfile,
);

export const AuthRoutes = router;
