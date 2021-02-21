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
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 6;

    let offset = limit * (page - 1);

    const queryParams = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {
        const pagination = {
          total: Math.ceil(recipes[0].total / limit),
          page,
        };

        return res.render('main/recipes', {
          recipes,
          pagination,
          filter,
        });
      },
    };

    Recipes.paginate(queryParams);
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
