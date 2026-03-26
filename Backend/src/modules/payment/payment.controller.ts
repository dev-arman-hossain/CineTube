import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { PaymentService } from './payment.service';

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { priceId, type } = req.body;
  const userId = (req as any).user.id;

  const sessionUrl = await PaymentService.createCheckoutSession(userId, priceId, type);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Checkout session created',
    data: { sessionUrl },
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const payload = req.body;

  const result = await PaymentService.handleWebhook(sig, payload);

  res.status(httpStatus.OK).json(result);
});

const verifySession = catchAsync(async (req: Request, res: Response) => {
  const { session_id } = req.query as { session_id: string };
  const userId = (req as any).user.id;

  const result = await PaymentService.verifySession(session_id, userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Session verified',
    data: result,
  });
});

export const PaymentController = {
  createCheckoutSession,
  handleWebhook,
  verifySession,
};

