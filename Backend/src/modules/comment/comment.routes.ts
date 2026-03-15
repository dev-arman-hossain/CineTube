import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';
import auth from '../../middlewares/auth.middleware';

const router = Router();

router.get('/review/:reviewId', CommentController.getCommentsByReviewId);

router.post(
  '/',
  auth,
  validateRequest(CommentValidation.createCommentValidationSchema),
  CommentController.createComment,
);

router.delete('/:id', auth, CommentController.deleteComment);

export const CommentRoutes = router;
