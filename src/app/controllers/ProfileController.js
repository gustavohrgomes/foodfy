const User = require('../models/User');

module.exports = {
  index(req, res) {
    const { user } = req;

    return res.render('admin/profile/index', { user });
  },
  async put(req, res) {
    try {
      const { user } = req;
      let { name, email } = req.body;

      await User.update(user.id, {
        name,
        email,
      });

      return res.render('admin/profile/index', {
        user: req.body,
        success: 'Seu cadastro foi atualizado com sucesso. 🚀',
      });
    } catch (error) {
      res.render('admin/profile/index', {
        user: req.body,
        error: 'Ops... Algo deu errado! 😓',
      });
      throw new Error(error);
    }
  },
};
