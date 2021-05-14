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
  async edit(req, res) {
    const { user } = req;

    return res.render('admin/users/edit', { user });
  },
  async put(req, res) {
    try {
      const { user } = req;
      let { name, email, is_admin } = req.body;

      if (is_admin === undefined || is_admin === null) {
        is_admin = false;
      }

      await User.update(user.id, {
        name,
        email,
        is_admin,
      });

      return res.render('admin/users/edit', {
        user: req.body,
        success: 'Usuário atualizado com sucesso. 🚀',
      });
    } catch (error) {
      res.render('admin/users/edit', { error: 'Ops... Algo deu errado! 😓' });
      throw new Error(error);
    }
  },
  async delete(req, res) {
    try {
      await User.delete(req.body.id);

      let results = await User.all();

      return res.render('admin/users/index', {
        users: results.rows,
        success: 'Usuário deletado com sucesso. 😁',
      });
    } catch (error) {
      let results = await User.all();
      return res.render('admin/users/index', {
        users: results.rows,
        error: 'Erro ao deletar usuário. 😅',
      });
    }
  },
};
