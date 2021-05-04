const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const {
  IsUserAuthenticated,
  IsUserAdmin,
} = require('../app/middlewares/session');

const Recipes = require('../app/controllers/RecipesController');

routes.get('/', IsUserAuthenticated, Recipes.index);
routes.get('/create', IsUserAdmin, Recipes.create);
routes.get('/:id', Recipes.show);
routes.get('/:id/edit', Recipes.edit);

routes.post('/', multer.array('photos', 5), Recipes.post);
routes.put('/', multer.array('photos', 5), Recipes.put);
routes.delete('/', Recipes.delete);

module.exports = routes;
