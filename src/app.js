const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const orderRouter = require('./routes/orders');
const NotFoundError = require('./errors/notFoundError');

const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());

// Register routers
app.use('/orders', orderRouter);

// Handle route not found error
app.use((req, res, next) => {
  next(new NotFoundError());
});

// Handler runtime error
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  /* istanbul ignore next */
  const statusCode = err.status || 500;

  /* istanbul ignore next */
  const response = {
    error: err.message || 'Something broke!',
  };

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stackTrace = err.stack.split('\n');
  }

  res.status(statusCode).json(response);
});

module.exports = app;
