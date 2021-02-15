const data = require('../../data.json');

module.exports = {
  index(req, res) {
    return res.render('main/index', { items: data.recipes });
  },

  about(req, res) {
    return res.render('main/about');
  },

  recipes(req, res) {
    return res.render('main/recipes', { items: data.recipes });
  },

  show(req, res) {
    const recipeIndex = req.params.index;
    const recipe = [...data.recipes];

    return res.render('main/recipe', { recipe: recipe[recipeIndex] });
  },

  chefs(req, res) {
    return res.render('main/chefs');
  },
};
