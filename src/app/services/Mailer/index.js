'use strict';

const path        = require('path');
const nodemailer  = require('nodemailer');
const hbs         = require('nodemailer-express-handlebars');
const sgTransport = require('nodemailer-sendgrid-transport');

const api         = 'sendgrid_api_string';

const options = {
  auth: {
    api_user: 'sendgrid_user',
    api_key: 'sendgrid_password'
  }
}

const sendgrid = new nodemailer.createTransport(sgTransport(options));

sendgrid.use('compile', hbs({
  viewEngine: 'handlebars',
  viewPath: path.resolve('./src/app/views/mail'),
  extName: '.html'
}));

const { host, port, user, pass} = require('../../../core/config.Mailer.json');


const transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass }
});

transport.use('compile', hbs({
  viewEngine: 'handlebars',
  viewPath: path.resolve('./src/app/views/mail'),
  extName: '.html',
}));


module.exports = {
  sendgrid,
  transport
};