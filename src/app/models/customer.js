'use strict'

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');

const CustomerSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  document: {
    type: String,
    require: true,
    unique: true
  },
  phone: {
    type: String,
    require: true,
    unique: true
  },
  customerType: {
    type: String,
    default: 'person',
    enum: ['person', 'company']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Customer', CustomerSchema);