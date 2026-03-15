import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('CineTube API is running...');
});

// global error handler placeholders
app.use(globalErrorHandler);
app.use(notFound);

export default app;
