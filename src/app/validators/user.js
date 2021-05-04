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

module.exports = {
  post,
};
