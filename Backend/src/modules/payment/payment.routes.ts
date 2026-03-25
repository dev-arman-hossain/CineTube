import { Router } from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth.middleware';
import express from 'express';

const router = Router();

// Webhook needs raw body, handled in app.ts
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.handleWebhook
);

router.post(
  '/create-checkout-session',
  auth,
  PaymentController.createCheckoutSession
);

export const PaymentRoutes = router;
