const data = require('../data.json');

exports.index = (req, res) => {
  return res.render('admin/recipe/index', { recipes: data.recipes });
};

exports.create = (req, res) => {
  return res.render("Recipes create");
};

exports.show = (req, res) => {
  const recipeIndex = req.params.id
  const recipe = [...data.recipes];

  console.log(recipeIndex);
  return res.render('admin/recipe/show', { recipe: recipe[recipeIndex], recipeIndex: recipeIndex });
};

exports.edit = (req, res) => {
  return res.send("Recipes edit");
};

exports.post = (req, res) => {
  return res.send("Recipes post");
};

exports.put = (req, res) => {
  return res.send("Recipes put");
};

exports.delete = (req, res) => {
  return res.send("Recipes delete");
};