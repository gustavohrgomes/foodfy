const express = require('express');
const routes = express.Router();

const main = require('./main.routes');
const session = require('./session.routes');
const profile = require('./profile.routes');
const users = require('./users.routes');
const chefs = require('./chefs.routes');
const recipes = require('./recipes.routes');

routes.use(main);
routes.use(session);
routes.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
routes.use('/admin/users', users);
routes.use('/admin/chefs', chefs);
routes.use('/admin/recipes', recipes);
routes.use('/admin/profile', profile);

// Alias
routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes');
});

module.exports = routes;
