/* Controla quem pode chegar junto na API
 * REVER DOMÍNIOS COM O CLIENTE COM URGÊNCIA!!!!
 * 
 * Controle de Headers
 * Última modificação: 03/04/2018
*/
module.exports = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
};