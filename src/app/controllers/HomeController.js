const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
  async index(req, res) {
    try {
      let results = await Recipe.all();
      const recipes = results.rows;

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
      let { filter, page, limit } = req.query;

      page = page || 1;
      limit = limit || 6;

      let offset = limit * (page - 1);

      const queryParams = {
        filter,
        limit,
        offset,
      };

      let results = await Recipe.recipes(queryParams);
      const recipes = results.rows;

      const pagination = {};

      if (recipes.length == 0) {
        pagination.total = 1;
        pagination.page = page;
      } else {
        pagination.total = Math.ceil(recipes[0].total / limit);
        pagination.page = page;
      }

      if (filter) {
        return res.render('search/index', {
          recipes,
          pagination,
          filter,
        });
      }

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
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      results = await Recipe.files(recipe.id);
      const files = results.rows.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          'public',
          '',
        )}`,
      }));

      return res.render('home/recipe', { recipe, files });
    } catch (error) {
      throw new Error(error);
    }
  },
  async chefs(req, res) {
    let results = await Chef.all();
    const chefs = results.rows;

    return res.render('home/chefs', { chefs });
  },
};