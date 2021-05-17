const crypto = require('crypto');
const mailer = require('../../lib/mailer');

const User = require('../models/User');

module.exports = {
  registerForm(req, res) {
    return res.send('formulário de cadastro de usuário!');
  },
  async list(req, res) {
    let results = await User.all();
    const users = results.rows;

    return res.render('admin/users/index', { users });
  },
  create(req, res) {
    return res.render('admin/users/create');
  },
  async post(req, res) {
    try {
      const { name, email, is_admin } = req.body;
      const password = crypto.randomBytes(5).toString('hex');

      const userData = {
        name,
        email,
        password,
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
      await User.delete(req.body.id);

      let results = await User.all();

      return res.render('admin/users/index', {
        users: results.rows,
        success: 'Usuário deletado com sucesso. 😁',
      });
    } catch (error) {
      let results = await User.all();
      return res.render('admin/users/index', {
        users: results.rows,
        error: 'Erro ao deletar usuário. 😅',
      });
    }
  },
};
