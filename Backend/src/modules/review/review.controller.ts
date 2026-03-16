import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview((req as any).user.id, req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviews(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getMyReviews((req as any).user.id);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Your reviews retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.updateReview(id as string, (req as any).user.id, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId, role } = (req as any).user;
  const result = await ReviewService.deleteReview(id as string, userId, role);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

const approveReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.approveReview(id as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Review approved and published',
    data: result,
  });
});

const unpublishReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.unpublishReview(id as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Review unpublished',
    data: result,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.toggleLike((req as any).user.id, id as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: result.liked ? 'Review liked' : 'Review unliked',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  approveReview,
  unpublishReview,
  toggleLike,
};
