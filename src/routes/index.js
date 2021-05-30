const express = require('express');
const routes = express.Router();

const main = require('./main.routes');
const session = require('./session.routes');
const profile = require('./profile.routes');
const users = require('./users.routes');
const chefs = require('./chefs.routes');
const recipes = require('./recipes.routes');

const {
  IsUserAuthenticated,
  IsUserAdmin,
} = require('../app/middlewares/session');

routes.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
routes.use(main);
routes.use(session);
routes.use('/admin/users', IsUserAuthenticated, IsUserAdmin, users);
routes.use('/admin/chefs', IsUserAuthenticated, chefs);
routes.use('/admin/recipes', IsUserAuthenticated, recipes);
routes.use('/admin/profile', IsUserAuthenticated, profile);

// Alias
routes.get('/admin', (req, res) => {
  return res.redirect('/admin/profile');
});

module.exports = routes;
