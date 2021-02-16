const Recipes = require('../models/Recipe');
const Chefs = require('../models/Chefs');

module.exports = {
  index(req, res) {
    Recipes.getAllRecipes(function (recipes) {
      return res.render('main/index', { recipes });
    });
  },

  about(req, res) {
    return res.render('main/about');
  },

  recipes(req, res) {
    Recipes.getAllRecipes(function (recipes) {
      return res.render('main/recipes', { recipes });
    });
  },

  show(req, res) {
    Recipes.getRecipe(req.params.id, function (recipe) {
      return res.render('main/recipe', { recipe });
    });
  },

  chefs(req, res) {
    Chefs.getAllChefs(function (chefs) {
      return res.render('main/chefs', { chefs });
    });
  },
};
