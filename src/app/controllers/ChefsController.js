const { getChefRecipes } = require('../models/Chefs');
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
    const { id } = req.params;

    Chefs.find(id, function (chef) {
      Chefs.getChefRecipes(id, function (recipes) {
        return res.render('admin/chefs/show', { chef, recipes });
      });
    });
  },
  edit(req, res) {
    const { id } = req.params;

    Chefs.find(id, function (chef) {
      if (!chef) res.send('Chef não encontrado!');

      return res.render('admin/chefs/edit', { chef });
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    Chefs.update(req.body, function () {
      return res.redirect(`/admin/chefs/${req.body.id}`);
    });
  },
  delete(req, res) {
    const { id } = req.body;

    Chefs.delete(id, function () {
      res.redirect('/admin/chefs');
    });
  },
};
