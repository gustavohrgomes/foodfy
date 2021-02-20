const Recipes = require('../models/Recipe');
const Chefs = require('../models/Chefs');

module.exports = {
  index(req, res) {
    Recipes.all(function (recipes) {
      return res.render('main/index', { recipes });
    });
  },
  about(req, res) {
    return res.render('main/about');
  },
  recipes(req, res) {
    let { filter } = req.query;

    if (filter) {
      Recipes.findby(filter, function (recipes) {
        return res.render('main/recipes', { recipes, filter });
      });
    } else {
      Recipes.all(function (recipes) {
        return res.render('main/recipes', { recipes });
      });
    }
  },
  show(req, res) {
    Recipes.find(req.params.id, function (recipe) {
      return res.render('main/recipe', { recipe });
    });
  },
  chefs(req, res) {
    Chefs.all(function (chefs) {
      return res.render('main/chefs', { chefs });
    });
  },
};
