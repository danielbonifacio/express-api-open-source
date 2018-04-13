'use strict';

const services = require('../services');
const lang     = require('../../core/lang');
const User     = require('../models/user');

async function requiresSecretary(req, res, next) {
  let levels  = ['root', 'admin', 'secretary']
  let auth    = await findAndAuth(req.user, levels);

  if(!auth) {
     res.status(401).end();
  } else {
     next();
  }
}
async function requiresAdmin(req, res, next) {
  let levels = ['root', 'admin']
  let auth    = await findAndAuth(req.user, levels);

  if(!auth) {
     res.status(401).end();
  } else {
     next();
  }
}

async function requiresRoot(req, res, next) {
  let levels  = ['root'];
  let auth    = await findAndAuth(req.user, levels);

  if(!auth) {
     res.status(401).end();
  } else {
     next();
  }
}

async function findAndAuth(userId, levels = Array){
  const user = await User.findById({_id: userId});
  for (var level in levels)
  { 
    if (user.userType == levels[level])
      return true;
  }
  return false;
}

module.exports = {
  requiresAdmin,
  requiresSecretary,
  requiresRoot
}