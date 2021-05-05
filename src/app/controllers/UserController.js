const User = require('../models/User');

module.exports = {
  registerForm(req, res) {
    return res.send('formulário de cadastro de usuário!');
  },
  async list(req, res) {
    let results = await User.all();
    const users = results.rows;

    return res.render('admin/users/index', { users });
  },
  create(req, res) {
    return res.render('admin/users/create');
  },
  async post(req, res) {
    await User.create(req.body);

    return res.redirect('/admin/users');
  },
};
