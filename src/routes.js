const express = require('express');
const routes = express.Router();
const recipes = require('./app/controllers/RecipesController');
const admin = require('./app/controllers/AdminController');
const chefs = require('./app/controllers/ChefsController.js');

// Public Routes
routes.get('/', recipes.index);
routes.get('/about', recipes.about);
routes.get('/recipes', recipes.recipes);
routes.get('/recipes/:index', recipes.show);
routes.get('/chefs', recipes.chefs);

// Admin Routes
routes.get('/admin/recipes', admin.index); // Mostrar a lista de receitas
routes.get('/admin/recipes/create', admin.create); // Mostrar formulário de nova receita
routes.get('/admin/recipes/:id', admin.show); // Exibir detalhes de uma receita
routes.get('/admin/recipes/:id/edit', admin.edit); // Mostrar formulário de edição de receita

routes.post('/admin/recipes', admin.post); // Cadastrar nova receita
routes.put('/admin/recipes', admin.put); // Editar uma receita
routes.delete('/admin/recipes', admin.delete); // Deletar uma receita

// Admin Chef Routes
routes.get('/admin/chefs', chefs.index);
routes.get('/admin/chefs/create', chefs.create);
routes.get('/admin/chefs/:id', chefs.show);
routes.get('/admin/chefs/:id/edit', chefs.edit);

routes.post('/admin/chefs', chefs.post);
routes.put('/admin/chefs', chefs.put);
routes.delete('/admin/chefs', chefs.delete);

module.exports = routes;
