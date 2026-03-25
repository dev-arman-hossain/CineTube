import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { JwtUtils } from '../utils/jwt';
import { prisma } from '../lib/prisma';
import catchAsync from '../utils/catchAsync';

const optionalAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    try {
      const decoded = JwtUtils.verifyToken(token.split(' ')[1]) as JwtPayload;
      const user = await prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (user && !user.isSuspended) {
        (req as any).user = user; // Use full user object from DB
      }
    } catch (error) {
      // Ignore invalid token in optional auth
    }
  }

  next();
});

export default optionalAuth;
