import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AuthService } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe((req as any).user.email);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.updateProfile((req as any).user.email, req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  getMe,
  updateProfile,
};
