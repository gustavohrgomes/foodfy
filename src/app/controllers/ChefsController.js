const Chef = require('../models/Chef');

module.exports = {
  async index(req, res) {
    let results = await Chef.all();
    const chefs = results.rows;

    return res.render('admin/chefs/index', { chefs });
  },
  create(req, res) {
    return res.render('admin/chefs/create');
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (value of keys) {
      if (req.body[value] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    let results = await Chef.create(req.body);
    const chefId = results.rows[0].id;

    return res.redirect(`/admin/chefs/${chefId}`);
  },
  async show(req, res) {
    const { id } = req.params;

    let results = await Chef.find(id);
    const chef = results.rows[0];

    results = await Chef.getChefRecipes(id);
    const recipes = results.rows;

    return res.render('admin/chefs/show', { chef, recipes });
  },
  async edit(req, res) {
    const { id } = req.params;

    let results = await Chef.find(id);
    const chef = results.rows[0];

    if (!chef) return res.send('Chef não encontrado!');

    return res.render('admin/chefs/edit', { chef });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Por favor, preencha todos os campos!');
      }
    }

    await Chef.update(req.body);

    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    const { id } = req.body;

    await Chef.delete(id);

    res.redirect('/admin/chefs');
  },
};
