import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import { maintenanceMiddleware } from './middlewares/maintenance';
import morgan from 'morgan';
import config from './config';

const app: Application = express();

// parsers
app.use(morgan('dev'));

// Stripe Webhook - MUST be before express.json() for signature verification
import { PaymentController } from './modules/payment/payment.controller';
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), PaymentController.handleWebhook);

app.use(express.json());

app.use(cors({
  origin: [config.client_url as string],
  credentials: true
}));

// maintenance check
app.use(maintenanceMiddleware);

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('CineTube API is running...');
});

// global error handler placeholders
app.use(globalErrorHandler);
app.use(notFound);

export default app;
