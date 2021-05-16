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

async function reset(req, res, next) {
  const { email, password, passwordConfirm, token } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user == null || user == undefined) {
    return res.render('session/password-reset', {
      token,
      user: req.body,
      error: 'Usuário não encontrado. 😓',
    });
  }

  if (password != passwordConfirm) {
    return res.render('session/password-reset', {
      token,
      user: req.body,
      error: 'Confirmação de senha está diferente da senha digitada. 😓',
    });
  }

  if (token != user.reset_token) {
    return res.render('session/password-reset', {
      user: req.body,
      error: 'Token inválido! Solicite uma nova recuperação de senha.',
    });
  }

  let now = new Date();
  now = now.setHours(now.getHours());

  if (now > user.reset_token_expires) {
    return res.render('session/password-reset', {
      token,
      user: req.body,
      error:
        'Seu token para redefinação de senha expirou.\n Faça uma nova solicitação de redefinição de senha.',
    });
  }

  req.user = user;

  next();
}

module.exports = {
  login,
  forgot,
  reset,
};
