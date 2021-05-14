const express = require('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController');

const UserValidator = require('../app/validators/user');

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', UserController.list); // Mostrar a lista de usuários cadastrados
routes.post('/', UserValidator.post, UserController.post); // Cadastrar um usuário
routes.get('/create', UserController.create); // Mostrar o formulário de criação de um usuário
routes.put('/:id', UserValidator.update, UserController.put); // Editar um usuário
routes.get('/:id/edit', UserValidator.edit, UserController.edit); // Mostrar o formulário de edição de um usuário
routes.delete('/:id', UserValidator.exclude, UserController.delete); // Deletar um usuário

module.exports = routes;
