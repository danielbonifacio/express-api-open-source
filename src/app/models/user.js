'use strict'

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');

const UserSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  tokenIsUsed: {
    type: Boolean,
    default: false
  },
  userType: {
    type: String,
    default: 'technician',
    enum: ['root', 'admin', 'secretary', 'technician']
  },
  franchise: {
    type: String,
    require: true
  }
})

UserSchema.pre('save', async function (next) {
  
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

UserSchema.methods.gravatar = function (size = 200) {
  if (!this.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;

  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
}

module.exports = mongoose.model('User', UserSchema);