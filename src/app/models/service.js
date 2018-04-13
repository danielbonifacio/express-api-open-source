'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  slug: {
    type: String,
    require: true,
    unique: true
  },
  pricePerMeter: {
    type: Number
  }
});

module.exports = mongoose.model('Service', ProductSchema);