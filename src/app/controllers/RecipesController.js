const path = require('path');
const Recipe = require('../models/Recipe');

const recipesDataPath = path.resolve('src', 'data.json');

module.exports = {
  index(req, res) {
    Recipe.getAllRecipes(function (recipes) {
      return res.render('admin/recipes/index', { recipes });
    });
  },

  create(req, res) {
    return res.render('admin/recipes/create');
  },

  show(req, res) {
    const recipeIndex = req.params.id;
    const recipe = [...data.recipes];

    return res.render('admin/recipes/show', {
      recipe: recipe[recipeIndex],
      recipeIndex: recipeIndex,
    });
  },

  edit(req, res) {
    const recipeIndex = req.params.id;
    const recipe = [...data.recipes];

    return res.render('admin/recipes/edit', {
      recipe: recipe[recipeIndex],
      recipeIndex: recipeIndex,
    });
  },

  post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    let { image, ingredients, preparation, information } = req.body;

    data.recipes.push({
      image,
      ingredients,
      preparation,
      information,
    });

    fs.writeFile(recipesDataPath, JSON.stringify(data, null, 2), err => {
      if (err) return res.send('Erro ao salvar receita');

      return res.redirect('/admin/recipes');
    });
  },

  put(req, res) {
    const { id, ingredients, preparation, information } = req.body;

    let index = 0;

    const foundRecipe = data.recipes.find((recipe, foundIndex) => {
      if (id == foundIndex) {
        index = foundIndex;
        return true;
      }
    });

    if (!foundRecipe) return res.send('Receita não encontrada!');

    const recipe = {
      ...foundRecipe,
      ingredients,
      preparation,
      information: information.trim(),
    };

    data.recipes[index] = recipe;

    fs.writeFile(recipesDataPath, JSON.stringify(data, null, 2), err => {
      if (err) return res.send('Erro ao editar receita');

      return res.redirect('/admin/recipes');
    });
  },

  delete(req, res) {
    const { id } = req.body;

    const filteredRecipes = data.recipes.filter((_, recipeIndex) => {
      return recipeIndex != id;
    });

    data.recipes = filteredRecipes;

    fs.writeFile(recipesDataPath, JSON.stringify(data, null, 2), err => {
      if (err) return res.send('Erro ao deletar receita');

      return res.redirect('/admin/recipes');
    });
  },
};
