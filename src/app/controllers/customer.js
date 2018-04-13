'use strict';

const Customer  = require('../models/customer');
const services  = require('../services');
const bcrypt    = require('bcryptjs');
const lang      = require('../../core/lang');
const crypto    = require('crypto');
const mailer    = require('../services/Mailer');

const createCustomer = async (req, res) => {
  const { email, phone, mobile, document } = req.body;
  
  if (await Customer.findOne({ email }))
    return res
      .status(400)
      .send({ message: 'Email já cadastrado.' });

  if (await Customer.findOne({ phone }))
    return res
      .status(400)
      .send({ message: 'Número de telefone já cadastrado' });

  if (await Customer.findOne({ document }))
    return res
      .status(400)
      .send({ message: 'CPF já cadastrado.' });

  
  const receivedDataFiltered = {
    email:          req.body.email,
    name:           req.body.name,
    document:       req.body.document,
    phone:          req.body.phone,    
    customerType:   req.body.customerType 
  }

  for (var prop in receivedDataFiltered) { 
    if (receivedDataFiltered[prop] === null || receivedDataFiltered[prop] === undefined) {
      delete receivedDataFiltered[prop];
    }
  }

  const customer = new Customer(receivedDataFiltered);

  customer.save((err, customer) => {
    if (err)
      return res
        .status(500)
        .send({ error: lang.DataBase.StoreError + err })
    
    return res
      .status(200)
      .send({
        customer
      })
  });
}

function getCustomer(req, res){
  let identificator = req.params.identificator;

  Customer.findOne({
    $or:[
      {email: identificator},
      {phone: identificator},
      {id:    identificator}
    ]
  }, (err, customer) => {
    if(err)
      return res
        .status(500)
        .send({ error: lang.Server.Error });
    
    return res
      .status(200)
      .send({ customer });
  })


}


function getCustomersBy(req, res){
  let level = String(req.params.level);
  let find  = String(req.params.find);

  let searchQueue = {
    [level]: find
  }

  Customer.find(searchQueue, (err, customers) => {
    if(err)
      return res
        .status(500)
        .send({ error: lang.Server.Error });
    
    return res
      .status(200)
      .send({ customers });
  })


}

function getCustomers(req, res){
  Customer.find({}, (err, customers) => {
    if(err)
      return res
        .status(500)
        .send({ error: lang.Server.Error });
    
    return res
      .status(200)
      .send({ customers });
  })


}

const signIn = async (req, res) => {
  // Recupera os dados do corpo da requisição
  const { email, password } = req.body;

  // Procura por estes dados
  const user = await User.findOne({ email }).select('+password');

  // Caso não encontre o usário
  if (!user)
    return res
      .status(404)
      .send({ error: lang.DataBase.NotFound });

  // Caso a senha não coincida com a hash
  if(!await bcrypt.compare(password, user.password))
    return res
      .status(400)
      .send({ error: lang.Auth.Forbidden });

  //Impedimos a amostra do password
  user.password = undefined;
  // Retornamos nosso Token  
  req.user = user;
  res
    .status(200)
    .send({
      user: user,
      token: services.Tokens.create(user)
    });
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {

    const user = await User.findOne({ email });
    
    // Caso não encontre o usário
    if (!user)
    return res
      .status(404)
      .send({ error: lang.DataBase.NotFound });

    const token = crypto.randomBytes(30).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
        tokenIsUsed: false
      }
    });

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
          .send({ error: 'Cannot send forgot password email' + err, cause: err });
      
      res.send();
    });

  } catch (err) {
    res.status(400).send({ error: 'Error on forgot password, try agin' });
  }
}

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
  createCustomer,
  getCustomer,
  getCustomers,
  getCustomersBy
}