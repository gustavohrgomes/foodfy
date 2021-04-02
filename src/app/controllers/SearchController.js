const Recipes = require('../models/Recipe');

module.exports = {
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

      return res.render('search/index', {
        recipes,
        pagination,
        filter,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
