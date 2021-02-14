module.exports = {
  index(req, res) {
    return res.render('admin/chefs/index');
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
