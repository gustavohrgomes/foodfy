const Chefs = require('../models/Chefs');

module.exports = {
  index(req, res) {
    Chefs.getAllChefs(function (chefs) {
      return res.render('admin/chefs/index', { chefs });
    });
  },
  create(req, res) {
    return res.render('admin/chefs/create');
  },
  show(req, res) {
    return res.render('admin/chefs/show');
  },
  edit(req, res) {
    return res.render('admin/chefs/edit');
  },
  post(req, res) {
    return res.send('criar chef');
  },
  put(req, res) {
    return res.send('atualizar chef');
  },
  delete(req, res) {
    return res.send('deletar chef');
  },
};
