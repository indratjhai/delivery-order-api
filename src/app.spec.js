const request = require('supertest');
const app = require('./app.js');

describe('GET /nonexistent', () => {
  it('should 404', async () => {
    const res = await request(app)
      .get('/nonexistent ');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toStrictEqual({
      error: 'Not found',
    });
  });
});

describe('GET /orders', () => {
  it('should list all orders', async () => {
    const res = await request(app)
      .get('/orders');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((order) => {
      expect(typeof order.id).toContain('number');
      expect(typeof order.distance).toContain('number');
      expect(['UNASSIGNED', 'TAKEN', 'CANCELED']).toContain(order.status);
    });
  });
});

describe('place', () => {
  it('should place an order in database', async () => {
    const res = await request(app)
      .post('/orders')
      .send({
        origin: ['-6.185700799999999', '106.8111084'],
        destination: ['-6.2073402', '106.7976586'],
      });

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.id).toContain('number');
    expect(typeof res.body.distance).toContain('number');
    expect(res.body.status).toContain('UNASSIGNED');
  });
});

describe('take', () => {
  it('should 404 on nonpresent order', async () => {
    const res = await request(app)
      .patch('/orders/0')
      .send({
        status: 'TAKEN',
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toStrictEqual({
      error: 'Order not found',
    });
  });

  it('should return validation error when order is taken', async () => {
    const res = await request(app)
      .patch('/orders/1')
      .send({
        status: 'TAKEN',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toStrictEqual({
      error: 'Order has already been taken by someone else',
    });
  });

  it('should return 200 when order has been succesfully taken', async () => {
    let res;
    res = await request(app)
      .post('/orders')
      .send({
        origin: ['-6.185700799999999', '106.8111084'],
        destination: ['-6.2073402', '106.7976586'],
      });

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.id).toContain('number');

    const orderId = res.body.id;

    res = await request(app)
      .patch(`/orders/${orderId}`)
      .send({
        status: 'TAKEN',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toStrictEqual({
      status: 'SUCCESS',
    });
  });
});
