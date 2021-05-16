const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '4e75cbf19d95f3',
    pass: 'f75734e741bb07',
  },
});
