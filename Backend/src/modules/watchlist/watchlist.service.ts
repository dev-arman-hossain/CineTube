import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const toggleWatchlist = async (userId: string, mediaId: string) => {
  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_mediaId: {
        userId,
        mediaId,
      },
    },
  });

  if (existing) {
    await prisma.watchlist.delete({
      where: { id: existing.id },
    });
    return { added: false };
  } else {
    const media = await prisma.media.findUnique({
      where: { id: mediaId },
      select: { title: true },
    });

    await prisma.watchlist.create({
      data: {
        userId,
        mediaId,
      },
    });

    // Notify user
    await (prisma as any).notification.create({
      data: {
        userId,
        title: '📌 Added to Watchlist',
        message: `"${media?.title}" has been added to your watchlist.`,
      },
    });

    return { added: true };
  }
};

const getMyWatchlist = async (userId: string) => {
  const result = await prisma.watchlist.findMany({
    where: { userId },
    include: {
      media: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          avgRating: true,
          releaseYear: true,
          genre: true,
          contentType: true,
          type: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};

export const WatchlistService = {
  toggleWatchlist,
  getMyWatchlist,
};
