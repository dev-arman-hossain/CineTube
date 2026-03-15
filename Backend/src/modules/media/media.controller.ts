import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { MediaService } from './media.service';

const createMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.createMedia(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Media created successfully',
    data: result,
  });
});

const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.getAllMedia(req.query);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Media retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getFeaturedMedia = catchAsync(async (req: Request, res: Response) => {
  const result = await MediaService.getFeaturedMedia();

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Featured media retrieved successfully',
    data: result,
  });
});

const getMediaById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MediaService.getMediaById(id as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Media retrieved successfully',
    data: result,
  });
});

const updateMedia = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MediaService.updateMedia(id as string, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Media updated successfully',
    data: result,
  });
});

const deleteMedia = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MediaService.deleteMedia(id as string);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Media deleted successfully',
    data: result,
  });
});

export const MediaController = {
  createMedia,
  getAllMedia,
  getFeaturedMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
};
