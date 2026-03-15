import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';

const requireRole = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || !roles.includes(user.role)) {
    return next(new AppError(httpStatus.FORBIDDEN, 'Access denied'));
  }
  next();
};

export default requireRole;
