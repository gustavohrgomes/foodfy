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

async function post(req, res, next) {
  // check if has all fields
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) {
    return res.render('admin/users/create', fillAllFields);
  }

  // check if user exists [email]
  let { email } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user) {
    return res.render('admin/users/create', {
      user: req.body,
      error: 'Usuário já cadastrado!',
    });
  }

  next();
}

async function edit(req, res, next) {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });

  if (user === null || user === undefined) {
    return res.render('admin/users/index', {
      error: 'Usuário não encontrado.',
    });
  }

  req.user = user;

  next();
}

async function update(req, res, next) {
  try {
    const fillAllFields = checkAllFields(req.body);

    if (fillAllFields) {
      return res.render('admin/users/edit', fillAllFields);
    }

    let { id, password } = req.body;

    if (!password) {
      return res.render('admin/users/edit', {
        user,
        error: 'Digite a senha do usuário para atualizar o cadastro.',
      });
    }

    const user = await User.findOne({ where: { id } });

    const passed = await compare(password, user.password);

    if (!passed)
      return res.render('admin/users/edit', {
        user,
        error: 'Senha incorreta.',
      });

    req.user = user;

    next();
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  post,
  edit,
  update,
};
