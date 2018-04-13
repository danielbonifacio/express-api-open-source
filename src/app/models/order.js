'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const OrderSchema = new Schema({
  customer_id: {
    type: String,
    require: true
  },
  service_id: {
    type: String,
    require: true
  },
  technician_id:{
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  details: {
    type: String
  },
  date: {
    type: String,
    require: true
  },
  hours: {
    type: String
  },
  paid: {
    type: Boolean,
    default: false
  },
  payment: {
    type: String,
    default: 'money'
  }
});

module.exports = mongoose.model('Order', OrderSchema);