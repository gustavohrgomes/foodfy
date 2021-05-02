const express = require('express');
const routes = express.Router();

const main = require('./main.routes');
const chefs = require('./chefs.routes');
const recipes = require('./recipes.routes');

routes.use(main);
routes.use('/admin/chefs', chefs);
routes.use('/admin/recipes', recipes);

// Alias
routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes');
});

module.exports = routes;
