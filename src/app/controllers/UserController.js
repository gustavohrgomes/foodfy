const crypto = require('crypto');
const { hash } = require('bcryptjs');
const { unlinkSync } = require('fs');

const User = require('../models/User');
const LoadRecipeService = require('../services/LoadRecipeService');

const mailer = require('../../lib/mailer');

module.exports = {
  registerForm(req, res) {
    return res.send('formulário de cadastro de usuário!');
  },
  async list(req, res) {
    try {
      const users = await User.all();
      return res.render('admin/users/index', { users });
    } catch (error) {
      console.log(error);
    }
  },
  create(req, res) {
    return res.render('admin/users/create');
  },
  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;
      const password = crypto.randomBytes(5).toString('hex');
      const encryptedPassword = await hash(password, 8);

      const userData = {
        name,
        email,
        password: encryptedPassword,
        is_admin,
      };

      await User.create(userData);

      await mailer.sendMail({
        to: email,
        from: 'no-reply@foodfy.com.br',
        subject: 'Bem vindo ao Foodfy',
        html: `
          <h2>Olá <strong>${name}</strong>,</h2>
          <p>Seja muito bem-vindo(a) ao <strong>Foodfy</strong> 😃</p>
          <p>Seu cadastro foi realizado com sucesso! Aqui estão seus dados:</p>
          <p>Login: ${email}</p>
          <p>Senha: ${password}</p>
          <br>
          <h3>Como eu acesso minha Conta?</h3>
          <p>
            Bem simples, você só tem que clicar no botão abaixo e acessar a plataforma com seu email e senha informados acima.
          </p>
          <p>
            <a href="http:localhost:3333/login" target="_blank">Acessar</a> 
          </p>
          <p>Equipe Foodfy.</p>
        `,
      });

      return res.redirect('/admin/users');
    } catch (error) {
      console.log(error);
      return res.render('admin/users/create', {
        error: 'Ops, algo deu errado ao criar este usuário. 😓',
      });
    }
  },
  async edit(req, res) {
    const { user } = req;

    return res.render('admin/users/edit', { user });
  },
  async put(req, res) {
    try {
      const { user } = req;
      let { name, email, is_admin } = req.body;

      if (is_admin === undefined || is_admin === null) {
        is_admin = false;
      }

      await User.update(user.id, {
        name,
        email,
        is_admin,
      });

      return res.render('admin/users/edit', {
        user: req.body,
        success: 'Usuário atualizado com sucesso. 🚀',
      });
    } catch (error) {
      res.render('admin/users/edit', { error: 'Ops... Algo deu errado! 😓' });
      throw new Error(error);
    }
  },
  async delete(req, res) {
    try {
      const recipes = await LoadRecipeService.load('userRecipes', req.body.id);
      const deletedFilesPromise = recipes.map(recipe => {
        recipe.files.map(file => {
          if (
            file.path != 'public/images/chef_placeholder.png' &&
            file.path != 'public/images/recipe_placeholder.png'
          ) {
            unlinkSync(file.path);
          }
        });
      });

      await Promise.all(deletedFilesPromise);
      await User.delete({ id: req.body.id });

      const users = await User.all();

      return res.render('admin/users/index', {
        users,
        success: 'Usuário deletado com sucesso. 😁',
      });
    } catch (error) {
      const users = await User.all();
      return res.render('admin/users/index', {
        users,
        error: 'Erro ao deletar usuário. 😅',
      });
    }
  },
};
