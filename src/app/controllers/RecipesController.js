const Recipes = require('../models/Recipe');

module.exports = {
  index(req, res) {
    Recipes.all(function (recipes) {
      return res.render('admin/recipes/index', { recipes });
    });
  },
  create(req, res) {
    Recipes.chefSelectOptions(function (options) {
      return res.render('admin/recipes/create', { chefOptions: options });
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    Recipes.create(req.body, function (recipe) {
      return res.redirect(`/admin/recipes/${recipe.id}`);
    });
  },
  show(req, res) {
    const { id } = req.params;

    Recipes.find(id, function (recipe) {
      return res.render('admin/recipes/show', { recipe });
    });
  },
  edit(req, res) {
    const { id } = req.params;

    Recipes.find(id, function (recipe) {
      Recipes.chefSelectOptions(function (options) {
        if (!recipe) res.send('Receita não encontrado!');

        return res.render('admin/recipes/edit', {
          recipe,
          chefOptions: options,
        });
      });
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (let key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    Recipes.update(req.body, function () {
      return res.redirect(`/admin/recipes/${req.body.id}`);
    });
  },
  delete(req, res) {
    const { id } = req.body;

    Recipes.delete(id, function () {
      res.redirect('/admin/recipes');
    });
  },
};
