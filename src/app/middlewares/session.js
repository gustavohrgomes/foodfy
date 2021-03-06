const Recipe = require('../models/Recipe');

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

async function IsRecipeCreator(req, res, next) {
  const recipe = await Recipe.find(req.params.id);

  if (req.session.isAdmin || req.session.userId === recipe.userId) {
    next();
    return;
  }

  return res.redirect('/admin/recipes');
}

module.exports = {
  IsUserAuthenticated,
  IsUserAdmin,
  IsRecipeCreator,
};
