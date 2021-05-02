const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

const chefs = require('./chefs.routes');
const recipes = require('./recipes.routes');

routes.use('/admin/chefs', chefs);
routes.use('/admin/recipes', recipes);

// Public Routes
routes.get('/', HomeController.index);
routes.get('/about', HomeController.about);
routes.get('/recipes', HomeController.recipes);
routes.get('/recipes/search', HomeController.recipes);
routes.get('/recipes/:id', HomeController.show);
routes.get('/chefs', HomeController.chefs);

// Alias
routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes');
});

module.exports = routes;
