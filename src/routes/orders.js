const express = require('express');
const ordersController = require('../controllers/orders');

const router = express.Router();

router.post('/', ordersController.create);
router.patch('/:id', ordersController.update);
router.get('/', ordersController.list);

module.exports = router;
