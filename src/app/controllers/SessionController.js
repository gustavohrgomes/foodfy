module.exports = {
  loginForm(req, res) {
    return res.render('session/login');
  },
  login(req, res) {
    return res.redirect('/admin');
  },
};
