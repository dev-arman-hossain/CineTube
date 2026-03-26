import { NextFunction, Request, Response } from 'express';
import { getSystemSettings } from '../utils/settingsHelper';

export const maintenanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const settings = getSystemSettings();
  
  // Skip if maintenance mode is off
  if (!settings.maintenanceMode) {
    return next();
  }

  // Allow admin-related setup and settings fetch/update
  const allowedPaths = ['/api/admin/settings', '/api/auth/login'];
  if (allowedPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  // Allow actual Admins to bypass maintenance
  // Assuming req.user is populated by auth middleware if present
  // Note: This middleware should ideally run AFTER the auth middleware for admin paths, 
  // but for public paths, we block if maintenance is on.
  const user = (req as any).user;
  if (user && user.role === 'ADMIN') {
    return next();
  }

  // Block for others
  res.status(503).json({
    success: false,
    message: 'The platform is currently undergoing scheduled maintenance. Please try again later.',
    retryAfter: 3600, // Hint to retry in 1 hour
  });
};
