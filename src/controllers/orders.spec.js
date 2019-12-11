const ordersController = require('./orders.js');
const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/notFoundError');

describe('list', () => {
  it('should throw validation error when incorrect params provided', async () => {
    await expect(ordersController.list({
      query: {
        page: 'abc',
      },
    }, null)).rejects.toThrow(new ValidationError('\'page\' value must be an integer'));

    await expect(ordersController.list({
      query: {
        limit: 'abc',
      },
    }, null)).rejects.toThrow(new ValidationError('\'limit\' value must be an integer'));

    await expect(ordersController.list({
      query: {
        page: '-1',
      },
    }, null)).rejects.toThrow(new ValidationError('\'page\' value must be grater than zero'));

    await expect(ordersController.list({
      query: {
        limit: '-1',
      },
    }, null)).rejects.toThrow(new ValidationError('\'limit\' value must be grater than zero'));
  });
});

describe('create', () => {
  it('should throw validation error when incorrect params provided', async () => {
    await expect(ordersController.create({
      body: {
      },
    }, null)).rejects.toThrow(new ValidationError('\'origin\' parameter is required'));

    await expect(ordersController.create({
      body: {
        origin: ['100', '200'],
      },
    }, null)).rejects.toThrow(new ValidationError('\'destination\' parameter is required'));

    await expect(ordersController.create({
      body: {
        origin: ['100', '200'],
        destination: ['100', '200'],
      },
    }, null)).rejects.toThrow(new ValidationError('\'origin\' value must be a valid latitude and longitude string pair'));

    await expect(ordersController.create({
      body: {
        origin: ['90', '180'],
        destination: ['100', '200'],
      },
    }, null)).rejects.toThrow(new NotFoundError('\'destination\' value must be a valid latitude and longitude string pair'));

    await expect(ordersController.create({
      body: {
        origin: ['0', '0'],
        destination: ['90', '180'],
      },
    }, null)).rejects.toThrow(new ValidationError('No route found for given \'origin\' to \'destination\''));
  });
});

describe('update', () => {
  it('should throw validation error when incorrect params provided', async () => {
    await expect(ordersController.update({
      params: {
        id: 'abc',
      },
      body: {},
    }, null)).rejects.toThrow(new ValidationError('\'id\' value must be a string'));

    await expect(ordersController.update({
      params: {
        id: 0,
      },
      body: {},
    }, null)).rejects.toThrow(new ValidationError('\'status\' parameter is required'));

    await expect(ordersController.update({
      params: {
        id: 0,
      },
      body: {
        status: 'test',
      },
    }, null)).rejects.toThrow(new ValidationError('\'status\' value must be \'TAKEN\''));

    await expect(ordersController.update({
      params: {
        id: 0,
      },
      body: {
        status: 'TAKEN',
      },
    }, null)).rejects.toThrow(new NotFoundError('Order not found'));
  });
});
