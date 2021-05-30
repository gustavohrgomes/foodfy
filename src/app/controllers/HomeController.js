const LoadChefService = require('../services/LoadChefService');
const LoadRecipeService = require('../services/LoadRecipeService');

const { getParams } = require('../../lib/utils');

module.exports = {
  async index(req, res) {
    try {
      const recipes = await LoadRecipeService.load('recipes');
      recipes.splice(6, recipes.length);
      return res.render('home/index', { recipes });
    } catch (error) {
      throw new Error(error);
    }
  },
  about(req, res) {
    return res.render('home/about');
  },
  async recipes(req, res) {
    try {
      const queryParams = getParams(req.query, 6);
      const recipes = await LoadRecipeService.load('recipes', queryParams);
      const pagination = { page: queryParams.page };

      recipes.length == 0
        ? (pagination.total = 1)
        : (pagination.total = Math.ceil(recipes[0].total / queryParams.limit));

      if (queryParams.filter)
        return res.render('search/index', {
          recipes,
          filter: queryParams.filter,
          pagination,
        });

      return res.render('home/recipes', {
        recipes,
        pagination,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
  async show(req, res) {
    try {
      const recipe = await LoadRecipeService.load('recipe', req.params.id);
      if (!recipe) res.send('Receita não encontrada!');
      return res.render('home/recipe', { recipe });
    } catch (error) {
      throw new Error(error);
    }
  },
  async chefs(req, res) {
    try {
      const chefs = await LoadChefService.load('chefs');
      return res.render('home/chefs', { chefs });
    } catch (error) {
      throw new Error(error);
    }
  },
};
