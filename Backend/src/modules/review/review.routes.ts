import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';
import auth from '../../middlewares/auth.middleware';
import requireRole from '../../middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/', ReviewController.getAllReviews);

// Protected user routes
router.get('/my', auth, ReviewController.getMyReviews);

router.post(
  '/',
  auth,
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview,
);

router.put(
  '/:id',
  auth,
  validateRequest(ReviewValidation.updateReviewValidationSchema),
  ReviewController.updateReview,
);

router.delete('/:id', auth, ReviewController.deleteReview);

router.post('/:id/like', auth, ReviewController.toggleLike);

// Admin routes
router.patch(
  '/:id/approve',
  auth,
  requireRole('ADMIN'),
  ReviewController.approveReview,
);

router.patch(
  '/:id/unpublish',
  auth,
  requireRole('ADMIN'),
  ReviewController.unpublishReview,
);

export const ReviewRoutes = router;
