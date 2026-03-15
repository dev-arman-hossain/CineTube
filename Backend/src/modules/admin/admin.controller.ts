import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AdminService } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers();

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await AdminService.updateUserRole(id as string, role);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getStats();

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Admin statistics retrieved successfully',
    data: result,
  });
});

export const AdminController = {
  getAllUsers,
  updateUserRole,
  getStats,
};
