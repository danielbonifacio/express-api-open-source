/* Arquivo de configuração da API
 * port: Porta a ser utilizada pela API
 * lang: Linguagem da API (só tem pt-br por enquanto)
 * welcome: Alterna a mensagem de boas vindas da API
 * db: link de conexão com mongodb
 * secret_token: token particular da API
*/

module.exports = {
  port: process.env.PORT || 3000,
  lang: 'pt-br',
  welcome: true,
  db: process.env.MONGODB || 'mongodb://user:pass@host',
  SECRET_TOKEN: 'mysecretsecuretoken'
}