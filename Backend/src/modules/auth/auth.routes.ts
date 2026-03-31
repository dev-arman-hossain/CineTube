import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth.middleware';
import { upload } from '../../utils/cloudinary';

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

router.post(
  '/google',
  AuthController.googleLogin,
);

router.get('/me', auth, AuthController.getMe);
router.patch(
  '/profile',
  auth,
  validateRequest(AuthValidation.updateProfileValidationSchema),
  AuthController.updateProfile,
);

// Avatar upload – available to any authenticated user (not admin-only)
router.post('/avatar', auth, upload.single('image'), AuthController.uploadAvatar);

router.post(
  '/forgot-password',
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

router.patch('/welcome-seen', auth, AuthController.markWelcomeSeen);

export const AuthRoutes = router;
