const express = require('express');
const routes = express.Router();
const Main = require('./app/controllers/MainController');
const Recipes = require('./app/controllers/RecipesController');
const Chefs = require('./app/controllers/ChefsController.js');
const Search = require('./app/controllers/SearchController.js');

// Public Routes
routes.get('/', Main.index);
routes.get('/about', Main.about);
routes.get('/recipes', Main.recipes);
routes.get('/recipes/search', Search.recipes);
routes.get('/recipes/:id', Main.show);
routes.get('/chefs', Main.chefs);

// Admin
routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes');
});

// Recipes Admin
routes.get('/admin/recipes', Recipes.index);
routes.get('/admin/recipes/create', Recipes.create);
routes.get('/admin/recipes/:id', Recipes.show);
routes.get('/admin/recipes/:id/edit', Recipes.edit);

routes.post('/admin/recipes', Recipes.post);
routes.put('/admin/recipes', Recipes.put);
routes.delete('/admin/recipes', Recipes.delete);

// Chef Admin
routes.get('/admin/chefs', Chefs.index);
routes.get('/admin/chefs/create', Chefs.create);
routes.get('/admin/chefs/:id', Chefs.show);
routes.get('/admin/chefs/:id/edit', Chefs.edit);

routes.post('/admin/chefs', Chefs.post);
routes.put('/admin/chefs', Chefs.put);
routes.delete('/admin/chefs', Chefs.delete);

module.exports = routes;
