import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { prisma } from '../lib/prisma';
import catchAsync from '../utils/catchAsync';
import { JwtUtils } from '../utils/jwt';

const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required: session check failed due to missing token.');
  }

  let decoded;
  try {
    decoded = JwtUtils.verifyToken(token.split(' ')[1]) as JwtPayload;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
  }

  const { email } = decoded;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This user is not found. Please log in again.');
  }

  if (user.isSuspended) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your account has been suspended. Please contact support.');
  }

  (req as any).user = decoded as JwtPayload;
  next();
});

export default auth;
