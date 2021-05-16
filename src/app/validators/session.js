const { compare } = require('bcryptjs');

const User = require('../models/User');

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render('session/login', {
      user: req.body,
      error: 'Ususário não cadastrado.',
    });
  }

  const passed = await compare(password, user.password);

  if (!passed) {
    return res.render('session/login', {
      user: req.body,
      error: 'Senha incorreta.',
    });
  }

  req.user = user;

  next();
}

async function forgot(req, res, next) {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user == null || user == undefined) {
    return res.render('session/forgot-password', {
      user: req.body,
      error: 'E-mail não encontrado. 😪',
    });
  }

  req.user = user;

  next();
}

module.exports = {
  login,
  forgot,
};
