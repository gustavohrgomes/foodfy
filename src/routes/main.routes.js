const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');

// Public Routes
routes.get('/', HomeController.index);
routes.get('/about', HomeController.about);
routes.get('/recipes', HomeController.recipes);
routes.get('/recipes/search', HomeController.recipes);
routes.get('/recipes/:id', HomeController.show);
routes.get('/chefs', HomeController.chefs);

module.exports = routes;
