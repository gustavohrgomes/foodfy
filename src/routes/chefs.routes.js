const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const { IsUserAdmin } = require('../app/middlewares/session');

const Chefs = require('../app/controllers/ChefsController.js');

const ChefValidator = require('../app/validators/chef');

routes.get('/', Chefs.index);
routes.get('/create', IsUserAdmin, Chefs.create);
routes.get('/:id', Chefs.show);
routes.get('/:id/edit', IsUserAdmin, Chefs.edit);

routes.post(
  '/',
  IsUserAdmin,
  multer.array('photos', 1),
  ChefValidator.post,
  Chefs.post,
);
routes.put(
  '/',
  IsUserAdmin,
  multer.array('photos', 1),
  ChefValidator.put,
  Chefs.put,
);
routes.delete('/', IsUserAdmin, Chefs.delete);

module.exports = routes;
