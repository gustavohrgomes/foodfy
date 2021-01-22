const data = require("../data.json");

exports.index = (req, res) => {
  return res.render("public/index", { items: data.recipes });
};

exports.about = (req, res) => {
  return res.render("public/about");
};

exports.recipes = (req, res) => {
  return res.render("public/recipes", { items: data.recipes });
};

exports.show = (req, res) => {
  const recipeIndex = req.params.index;
  const recipe = [...data.recipes];

  return res.render("public/recipe", { recipe: recipe[recipeIndex] });
};
