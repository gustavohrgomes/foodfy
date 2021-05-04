function IsUserAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  next();
}

function IsUserAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    // TODO: Mudar o res.send() por um res.redirect,
    // assim como na função acima.
    return res.send('Você não é um administrador.');
  }

  next();
}

module.exports = {
  IsUserAuthenticated,
  IsUserAdmin,
};
