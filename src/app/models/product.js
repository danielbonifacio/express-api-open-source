'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  picture: {
    type: String,
    require: false,
    default: 'no-picture.jpg'
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
  }
});

module.exports = mongoose.model('Product', ProductSchema);