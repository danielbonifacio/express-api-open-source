'use strict';

const express     = require('express');
const auth        = require('../middlewares/auth');
const controller  = require('../controllers/product');

const router      = express.Router();

// Recupera todos os Produtos
router
  .get('/',         controller.getProducts)
  .get('/:slug',    controller.getProduct)
  .post('/',        auth, controller.createProduct)
  .put('/:id',      auth, controller.updateProduct)
  .delete('/:id',   auth, controller.deleteProduct)
  .get('/private',  auth, function(req, res) {
    res
      .status(200)
      .send({ message: 'Você tem acesso.'})
  });

module.exports = router;