const express = require("express");
const nunjucks = require("nunjucks");
const data = require("./data.json");
const routes = require("./routes");
const methodOverride = require("method-override");

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static("./public"));
server.use(methodOverride("_method"));
server.use(routes);

server.set("view engine", "njk");

nunjucks.configure("./views", {
  express: server,
  noCache: true,
});

routes.get("/", (req, res) => {
  res.render("index", { items: data.recipes });
});

routes.get("/about", (req, res) => {
  res.render("about");
});

routes.get("/recipes", (req, res) => {
  res.render("recipes", { items: data.recipes });
});

routes.get("/recipes/:index", (req, res) => {
  const recipeIndex = req.params.index;
  const recipe = [...data.recipes];

  //console.log(recipeIndex)
  //console.log(recipe)
  console.log(recipe[recipeIndex]);
  res.render("recipe", { recipe: recipe[recipeIndex] });
});

server.listen(3333, () => {
  console.log("Server is running");
});
