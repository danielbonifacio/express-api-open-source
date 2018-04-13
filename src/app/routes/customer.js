'use strict';

const express     = require('express');
const auth        = require('../middlewares/auth');
const controller  = require('../controllers/customer');

const router      = express.Router();

router
  .post('/', controller.createCustomer)
  .get('/:identificator', controller.getCustomer)
  .get('/', controller.getCustomers)
  .get('/:level/:find', controller.getCustomersBy)

module.exports = router;