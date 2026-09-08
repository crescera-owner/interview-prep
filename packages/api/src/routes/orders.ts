import { Router } from 'express';
import { calculateOrderTotal, type OrderLineItem } from '../services/orderService.js';

export const ordersRouter: Router = Router();

ordersRouter.post('/orders/total', (req, res) => {
  const items = req.body?.items as OrderLineItem[] | undefined;

  if (!Array.isArray(items)) {
    res.status(400).json({ error: 'Request body must include an "items" array' });
    return;
  }

  const total = calculateOrderTotal(items);
  res.status(200).json({ total });
});
