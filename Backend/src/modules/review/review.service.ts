import { ReviewStatus } from '@prisma/client';

import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const recalculateRating = async (mediaId: string) => {
  const reviews = await prisma.review.findMany({
    where: { mediaId, status: 'PUBLISHED' },
  });

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  await prisma.media.update({
    where: { id: mediaId },
    data: {
      avgRating: parseFloat(avg.toFixed(1)),
      totalRatings: reviews.length,
    },
  });
};

const createReview = async (userId: string, payload: any) => {
  const result = await prisma.review.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
};

const getAllReviews = async () => {
  const result = await prisma.review.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      media: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

const getMyReviews = async (userId: string) => {
  const result = await prisma.review.findMany({
    where: { userId },
    include: {
      media: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};

const updateReview = async (id: string, userId: string, payload: any) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  if (review.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You can only update your own reviews');
  }

  if (review.status !== 'PENDING') {
    throw new AppError(httpStatus.BAD_REQUEST, 'You can only update reviews that are still pending');
  }

  const result = await prisma.review.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteReview = async (id: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  if (review.userId !== userId && role !== 'ADMIN') {
    throw new AppError(httpStatus.FORBIDDEN, 'You cannot delete this review');
  }

  const result = await prisma.review.delete({
    where: { id },
  });

  if (review.status === 'PUBLISHED') {
    await recalculateRating(review.mediaId);
  }

  return result;
};

const approveReview = async (id: string) => {
  const review = await prisma.review.update({
    where: { id },
    data: { status: 'PUBLISHED' },
  });

  await recalculateRating(review.mediaId);
  return review;
};

const unpublishReview = async (id: string) => {
  const review = await prisma.review.update({
    where: { id },
    data: { status: 'UNPUBLISHED' },
  });

  await recalculateRating(review.mediaId);
  return review;
};

const toggleLike = async (userId: string, reviewId: string) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_reviewId: {
        userId,
        reviewId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return { liked: false };
  } else {
    await prisma.like.create({
      data: {
        userId,
        reviewId,
      },
    });
    return { liked: true };
  }
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  approveReview,
  unpublishReview,
  toggleLike,
};
