const express = require('express');
const routes = express.Router();
const { IsUserAdmin } = require('../app/middlewares/session');

const UserController = require('../app/controllers/UserController');

const UserValidator = require('../app/validators/user');

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', IsUserAdmin, UserController.list); // Mostrar a lista de usuários cadastrados
routes.post('/', IsUserAdmin, UserValidator.post, UserController.post); // Cadastrar um usuário
routes.get('/create', IsUserAdmin, UserController.create); // Mostrar o formulário de criação de um usuário
routes.put('/:id', IsUserAdmin, UserValidator.update, UserController.put); // Editar um usuário
routes.get('/:id/edit', IsUserAdmin, UserValidator.edit, UserController.edit); // Mostrar o formulário de edição de um usuário
// routes.delete('/admin/users/:id', UserController.delete); // Deletar um usuário

module.exports = routes;
