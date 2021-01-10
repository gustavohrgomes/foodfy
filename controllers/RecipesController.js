const data = require('../data.json');

exports.index = (req, res) => {
  return res.render('admin/recipes', { recipes: data.recipes });
};

exports.create = (req, res) => {
  return res.send("Recipes create");
};

exports.show = (req, res) => {
  return res.send("Recipes show");
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