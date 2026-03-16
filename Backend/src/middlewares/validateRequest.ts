import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: any) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });
    req.body = parsed.body;
    next();
  });
};

export default validateRequest;
