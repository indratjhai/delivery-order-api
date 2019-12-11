const check = require('check-types');
const Order = require('../models/order');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const { calculateDistance } = require('../helpers/googleMap');
const { isValidLatLongPair, isIntegerString } = require('../helpers/validation');

// List all orders.
async function list(req, res) {
  let { page = 1, limit = 10 } = req.query;

  if (!isIntegerString(page)) {
    throw new ValidationError('\'page\' value must be an integer');
  }
  if (!isIntegerString(limit)) {
    throw new ValidationError('\'limit\' value must be an integer');
  }

  page = parseInt(page);
  limit = parseInt(limit);

  if (page < 1) {
    throw new ValidationError('\'page\' value must be grater than zero');
  }
  if (limit < 1) {
    throw new ValidationError('\'limit\' value must be grater than zero');
  }

  const orders = await Order.all({ page, limit });

  res.json(orders.map(({ id, distance, status }) => ({
    id,
    distance,
    status,
  })));
}

// Place an order.
async function create(req, res) {
  const { origin, destination } = req.body;

  if (!check.assigned(origin)) {
    throw new ValidationError('\'origin\' parameter is required');
  }
  if (!check.assigned(destination)) {
    throw new ValidationError('\'destination\' parameter is required');
  }
  if (!isValidLatLongPair(origin)) {
    throw new ValidationError('\'origin\' value must be a valid latitude and longitude string pair');
  }
  if (!isValidLatLongPair(destination)) {
    throw new ValidationError('\'destination\' value must be a valid latitude and longitude string pair');
  }

  const distance = await calculateDistance(origin, destination);
  if (distance === null) {
    throw new ValidationError('No route found for given \'origin\' to \'destination\'');
  }

  const id = await Order.create(origin, destination, distance);

  res.json({
    id,
    distance,
    status: Order.STATUS_UNASSIGNED,
  });
}

// Take an order.
async function update(req, res) {
  const { status } = req.body;
  const { id } = req.params;

  if (!isIntegerString(id)) {
    throw new ValidationError('\'id\' value must be a string');
  }

  if (!check.string(status)) {
    throw new ValidationError('\'status\' parameter is required');
  }

  if (status !== Order.STATUS_TAKEN) {
    throw new ValidationError('\'status\' value must be \'TAKEN\'');
  }

  const order = await Order.find(id);

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  const affectedRows = await order.take();

  if (!affectedRows) {
    throw new ValidationError('Order has already been taken by someone else');
  }

  res.json({
    status: 'SUCCESS',
  });
}

module.exports = { list, create, update };
