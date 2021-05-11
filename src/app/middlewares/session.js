function IsUserAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  next();
}

function IsUserAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    // TODO: Melhorar a forma como o moddleware valida
    // se o usuário é admin ou não
    return res.send({
      error:
        'Desculpe, parece que você não possui permissões para criar receitas. 😅',
    });
  }

  next();
}

module.exports = {
  IsUserAuthenticated,
  IsUserAdmin,
};
