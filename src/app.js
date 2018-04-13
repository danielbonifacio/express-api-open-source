'use strict';

// Importando todos os pacotes e arquivos necessários
const express     = require('express');
const bodyParser  = require('body-parser');
const app         = express();
const products    = require('./app/routes/product');
const users       = require('./app/routes/user');
const services    = require('./app/routes/service');
const orders      = require('./app/routes/order');
const customers   = require('./app/routes/customer');
const allow       = require('./app/middlewares/allow');
const levels      = require('./app/middlewares/levels');
const auth        = require('./app/middlewares/auth');

// Normalizando a entrada de dados
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Definindo as rotas e middlewares
app.use('/product',   allow, auth, levels.requiresSecretary, products);
app.use('/user',      allow, users);
app.use('/service',   allow, auth, services);
app.use('/order',     allow, orders);
app.use('/customer',  allow, customers);

module.exports = app;