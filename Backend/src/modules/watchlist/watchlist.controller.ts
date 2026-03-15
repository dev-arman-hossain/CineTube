import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { WatchlistService } from './watchlist.service';

const toggleWatchlist = catchAsync(async (req: Request, res: Response) => {
  const { mediaId } = req.body;
  const result = await WatchlistService.toggleWatchlist((req as any).user.id, mediaId);

  res.status(httpStatus.OK).json({
    success: true,
    message: result.added ? 'Added to watchlist' : 'Removed from watchlist',
    data: result,
  });
});

const getMyWatchlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WatchlistService.getMyWatchlist((req as any).user.id);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Watchlist retrieved successfully',
    data: result,
  });
});

export const WatchlistController = {
  toggleWatchlist,
  getMyWatchlist,
};
