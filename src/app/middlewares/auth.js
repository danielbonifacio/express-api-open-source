'use strict';

const services = require('../services');
const lang     = require('../../core/lang');

module.exports = (req, res, next) => {
  // Recupera o Header de autenticação
  const authHeader = req.headers.authorization;

  // Caso não exista esse header
  if (!authHeader)
    return res
      .status(401)
      .send({ error: lang.Auth.TokenNotProvided });
  
  // Separa a string do header
  const parts = authHeader.split(' ');
  
  // Caso o Header não seja formatado da maneira correta
  if (!parts.length === 2)
    return res
      .status(401)
      .send({ error: lang.TokenError });

  // Desestrutura o Header
  const [ scheme, token ] = parts;

  // Verifica se o Scheme contém "Bearer"
  if (!/^Bearer$/i.test(scheme))
    return res
      .status(401)
      .send({ error: lang.Auth.TokenMalformatted });

  
  services.Tokens.decode(token)
    .then(response => {
      req.user = response;
      next();
    })
    .catch(err => {
      res
        .status(401)
        .send({ error: lang.Auth.Invalid });
    });
}