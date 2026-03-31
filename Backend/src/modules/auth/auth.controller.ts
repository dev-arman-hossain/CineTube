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

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'] as string;
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip;
  const result = await AuthService.googleLogin(req.body, { userAgent, ipAddress });

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Google login successful',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'] as string;
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip;
  const result = await AuthService.login(req.body, { userAgent, ipAddress });

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

const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  const file = (req as any).file;

  if (!file) {
    res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
    return;
  }

  // Extract the secure URL from Cloudinary response
  // multer-storage-cloudinary stores the full path in req.file.path
  const avatarUrl = file.path || file.secure_url;

  if (!avatarUrl) {
    res.status(400).json({
      success: false,
      message: 'Failed to get image URL from Cloudinary'
    });
    return;
  }

  const result = await AuthService.updateProfile((req as any).user.email, { avatar: avatarUrl });

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body.email);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Reset link sent to your email',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Password reset successfully',
  });
});

export const AuthController = {
  register,
  login,
  getMe,
  updateProfile,
  uploadAvatar,
  forgotPassword,
  resetPassword,
  googleLogin,
};
