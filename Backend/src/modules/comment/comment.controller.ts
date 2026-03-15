import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { CommentService } from './comment.service';

const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await CommentService.createComment((req as any).user.id, req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Comment added successfully',
    data: result,
  });
});

const getCommentsByReviewId = catchAsync(async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const result = await CommentService.getCommentsByReviewId(reviewId as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId, role } = (req as any).user;
  const result = await CommentService.deleteComment(id as string, userId, role);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
  getCommentsByReviewId,
  deleteComment,
};
