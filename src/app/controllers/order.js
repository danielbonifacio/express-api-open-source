'use strict';

const Order   = require('../models/order');
const lang    = require('../../core/lang');

function getOrders (req, res) {
  Order.find({}, (err, orders) => {
    if (err)
      return res
        .status(500)
        .send({ message: lang.Server.Fail });
    
    if (!orders)
      return res
        .status(404)
        .send({ message: lang.Server.NotFound });
    
    res
      .status(200)
      .send({ orders });
  })
}

function getOrder (req, res) {
  let id = req.params.id;
  
  Order.findOne({ id }, (err, order) => {
    if (err)
      return res
        .status(500)
        .send({ error: lang.Server.Fail });

    if (!order)
      return res
        .status(404)
        .send({ error: lang.Server.NotFound });

    res
      .status(200)
      .send({ order });
  })
}

function createOrder (req, res) {
  let order = new Order();

  order.customer_id       = req.body.customer_id;
  order.service_id        = req.body.service_id;
  order.technician_id     = req.body.technician_id;
  order.price             = req.body.price;
  order.details           = req.body.details;
  order.date              = req.body.date;
  order.hours             = req.body.hours;
  order.paid              = req.body.paid;
  order.payment           = req.body.payment;

  if (req.body.picture !== '' || req.body.picture)
    order.picture = req.body.picture;

  for (var prop in order) { 
    if (order[prop] === null || order[prop] === undefined || order[prop] === "") {
      delete order[prop];
    }
  }

  order.save((err, orderStored) => {
    if (err)
    return res
      .status(500)
      .send({ message: `${lang.DataBase.StoreError}: ${err}` });

    res
      .status(200)
      .send({
        message: lang.DataBase.Stored,
        order: orderStored
      });
  })
}

function updateOrder (req, res) {
  let id = req.params.id;
  let update = {
    customer_id       : req.body.customer_id,
    service_id        : req.body.service_id,
    technician_id     : req.body.technician_id,
    price             : req.body.price,
    details           : req.body.details,
    date              : req.body.date,
    hours             : req.body.hours,
    paid              : req.body.paid,
    payment           : req.body.payment
  }

  for (var prop in update)
  { 
    if (update[prop] === null || update[prop] === undefined || update[prop] === "")
      delete update[prop]
  }
  
  Order.findByIdAndUpdate(id, update, (err, order) => {
    if (err)
      return res
        .status(500)
        .send({
          message: lang.Server.Fail
        });
    
    return res
      .status(201)
      .send({
        message:  lang.DataBase.Updated,
        order:    order
      });
  })
}

function deleteOrder (req, res) {
  const id = req.params.id;

  Order.findById(id, (err, order) => {
    if (!order)
    return res
      .status(404)
      .send({ error: 'Order doesn\'t exists.' });

    try {
      order.remove();
      return res.send();
    } catch (err) {
      if (err)
        return res
          .status(400)
          .send({ error: 'Error on delete order.' });
    }
  });

}

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder
}