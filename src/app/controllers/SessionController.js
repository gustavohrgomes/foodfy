const crypto = require('crypto');
const mailer = require('../../lib/mailer');

const User = require('../models/User');

module.exports = {
  loginForm(req, res) {
    return res.render('session/login');
  },
  login(req, res) {
    req.session.userId = req.user.id;
    req.session.isAdmin = req.user.is_admin;
    return res.redirect('/admin');
  },
  logout(req, res) {
    req.session.destroy();
    return res.redirect('/');
  },
  forgotForm(req, res) {
    return res.render('session/forgot-password');
  },
  async forgot(req, res) {
    const { user } = req;

    try {
      // token para o usuário
      const token = crypto.randomBytes(20).toString('hex');

      // criar uma expiração do token
      let now = new Date();
      now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      });

      // enviar o email com um link de recuperação de senha
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@foodfy.com.br',
        subject: 'Redefinição de senha',
        html: `
          <h2>Esqueceu sua senha?</h2>      
          <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
          <p>
            <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
              Recuperar senha
            </a>
          </p>
        `,
      });

      // avisar o usuário que enviamos o email
      return res.render('session/forgot-password', {
        success: `Email de redefinição de senha enviado! 😁 \n Verifique sua caixa de entrada`,
      });
    } catch (error) {
      console.error(error);
      return res.render('session/forgot-password', {
        error: 'Ops, algo deu errado... 😥 \n Por favor, tente novamente!',
      });
    }
  },
};
