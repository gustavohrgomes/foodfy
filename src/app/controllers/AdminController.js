const fs = require('fs');
const data = require('../../data.json');
const path = require('path');

const recipesDataPath = path.resolve('src', 'data.json');

exports.index = (req, res) => {
  return res.render('admin/recipe/index', { recipes: data.recipes });
};

exports.create = (req, res) => {
  return res.render('admin/recipe/create');
};

exports.show = (req, res) => {
  const recipeIndex = req.params.id;
  const recipe = [...data.recipes];

  return res.render('admin/recipe/show', {
    recipe: recipe[recipeIndex],
    recipeIndex: recipeIndex,
  });
};

exports.edit = (req, res) => {
  const recipeIndex = req.params.id;
  const recipe = [...data.recipes];

  return res.render('admin/recipe/edit', {
    recipe: recipe[recipeIndex],
    recipeIndex: recipeIndex,
  });
};

exports.post = (req, res) => {
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
};

exports.put = (req, res) => {
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
};

exports.delete = (req, res) => {
  const { id } = req.body;

  const filteredRecipes = data.recipes.filter((_, recipeIndex) => {
    return recipeIndex != id;
  });

  data.recipes = filteredRecipes;

  fs.writeFile(recipesDataPath, JSON.stringify(data, null, 2), err => {
    if (err) return res.send('Erro ao deletar receita');

    return res.redirect('/admin/recipes');
  });
};
