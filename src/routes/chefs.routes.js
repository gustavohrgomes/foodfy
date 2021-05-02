const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');

const Chefs = require('../app/controllers/ChefsController.js');

routes.get('/', Chefs.index);
routes.get('/create', Chefs.create);
routes.get('/:id', Chefs.show);
routes.get('/:id/edit', Chefs.edit);

routes.post('/', multer.array('photos', 1), Chefs.post);
routes.put('/', multer.array('photos', 1), Chefs.put);
routes.delete('/', Chefs.delete);

module.exports = routes;
