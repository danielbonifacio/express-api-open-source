'use strict';

// Importando pacotes e arquivos necessários
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');
const lang      = require('../../core/lang');
const User      = require('../models/user');
const services  = require('../services');
const mailer    = require('../services/Mailer');

// Cadastro de contas de usuários
const signUp = async (req, res) => {
  const { email } = req.body;
  
  // Caso encontre algum email cadastrado, retorna erro 400
  if (await User.findOne({ email }))
    return res
      .status(400)
      .send({ message: lang.DataBase.Exists });

  // Preenchendo o Schema
  const user = new User({
    email:    req.body.email,
    name:     req.body.name,
    password: req.body.password,
    userType: req.body.userType
  });

  // Gera um Avatar com o Gravatar baseado no email inserido
  user.avatar = user.gravatar();

  // Tenta salvar o usuário, reportando ao cliente.
  user.save((err) => {
    if (err)
      return res
        .status(500)
        .send({ error: lang.DataBase.StoreError + err })
    
    return res.status(200).send({ user: user, token: services.Tokens.create(user) })
  });
}

// Login de usuários no sistema
// REVER SEGURANÇA DA FUNÇÃO!!!
const signIn = async (req, res) => {
  const { email, password } = req.body;

  // Procura registros no banco de dados
  const user = await User.findOne({ email }).select('+password');

  if (!user)
    return res
      .status(404)
      .send({ error: lang.DataBase.NotFound });

  // Verifica se as senhas coincidem
  if(!await bcrypt.compare(password, user.password))
    return res
      .status(400)
      .send({ error: lang.Auth.Forbidden });

  // Impede a visualização da senha durante o retorno
  user.password = undefined;

  // Retornamos nosso Token e informações de usuário 
  req.user = user;
  res
    .status(200)
    .send({
      user: user,
      token: services.Tokens.create(user)
    });
}

// Envia um Token de recuperação de senha para o usuário
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Tenta recuperar o usuário referente ao email enviado
    const user = await User.findOne({ email });
    
    // Caso não encontre o usário retorna um erro 404
    if (!user)
    return res
      .status(404)
      .send({ error: lang.DataBase.NotFound });

    // Gera um token de 30 caracteres
    const token = crypto.randomBytes(30).toString('hex');

    // Recupera o horário atual + uma hora (tempo de vida útil do token)
    const now = new Date();
    now.setHours(now.getHours() + 1);

    // Armazena as informações de validação no banco de dados
    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
        tokenIsUsed: false
      }
    });

    // Envia por meio do SendGrid um email para o usuário contendo o token
    // ARRUMA ESSE TEMPLATE DE EMAIL LOGO, MANO!!
    mailer.sendgrid.sendMail({
      to: email,
      from: 'danielbonifacio@outlook.com',
      subject: 'Recuperar senha',
      template: 'auth/forgot_password',
      context: { token, name: user.name }
    }, (err) => {
      if (err)
        return res
          .status(400)
          .send({
            error: `${lang.PasswordRecover.EmailFailed}`,
            cause: err
          });
      
      res.send();
    });

  } catch (err) {
    res
      .status(400)
      .send({ error: 'Error on forgot password, try agin' });
  }
}

// Ifnorma nova senha para conta
const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+passwordResetToken passwordResetExpires');

    if (!user)
    return res
      .status(404)
      .send({ error: lang.DataBase.NotFound });
    
    if (token !== user.passwordResetToken)
      return res
        .status(400)
        .send({ error: 'Invalid Token' });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res
        .status(401)
        .send({ error: 'Token expired. Generate a new one.' });
    
    user.password = password;
    
    await user.save();

    res.send();
    
  } catch (err) {
    if(err)
      return res
        .status(400)
        .send({ error: 'Connot reset password. Try Agin later.' });
  }
}

module.exports = {
  signIn,
  signUp,
  forgotPassword,
  resetPassword
}