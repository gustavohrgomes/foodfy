const express = require('express');
const routes = express.Router();

const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');

// Login/Logout
routes.get('/login', SessionController.loginForm);
// routes.post('/users/login', SessionController.login);
// routes.post('/users/logout', SessionController.logout);

// User Register
// routes.get('/register', UserController.registerForm);
// routes.post('/register', UserController.post);

// Rotas de perfil de um usuário logado
// routes.get('/admin/profile', ProfileController.index); // Mostrar o formulário com dados do usuário logado
// routes.put('/admin/profile', ProfileController.put); // Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/admin/users', UserController.list); // Mostrar a lista de usuários cadastrados
// routes.post('/admin/users', UserController.post); // Cadastrar um usuário
// routes.get('/admin/users/create', UserController.create); // Mostrar o formulário de criação de um usuário
// routes.put('/admin/users/:id', UserController.put); // Editar um usuário
// routes.get('/admin/users/:id/edit', UserController.edit); // Mostrar o formulário de edição de um usuário
// routes.delete('/admin/users/:id', UserController.delete); // Deletar um usuário

module.exports = routes;
