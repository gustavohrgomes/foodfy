const Recipes = require('../models/Recipe');
const Chefs = require('../models/Chefs');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
  async index(req, res) {
    let results = await Recipes.all();
    const recipes = results.rows;

    return res.render('admin/recipes/index', { recipes });
  },
  async create(req, res) {
    let results = await Chefs.all();
    const chefOptions = results.rows;

    return res.render('admin/recipes/create', { chefOptions });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    if (req.files.length == 0) {
      return res.send('Por favor, envie pelo menos 1 foto!');
    }

    let results = await Recipes.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map(async file => {
      const results = await File.create(file);
      const file_id = results.rows[0].id;

      const data = {
        file_id,
        recipe_id: recipeId,
      };

      await RecipeFile.create(data);
    });

    await Promise.all(filesPromise);

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Recipes.find(id);
    const recipe = results.rows[0];

    return res.render('admin/recipes/show', { recipe });
  },
  async edit(req, res) {
    const { id } = req.params;

    let results = await Chefs.all();
    const chefOptions = results.rows;

    results = await Recipes.find(id);
    const recipe = results.rows[0];

    if (!recipe) {
      return res.send('Receita não encontrada!');
    }

    return res.render('admin/recipes/edit', {
      recipe,
      chefOptions,
    });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (let key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    await Recipes.update(req.body);

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    const { id } = req.body;

    await Recipes.delete(id);
    res.redirect('/admin/recipes');
  },
};
