const Recipe = require('../models/Recipe');

const { checkAllFields } = require('../../lib/utils');

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) return res.send(fillAllFields.error);

  if (req.files.length == 0) {
    return res.send('Por favor, envie uma imagem.');
  }

  next();
}

async function put(req, res, next) {
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) return res.send(fillAllFields.error);

  next();
}

async function exclude(req, res, next) {
  const { id } = req.body;
  const { userId } = req.session;

  const recipe = await Recipe.find(id);

  if (req.session.isAdmin || userId === recipe.user_id) {
    next();
    return;
  }

  return res.redirect('/admin/recipes');
}

module.exports = {
  post,
  put,
  exclude,
};
