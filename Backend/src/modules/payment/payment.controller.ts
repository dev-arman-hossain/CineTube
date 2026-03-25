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
  const payload = req.body; // Adjusted in app.ts to be Buffer for this route

  const result = await PaymentService.handleWebhook(sig, payload);

  res.status(httpStatus.OK).json(result);
});

export const PaymentController = {
  createCheckoutSession,
  handleWebhook,
};
