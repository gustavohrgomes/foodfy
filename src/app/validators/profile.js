const { compare } = require('bcryptjs');

const User = require('../models/User');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (value of keys) {
    if (body[value] == '') {
      return { user: body, error: 'Por favor, preencha todos os campos.' };
    }
  }
}

async function index(req, res, next) {
  const { userId: id } = req.session;

  const userProfile = await User.findOne({ where: { id } });

  if (userProfile === null || userProfile === undefined) {
    return res.render('admin/profile/index', {
      error: 'Usuário não encontrado',
    });
  }

  req.user = userProfile;

  next();
}

async function update(req, res, next) {
  try {
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) {
      return res.render('admin/profile/index', fillAllFields);
    }

    const { userId: id } = req.session;
    const { password, email } = req.body;
    const user = await User.findOne({ where: { id } });

    if (email != user.email) {
      const isNotAvaliable = await User.findOne({ where: { email } });
      if (isNotAvaliable) {
        return res.render('admin/profile/index', {
          user: req.body,
          error: 'Este email já está cadastrado!',
        });
      }
    }

    if (!password) {
      return res.render('admin/profile/index', {
        user: req.body,
        error: 'Digite sua senha para atualizar seu cadastro.',
      });
    }

    const passwordPassed = await compare(password, user.password);
    if (!passwordPassed) {
      return res.render('admin/profile/index', {
        user: req.body,
        error: 'Senha incorreta.',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  index,
  update,
};
