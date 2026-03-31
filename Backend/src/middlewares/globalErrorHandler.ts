import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../config';
import AppError from '../errors/AppError';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorMessages: any[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err?.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = err.issues.map((issue: any) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue.message,
      };
    });
  } else if (err?.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database Error';
    errorMessages = [
      {
        path: err.code || '',
        message: err.message || 'A database error occurred',
      },
    ];
    console.error('--- PRISMA ERROR ---');
    console.error(err);
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  // Log all errors in development
  if (config.node_env === 'development') {
    console.error('--- ERROR HANDLER ---');
    console.error(err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
