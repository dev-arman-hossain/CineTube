import { Prisma, MediaType, ContentType } from '@prisma/client';
import { prisma } from '../../lib/prisma';

const createMedia = async (payload: any) => {
  const result = await prisma.media.create({
    data: payload,
  });
  return result;
};

const getAllMedia = async (query: any) => {
  const {
    page = 1,
    limit = 12,
    genre,
    platform,
    type,
    minRating,
    year,
    sort,
    q,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: Prisma.MediaWhereInput = {};

  if (genre) {
    where.genre = { has: genre as string };
  }

  if (platform) {
    where.platform = { has: platform as string };
  }

  if (type) {
    where.type = type as MediaType;
  }

  if (minRating) {
    where.avgRating = { gte: Number(minRating) };
  }

  if (year) {
    where.releaseYear = Number(year);
  }

  if (q) {
    const searchString = q as string;
    where.OR = [
      { title: { contains: searchString, mode: 'insensitive' } },
      { director: { contains: searchString, mode: 'insensitive' } },
      { synopsis: { contains: searchString, mode: 'insensitive' } },
      { genre: { hasSome: [searchString] } },
      { cast: { hasSome: [searchString] } },
    ];
  }

  let orderBy: Prisma.MediaOrderByWithRelationInput = { createdAt: 'desc' };

  if (sort === 'highest_rated') {
    orderBy = { avgRating: 'desc' };
  } else if (sort === 'most_reviewed') {
    orderBy = { totalRatings: 'desc' };
  } else if (sort === 'latest') {
    orderBy = { createdAt: 'desc' };
  }

  const [data, total] = await Promise.all([
    prisma.media.findMany({
      where,
      skip,
      take,
      orderBy,
    }),
    prisma.media.count({ where }),
  ]);

  return {
    data,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getFeaturedMedia = async () => {
  const result = await prisma.media.findMany({
    take: 8,
    orderBy: {
      avgRating: 'desc',
    },
  });
  return result;
};

const getMediaById = async (id: string, user?: any) => {
  const result = await prisma.media.findUnique({
    where: { id },
    include: {
      reviews: {
        where: { status: 'PUBLISHED' },
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
  });

  if (result && result.contentType === 'PREMIUM') {
    const isAdmin = user?.role === 'ADMIN';
    const isPremium = user?.isPremium === true;

    if (!isAdmin && !isPremium) {
      return {
        ...result,
        streamingLink: null,
        isLocked: true,
      } as any;
    }
  }

  return result;
};

const updateMedia = async (id: string, payload: any) => {
  const media = await prisma.media.findUnique({
    where: { id },
  });

  if (!media) {
    throw new Error('Media not found');
  }

  const result = await prisma.media.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteMedia = async (id: string) => {
  const result = await prisma.media.delete({
    where: { id },
  });
  return result;
};

export const MediaService = {
  createMedia,
  getAllMedia,
  getFeaturedMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
};
