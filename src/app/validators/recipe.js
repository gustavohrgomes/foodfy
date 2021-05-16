const Recipe = require('../models/Recipe');

async function exclude(req, res, next) {
  const { id } = req.body;
  const { userId } = req.session;

  const results = await Recipe.find(id);
  const recipe = results.rows[0];

  if (req.session.isAdmin || userId === recipe.user_id) {
    next();
    return;
  }

  return res.redirect('/admin/recipes');
}

module.exports = {
  exclude,
};
