'use strict';

const express     = require('express');
const auth        = require('../middlewares/auth');
const controller  = require('../controllers/order');

const router      = express.Router();


router
  .get('/', controller.getOrders)
  .get('/:slug', controller.getOrder)
  .post('/', controller.createOrder)
  .put('/:id', controller.updateOrder)
  .delete('/:id', controller.deleteOrder);

module.exports = router;