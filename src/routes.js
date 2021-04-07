const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');

const Home = require('./app/controllers/HomeController');
const Recipes = require('./app/controllers/RecipesController');
const Chefs = require('./app/controllers/ChefsController.js');

// Public Routes
routes.get('/', Home.index);
routes.get('/about', Home.about);
routes.get('/recipes', Home.recipes);
routes.get('/recipes/search', Home.recipes);
routes.get('/recipes/:id', Home.show);
routes.get('/chefs', Home.chefs);

// Admin
routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes');
});

// Recipes Admin
routes.get('/admin/recipes', Recipes.index);
routes.get('/admin/recipes/create', Recipes.create);
routes.get('/admin/recipes/:id', Recipes.show);
routes.get('/admin/recipes/:id/edit', Recipes.edit);

routes.post('/admin/recipes', multer.array('photos', 5), Recipes.post);
routes.put('/admin/recipes', multer.array('photos', 5), Recipes.put);
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
