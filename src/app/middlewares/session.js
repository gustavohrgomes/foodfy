function IsUserAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  next();
}

function IsUserAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    return res.redirect('/admin/profile');
  }

  next();
}

module.exports = {
  IsUserAuthenticated,
  IsUserAdmin,
};
