const express = require('express');
const routes = express.Router();
const main = require('./app/controllers/MainController');
const recipes = require('./app/controllers/RecipesController');
const chefs = require('./app/controllers/ChefsController.js');

// Public Routes
routes.get('/', main.index);
routes.get('/about', main.about);
routes.get('/recipes', main.recipes);
routes.get('/recipes/:index', main.show);
routes.get('/chefs', main.chefs);

// Admin
routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes');
});

// Recipes Admin
routes.get('/admin/recipes', recipes.index);
routes.get('/admin/recipes/create', recipes.create);
routes.get('/admin/recipes/:id', recipes.show);
routes.get('/admin/recipes/:id/edit', recipes.edit);

routes.post('/admin/recipes', recipes.post);
routes.put('/admin/recipes', recipes.put);
routes.delete('/admin/recipes', recipes.delete);

// Chef Admin
routes.get('/admin/chefs', chefs.index);
routes.get('/admin/chefs/create', chefs.create);
routes.get('/admin/chefs/:id', chefs.show);
routes.get('/admin/chefs/:id/edit', chefs.edit);

routes.post('/admin/chefs', chefs.post);
routes.put('/admin/chefs', chefs.put);
routes.delete('/admin/chefs', chefs.delete);

module.exports = routes;
