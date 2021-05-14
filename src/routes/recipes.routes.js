const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const { IsUserAdmin } = require('../app/middlewares/session');

const Recipes = require('../app/controllers/RecipesController');

routes.get('/', Recipes.index);
routes.get('/create', Recipes.create);
routes.get('/:id', Recipes.show);
routes.get('/:id/edit', Recipes.edit);

routes.post('/', multer.array('photos', 5), Recipes.post);
routes.put('/', multer.array('photos', 5), Recipes.put);
routes.delete('/', IsUserAdmin, Recipes.delete);

module.exports = routes;
