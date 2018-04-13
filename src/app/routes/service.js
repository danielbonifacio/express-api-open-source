'use strict';

const express     = require('express');
const auth        = require('../middlewares/auth');
const controller  = require('../controllers/service');

const router      = express.Router();


router
  .get('/',         controller.getServices)
  .get('/:slug',    controller.getService)
  .post('/create',  controller.createService)
  .put('/:id',      controller.updateService)
  .delete('/:id',   controller.deleteService);

module.exports = router;