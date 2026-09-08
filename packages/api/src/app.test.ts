import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';

const app = createApp();

describe('GET /health', () => {
  it('returns ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('POST /orders/total', () => {
  it('sums price * quantity across line items', async () => {
    const response = await request(app)
      .post('/orders/total')
      .send({ items: [{ price: 10, quantity: 2 }, { price: 5, quantity: 3 }] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ total: 35 });
  });

  it('rejects a request missing the items array', async () => {
    const response = await request(app).post('/orders/total').send({});
    expect(response.status).toBe(400);
  });
});
