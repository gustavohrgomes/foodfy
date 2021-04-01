const Recipes = require('../models/Recipe');

module.exports = {
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

        return res.render('search/index', {
          recipes,
          pagination,
          filter,
        });
      },
    };

    Recipes.paginate(queryParams);
  },
};
