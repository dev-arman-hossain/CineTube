import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createComment = async (userId: string, payload: any) => {
  const result = await prisma.comment.create({
    data: {
      ...payload,
      userId,
    },
    include: {
      user: { select: { name: true } },
    },
  });

  // Notify the commenter
  await (prisma as any).notification.create({
    data: {
      userId,
      title: '💬 Comment Posted',
      message: 'Your comment has been posted successfully.',
    },
  });

  // If it's a reply, notify the author of the parent comment
  if (payload.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: payload.parentId },
      select: { userId: true },
    });

    if (parentComment && parentComment.userId !== userId) {
      await (prisma as any).notification.create({
        data: {
          userId: parentComment.userId,
          title: '↩️ New Reply',
          message: `${result.user.name} replied to your comment.`,
        },
      });
    }
  }

  return result;
};

const getCommentsByReviewId = async (reviewId: string) => {
  // Simple retrieval. For truly nested replies, frontend or backend needs to organize them.
  // We'll fetch all comments for the review and include basic user info.
  const result = await prisma.comment.findMany({
    where: { reviewId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const deleteComment = async (id: string, userId: string, role: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.userId !== userId && role !== 'ADMIN') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not authorized to delete this comment',
    );
  }

  const result = await prisma.comment.delete({
    where: { id },
  });
  return result;
};

export const CommentService = {
  createComment,
  getCommentsByReviewId,
  deleteComment,
};
