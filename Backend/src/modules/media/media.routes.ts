import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { MediaController } from './media.controller';
import { MediaValidation } from './media.validation';
import auth from '../../middlewares/auth.middleware';
import requireRole from '../../middlewares/role.middleware';
import { upload } from '../../utils/cloudinary';

const router = Router();

// Public routes
router.get('/', MediaController.getAllMedia);
router.get('/featured', MediaController.getFeaturedMedia);
router.get('/:id', MediaController.getMediaById);

router.post(
  '/upload',
  auth,
  requireRole('ADMIN'),
  upload.single('image'),
  MediaController.uploadMedia,
);

// Admin routes
router.post(
  '/',
  auth,
  requireRole('ADMIN'),
  validateRequest(MediaValidation.createMediaValidationSchema),
  MediaController.createMedia,
);

router.put(
  '/:id',
  auth,
  requireRole('ADMIN'),
  validateRequest(MediaValidation.updateMediaValidationSchema),
  MediaController.updateMedia,
);

router.delete(
  '/:id',
  auth,
  requireRole('ADMIN'),
  MediaController.deleteMedia,
);

export const MediaRoutes = router;
