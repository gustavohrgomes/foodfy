const Chefs = require('../models/Chefs');

module.exports = {
  index(req, res) {
    Chefs.getAllChefs(function (chefs) {
      return res.render('admin/chefs/index', { chefs });
    });
  },
  create(req, res) {
    return res.render('admin/chefs/create');
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    Chefs.create(req.body, function (chef) {
      return res.redirect(`/admin/chefs/${chef.id}`);
    });
  },
  show(req, res) {
    Chefs.getChef(req.params.id, function (chef) {
      return res.render('admin/chefs/show', { chef });
    });
  },
  edit(req, res) {
    return res.render('admin/chefs/edit');
  },
  put(req, res) {
    return res.send('atualizar chef');
  },
  delete(req, res) {
    return res.send('deletar chef');
  },
};
