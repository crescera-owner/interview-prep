import express, { type Express } from 'express';
import { healthRouter } from './routes/health.js';
import { ordersRouter } from './routes/orders.js';

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());
  app.use(healthRouter);
  app.use(ordersRouter);
  return app;
};
