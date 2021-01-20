const fs = require("fs");
const data = require("../data.json");

exports.index = (req, res) => {
  return res.render("admin/recipe/index", { recipes: data.recipes });
};

exports.create = (req, res) => {
  return res.render("admin/recipe/create");
};

exports.show = (req, res) => {
  const recipeIndex = req.params.id;
  const recipe = [...data.recipes];

  console.log(recipeIndex);
  return res.render("admin/recipe/show", {
    recipe: recipe[recipeIndex],
    recipeIndex: recipeIndex,
  });
};

exports.edit = (req, res) => {
  const recipeIndex = req.params.id;
  const recipe = [...data.recipes];

  return res.render("admin/recipe/edit", { recipe: recipe[recipeIndex] });
};

exports.post = (req, res) => {
  const keys = Object.keys(req.body);

  for (value of keys) {
    if (req.body[value] == "") {
      return res.send("Por favor, preencha todos os campos!");
    }
  }

  let { image, ingredients, preparation, information } = req.body;

  data.recipes.push({
    image,
    ingredients,
    preparation,
    information,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Error ao salvar receita :(");

    return res.redirect("/admin/recipes");
  });
};

exports.put = (req, res) => {
  return res.send("Recipes put");
};

exports.delete = (req, res) => {
  return res.send("Recipes delete");
};
