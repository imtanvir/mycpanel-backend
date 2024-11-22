import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import Stripe from 'stripe';
import config from './app/config';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import { Router } from './router';
const app: Application = express();
export const stripe = new Stripe(config.stripe_sk ?? '');
//parser
app.use(express.json());
// its for parsing cookies
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

app.use('/api/v1', Router);
app.use(notFound);
app.use(globalErrorHandler);
export default app;
