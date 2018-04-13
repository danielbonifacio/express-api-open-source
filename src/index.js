/* API Total Clean
 * Desenvolvida por: Daniel Bonifacio
 * Em Fase de testes
 * Data da última modificação: 13/04/2018
 * 
 * CONSULTAR O DESENVOLVEDOR ANTES DE REALIZAR
 * QUALQUER ALTERAÇÃO NOS ARQUIVOS.
*/

'use strict';

const mongoose    = require('mongoose');
const app         = require('./app');
const config      = require('./core/config');
const lang        = require('./core/lang/' + config.lang);
const normalize   = require('normalize-port');

// Normaliza a porta do servidor
const port = normalize(config.port);

// Conexão com o banco de dados
mongoose.connect(config.db, (err, res) => {
  if (err)
    return console.log(`${lang.DataBase.ConnectError} \n ${err}`);

  // Tenta "iniciar" o servidor
  try {
    app.listen(port, (err) => {
      if (config.welcome === true)
        console.log(`${lang.Application.Port} ${config.port}`);
    });
  } catch (err) {
    if(err)
      console.log(`${lang.Server.Error} — ${err}`);
  } 
});