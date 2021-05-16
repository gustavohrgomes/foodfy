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
  forgot(req, res) {},
};
