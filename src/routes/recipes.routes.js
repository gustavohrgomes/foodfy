const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const { IsRecipeCreator } = require('../app/middlewares/session');

const Recipes = require('../app/controllers/RecipesController');

const RecipeValidator = require('../app/validators/recipe');

routes.get('/', Recipes.index);
routes.get('/create', Recipes.create);
routes.get('/:id', Recipes.show);
routes.get('/:id/edit', IsRecipeCreator, Recipes.edit);

routes.post('/', multer.array('photos', 5), RecipeValidator.post, Recipes.post);
routes.put('/', multer.array('photos', 5), RecipeValidator.put, Recipes.put);
routes.delete('/', RecipeValidator.exclude, Recipes.delete);

module.exports = routes;
