const data = require('../../data.json');

module.exports = {
  index(req, res) {
    return res.render('public/index', { items: data.recipes });
  },

  about(req, res) {
    return res.render('public/about');
  },

  recipes(req, res) {
    return res.render('public/recipes', { items: data.recipes });
  },

  show(req, res) {
    const recipeIndex = req.params.index;
    const recipe = [...data.recipes];

    return res.render('public/recipe', { recipe: recipe[recipeIndex] });
  },

  chefs(req, res) {
    return res.render('public/chefs');
  },
};
