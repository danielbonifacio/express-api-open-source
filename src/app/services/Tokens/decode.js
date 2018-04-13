'use strict';

const jwt     = require('jwt-simple');
const moment  = require('moment');
const config  = require('../../../core/config');

function decodeToken (token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN);
      
      if (payload.exp <= moment.unix())
        reject({
          status: 401,
          message: lang.Auth.Expired
        })

      resolve(payload.sub)
    } catch (err) {
      reject({
        status: 500,
        message: lang.Auth.Invalid
      })
    }
  });

  return decoded;
}

module.exports = decodeToken;