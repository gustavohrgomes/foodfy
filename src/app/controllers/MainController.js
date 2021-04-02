const Recipes = require('../models/Recipe');
const Chefs = require('../models/Chefs');

module.exports = {
  async index(req, res) {
    try {
      let results = await Recipes.all();
      const recipes = results.rows;

      return res.render('home/index', { recipes });
    } catch (error) {
      throw new Error(error);
    }
  },
  about(req, res) {
    return res.render('public/about');
  },
  async recipes(req, res) {
    try {
      let { filter, page, limit } = req.query;

      page = page || 1;
      limit = limit || 6;

      let offset = limit * (page - 1);

      const queryParams = {
        filter,
        page,
        limit,
        offset,
      };

      let results = await Recipes.paginate(queryParams);
      const recipes = results.rows;

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
      };

      return res.render('public/recipes', {
        recipes,
        pagination,
        filter,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
  async show(req, res) {
    try {
      let results = await Recipes.find(req.params.id);
      const recipe = results.rows[0];

      return res.render('public/recipe', { recipe });
    } catch (error) {
      throw new Error(error);
    }
  },
  async chefs(req, res) {
    let results = await Chefs.all();
    const chefs = results.rows;

    return res.render('public/chefs', { chefs });
  },
};
